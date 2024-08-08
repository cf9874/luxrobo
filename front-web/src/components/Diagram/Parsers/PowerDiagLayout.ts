import { IDiagBlockInfoScheme, IDiagPowerNetInfoScheme } from "../Models/Block";
import { IDiagBlockProps } from "../Widgets/Block";
import { DiagUtil, IDiagVec2 } from "../Utils/Common";
import { IDiagPowerNet } from "../Widgets/PowerNets";
import { EDiagRegDir, IDiagRegulatorInfo } from "../Widgets/Regulators";

export interface ILineTextInfo {

    text: string;
    y: number;
}

interface ILayoutInfo {

    blocks: IDiagBlockProps[];
    lines: number[];
    lineTexts: ILineTextInfo[];
    nets: IDiagPowerNet[];
    regs: IDiagRegulatorInfo[];

    dummyPos?: IDiagVec2;
};

const dummyBlockId = "$du$mm$y";

export interface IDummbyBlockInfo {

    netName: string;
    idx: number;

    srcNet: string;
    srcId: string;
}

export class PowerDiagLayout {

    private static readonly bsize = 100;
    private static readonly gsize = 140;
    private static readonly startGap = { x: 60, y: 60 };
    private static readonly sameNetGap = 100;
    private static readonly nextNetGap = -40;

    static layout(center: IDiagVec2, json: string, onClick: (id: string) => void, dummyInfo?: IDummbyBlockInfo): ILayoutInfo {

        const bsize = PowerDiagLayout.bsize;
        const gsize = PowerDiagLayout.gsize;
        const startGap = PowerDiagLayout.startGap;
        const sameNetGap = PowerDiagLayout.sameNetGap;
        const nextNetGap = PowerDiagLayout.nextNetGap;

        const o = JSON.parse(json);

        const blockInfos: IDiagBlockInfoScheme[] = o.blocks;
        const blocks: IDiagBlockProps[] = [];

        const parsedInfo = new Map<number, IDiagPowerNetInfoScheme[]>();

        const info: IDiagPowerNetInfoScheme[] = o.powernets;

        let dummyPos: undefined | IDiagVec2;
        if (dummyInfo) {

            let t = info.find((v) => (v.net_name === dummyInfo.netName));
            if (t) {

                if (t.net_name === dummyInfo.srcNet) {

                    const i = t.group.indexOf(dummyInfo.srcId);
                    if (i < 0) {
                        throw new Error(`Not found a block. (${dummyInfo.srcId})`);
                    }

                    const temp = t.group[dummyInfo.idx];
                    t.group[dummyInfo.idx] = dummyInfo.srcId;
                    t.group[i] = temp;

                } else {

                    const rn = info.find((v) => (v.net_name === dummyInfo.srcNet));
                    if (!rn) {
                        throw new Error(`Not found a power net. (${dummyInfo.srcNet} V)`);                        
                    }

                    t.group.splice(dummyInfo.idx, 0, dummyBlockId);
                }

            } else {

                throw new Error(`Not found a group. (${dummyInfo.netName} V)`);
            }
        }

        for (let net of info) {

            const i = parsedInfo.get(net.ref_voltage);
            if (i) {

                i.push(net);

            } else {

                parsedInfo.set(net.ref_voltage, [net]);
            }
        }

        const sortedInfo = Array.from(parsedInfo, ([k, v]) => (v));
        sortedInfo.sort((a, b) => (b[0].ref_voltage - a[0].ref_voltage));

        const isLinked = (a: IDiagPowerNetInfoScheme, b: IDiagPowerNetInfoScheme) => {

            for (let o of a.outputs) {

                if (o.target_net_name === b.net_name) {
                    return -1;
                }
            }

            return 1;
        };

        const sortSameNet = (v: IDiagPowerNetInfoScheme[]) => {

            v.sort((a, b) => isLinked(a, b));
        };

        sortedInfo.forEach((v) => { sortSameNet(v); });

        const convertVoltageName = (v: number): string => {

            if (v === 12) {
                return 'VIN';
            }
    
            return v.toFixed(1) + 'V';
        };

        const lineTexts: ILineTextInfo[] = [];
        const lines: number[] = [];
        const nets: IDiagPowerNet[] = [];
        let addX = startGap.x;
        for (let d = 0; d < sortedInfo.length; ++d) {

            const i = d + 1;

            lines.push(startGap.y + (i * 178));
            lineTexts.push({
                text: convertVoltageName(sortedInfo[d][0].ref_voltage),
                y: lines[lines.length - 1]
            });

            let tempX = 0;
            for (const info of sortedInfo[d]) {

                const src: IDiagPowerNet = {

                    info: info,

                    x: addX + center.x,
                    y: startGap.y + 18 + (d * 178) + center.y,
                    w: Math.max(1, info.group.length) * gsize,
                    h: gsize
                };

                nets.push(src);

                addX = src.x + src.w + sameNetGap;
                // if (tempX === 0) {
                    tempX = src.x + src.w + nextNetGap;
                // }

                let bcount = 0;
                for (const blockId of info.group) {

                    if (blockId === dummyBlockId) {
                        
                        dummyPos = {
                            x: (bsize / 2) + src.x + 20 + (bcount * gsize) + center.x,
                            y: (bsize / 2) + src.y + 13 + center.y
                        };

                        ++bcount;
                        continue;
                    }

                    const i = blockInfos.find((v: IDiagBlockInfoScheme) => (v.block_id === blockId));
                    if (i) {

                        blocks.push({
                            id: DiagUtil.id(),
                            pos: {
                                x: (bsize / 2) + src.x + 20 + (bcount * gsize) + center.x,
                                y: (bsize / 2) + src.y + 13 + center.y,
                                r: 0
                            },                            
                            model: { ...i },
                            selected: false,
                            onClick
                        });

                        ++bcount;
                    } else {

                        console.error(info, dummyInfo);
                        throw new Error(`Not found block (ID: ${blockId})`);
                    }
                }
            }

            addX = tempX;
        }

        return { blocks, lines, lineTexts, nets, regs: PowerDiagLayout.calcRegs(sortedInfo, nets), dummyPos };
    }

    private static getPowerNet(netName: string, db: IDiagPowerNet[]): IDiagPowerNet | undefined {

        return db.find(d => (d.info.net_name === netName));
    }

    private static getRegPath(srcNet: IDiagPowerNetInfoScheme, dir: EDiagRegDir, dest: IDiagVec2, db: IDiagPowerNet[]): IDiagVec2[] {

        const n = PowerDiagLayout.getPowerNet(srcNet.net_name, db);
        if (!n) {
            throw new Error(`Not found ${srcNet.net_name}`);
        }

        const x = (dest.x < n.x) ? (n.x) : (n.x + n.w);
        const y = n.y + (n.h / 2);

        if (dir === EDiagRegDir.None) {
            return [{x, y}];
        }

        return [{ x, y }, { x: dest.x, y }];
    }

    private static calcRegs(sortedInfo: IDiagPowerNetInfoScheme[][], nets: IDiagPowerNet[]): IDiagRegulatorInfo[] {

        const rt: IDiagRegulatorInfo[] = [];

        for (const c of sortedInfo) {

            for (let i = 0; i < c.length; ++i) {

                const curNet = c[i];

                if (curNet.outputs.length > 0) {

                    for (const output of curNet.outputs) {

                        const n = PowerDiagLayout.getPowerNet(output.target_net_name, nets);
                        if (n) {

                            let x = n.x + (n.w / 2);
                            let y = n.y;

                            let dir = EDiagRegDir.Down;
                            if (n.info.ref_voltage === curNet.ref_voltage) {

                                dir = EDiagRegDir.None;
                                x = n.x;
                                y = n.y + (n.h / 2);

                            } else {

                                if (curNet.ref_voltage < n.info.ref_voltage) {

                                    dir = EDiagRegDir.Up;
                                    y += n.h;

                                } /*else if (i + 1 < c.length) {
                                
                                    const c = nets.find((v) => (v.info.net_name === curNet.net_name));
                                    if (c) {
    
                                        x = c.x + c.w + (PowerDiagLayout.bsize / 2);
    
                                    } else {
                                        
                                        throw new Error(`Not found net name: ${output.target_net_name}`);
                                    }
                                }*/
                            }

                            rt.push({

                                path: PowerDiagLayout.getRegPath(curNet, dir, { x, y }, nets),
                                siblings: curNet.outputs.length,
                                x,
                                y,
                                dir,
                                id: output.regulator_id,
                                type: output.type
                            });

                        } else {

                            throw new Error(`Not found net name: ${output.target_net_name}`);
                        }

                    }
                }
            }
        }

        return rt;        
    }
}