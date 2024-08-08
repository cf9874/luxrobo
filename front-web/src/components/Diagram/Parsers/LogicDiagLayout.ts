import { DiagBlockCategory, DiagBlockConst, IDiagBlockInfoScheme, IDiagLinkInfoScheme } from "../Models/Block";
import { IDiagBlockProps } from "../Widgets/Block";
import { IDiagBlockLinkInfo, IDiagLogicLinkInfo } from "../Widgets/LogicLinks";
import { DiagUtil, IDiagLine, IDiagVec2 } from "../Utils/Common";
import { info } from "console";
import { FederatedPointerEvent } from "pixi.js";


interface ILayoutParams {

    pos: IDiagVec2;
    nextAdd: IDiagVec2;
    clampAdd: IDiagVec2;
    clamp: number;
    count: number;
}

export interface IDiagLogicBlockProps extends IDiagBlockProps {

    target_block_id: string[];
}

interface ILayoutInfo {

    blocks: IDiagLogicBlockProps[];
    links: IDiagLogicLinkInfo;
};

export class LogicDiagLayout {

    private static readonly connOffsetR = 51;
    private static readonly connOffsetT = 49;
    private static readonly connOffsetB = -53;

    static layout(json: string, onClick: (id: string, e: FederatedPointerEvent) => void): ILayoutInfo {

        const layout = LogicDiagLayout.layoutInfo();

        const o = JSON.parse(json);
        const infos: IDiagBlockInfoScheme[] = o.blocks;
        const linkInfos: IDiagLinkInfoScheme[] = o.links;

        infos.push(LogicDiagLayout.makePowerScheme());

        const margin = 200;
        const minPos = { x: 0, y: 0 };
        const blocks: IDiagLogicBlockProps[] = [];
        for (const i of infos) {

            if (DiagBlockConst.category(DiagBlockCategory.Subpart) === i.category) {
                continue;
            }

            const a = layout.get(i.category);
            if (!a) {
                throw new Error(`Invalid logic's JSON!!!! category: ${i.category}`);
            }

            const pos = a.shift();
            if (!pos) {
                console.log(a, layout);
                throw new Error(`Overflow!!!! category: ${i.category}`);
            }

            const l = linkInfos.find((V) => (V.block_id === i.block_id));

            if (pos.x < minPos.x) {
                minPos.x = pos.x;
            }

            if (pos.y < minPos.y) {
                minPos.y = pos.y;
            }

            blocks.push({
                id: DiagUtil.id(),
                pos: {
                    x: pos.x,
                    y: pos.y,
                    r: 0
                },
                model: {
                    // block_id: i.block_id,
                    // index: i.index,
                    // category: i.category,
                    // name: i.name,
                    // color: i.color,
                    // part_id: i.part_id,
                    // part_name: i.part_name,
                    // // symbol_image: (LogicDiagLayout.isCustom(i.category)) ? (i.icon) : (i.symbol_image),
                    // icon: i.icon,
                    // type: i.type
                    ...i
                },
                selected: false,
                onClick,
                target_block_id: LogicDiagLayout.getValidTarget(l)
            });
        }

        minPos.x = -minPos.x + margin;
        minPos.y = -minPos.y + margin;
        for (const b of blocks) {
            b.pos.x = b.pos.x + minPos.x;
            b.pos.y = b.pos.y + minPos.y;
        }

        let links: IDiagLogicLinkInfo = { conns: [], links: [], mainLink: null };
        if (o.links) {

            links = LogicDiagLayout.calcLinks(blocks, linkInfos);
        }

        return { blocks, links };
    }

    private static getValidTarget(t: IDiagLinkInfoScheme | undefined) {

        const rt = [] as string[];
        if (t) {

            for (const b of t.target_blocks) {
                if (b.link_status) {
                    rt.push(b.target_block_id);
                }
            }
        }
        
        return rt;
    }

    private static isCustom(t: string): boolean {

        return (DiagBlockConst.category(DiagBlockCategory.Custom) === t);

    }

    static findMcu(target: IDiagLogicBlockProps[]): IDiagLogicBlockProps {

        const mcu = target.find(v => (v.model.category === DiagBlockConst.category(DiagBlockCategory.MCU)));
        if (!mcu) {
            throw new Error(`No MCU!`);
        }

        return mcu;
    }

    static calcLinkInfo(b: IDiagLogicBlockProps, blocks: IDiagLogicBlockProps[], mcu: IDiagLogicBlockProps) {

        // if (!b.target_block_id) {
        //     return undefined;
        // }

        if ((b.model.category === DiagBlockConst.category(DiagBlockCategory.MCU)) || (b.model.category === DiagBlockConst.category(DiagBlockCategory.Subpart))) {

            throw new Error(`Not implemented!`);
        }

        const rt = [] as IDiagBlockLinkInfo[];
        for (const targetBlockId of b.target_block_id) {

            const t = blocks.find((v) => (v.model.block_id === targetBlockId));
            if (!t) {
                throw new Error(`No target! (${b.target_block_id})`);
            }

            // let offset = this.connOffset(b.model.category, { x: b.pos.x, y: b.pos.y }, { x: mcu.pos.x, y: mcu.pos.y });
            let offset = this.connOffset(b, t, { x: mcu.pos.x, y: mcu.pos.y });
            const p1 = {
                x: b.pos.x + offset.x,
                y: b.pos.y + offset.y
            };

            offset = LogicDiagLayout.targetConnOffset(t, b);
            const p2 = {
                x: t.pos.x + offset.x,
                y: t.pos.y + offset.y
            }

            rt.push({ block_id: b.model.block_id, target_block_id: t.model.block_id, p1, p2 });
        }

        return rt;
    }

    static calcLinks(blocks: IDiagLogicBlockProps[], info: IDiagBlockLinkInfo[] | IDiagLinkInfoScheme[]) {

        const conns: IDiagVec2[] = [];
        const links: IDiagBlockLinkInfo[] = [];

        const mcu = LogicDiagLayout.findMcu(blocks);
        for (const i of info) {

            const b = blocks.find(v => (v.model.block_id === i.block_id));
            if (!b) {
                throw new Error(`Invalid block's ID (${i.block_id})`);
            }

            if ((b.model.category === DiagBlockConst.category(DiagBlockCategory.MCU)) || (b.model.category === DiagBlockConst.category(DiagBlockCategory.Subpart))) {

                continue;
            }

            const l = LogicDiagLayout.calcLinkInfo(b, blocks, mcu);
            if (l.length > 0) {

                links.push(...l);
                conns.push(...l.map((v) => (v.p2)));
            }

        }

        const powerBlock: IDiagBlockProps | undefined = blocks.find(v => (v.model.category === DiagBlockConst.category(DiagBlockCategory.Power)));
        if (!powerBlock) {
            throw new Error(`Invalid proc!`);
        }

        let mainLink = null;
        let offset = LogicDiagLayout.mainConnOffset(DiagBlockConst.category(DiagBlockCategory.MCU), DiagBlockConst.category(DiagBlockCategory.Power));
        const p1 = { x: mcu.pos.x + offset.x, y: mcu.pos.y + offset.y };
        conns.push(p1);

        offset = LogicDiagLayout.mainConnOffset(DiagBlockConst.category(DiagBlockCategory.Power), DiagBlockConst.category(DiagBlockCategory.MCU));
        const p2 = { x:  powerBlock.pos.x + offset.x, y: powerBlock.pos.y + offset.y };
        conns.push(p2);

        mainLink = { p1, p2 };

        return { conns, links, mainLink };
    }

    // private static links(blocks: IDiagLogicBlockProps[], linkInfos: IDiagLinkInfoScheme[]): IDiagLogicLinkInfo {

    //     const conns: IDiagVec2[] = [];
    //     const links: IDiagBlockLinkInfo[] = [];

    //     // const categories: string[] = [];

    //     const mcu = LogicDiagLayout.findMcu(blocks);
    //     for (const i of linkInfos) {

    //         const b = blocks.find(v => (v.model.block_id === i.block_id));
    //         if (!b) {
    //             throw new Error(`Invalid block's ID (${i.block_id})`);
    //         }

    //         if ((b.model.category === DiagBlockConst.category(DiagBlockCategory.MCU)) || (b.model.category === DiagBlockConst.category(DiagBlockCategory.Subpart))) {

    //             continue;
    //         }

    //         const l = LogicDiagLayout.calcLinkInfo(b, blocks, mcu);
    //         if (l.length > 0) {

    //             links.push(...l);

    //             // if (categories.indexOf(b.model.category) < 0) {

    //                 conns.push(...l.map((v) => (v.p2)));
    //                 // categories.push(b.model.category);
    //             // }
    //         }
    //     }

    //     const powerBlock: IDiagBlockProps | undefined = blocks.find(v => (v.model.category === DiagBlockConst.category(DiagBlockCategory.Power)));
    //     if (!powerBlock) {
    //         throw new Error(`Invalid proc!`);
    //     }

    //     let mainLink = null;
    //     let offset = LogicDiagLayout.mainConnOffset(DiagBlockConst.category(DiagBlockCategory.MCU), DiagBlockConst.category(DiagBlockCategory.Power));
    //     const p1 = { x: mcu.pos.x + offset.x, y: mcu.pos.y + offset.y };
    //     conns.push(p1);

    //     offset = LogicDiagLayout.mainConnOffset(DiagBlockConst.category(DiagBlockCategory.Power), DiagBlockConst.category(DiagBlockCategory.MCU));
    //     const p2 = { x:  powerBlock.pos.x + offset.x, y: powerBlock.pos.y + offset.y };
    //     conns.push(p2);

    //     mainLink = { p1, p2 };

    //     return { conns, links, mainLink };
    // }

    private static _connOffset(e: string, s: IDiagVec2, c: IDiagVec2): IDiagVec2 {

        switch (e) {

            case DiagBlockConst.category(DiagBlockCategory.Custom):
            case DiagBlockConst.category(DiagBlockCategory.Input):
            case DiagBlockConst.category(DiagBlockCategory.PowerIn):
                return { x: 0, y: LogicDiagLayout.connOffsetT };

            case DiagBlockConst.category(DiagBlockCategory.Output):
            case DiagBlockConst.category(DiagBlockCategory.PowerOut):
                return { x: 0, y: LogicDiagLayout.connOffsetB };


            case DiagBlockConst.category(DiagBlockCategory.Comm):
            case DiagBlockConst.category(DiagBlockCategory.Battery):
                return (s.y > c.y) ? ({ x: 0, y: LogicDiagLayout.connOffsetB }) : ({ x: 0, y: LogicDiagLayout.connOffsetT });
        }

        throw new Error(`Invalid block's category`);
    }

    private static connOffset(o: IDiagLogicBlockProps, t: IDiagLogicBlockProps, c: IDiagVec2): IDiagVec2 {

        switch (t.model.category) {
            case DiagBlockConst.category(DiagBlockCategory.MCU):
            case DiagBlockConst.category(DiagBlockCategory.Power):
                return LogicDiagLayout._connOffset(o.model.category, o.pos, c);
        }

        return LogicDiagLayout._targetConnOffset(o, t);
    }

    private static mainConnOffset(m: string, t: string): IDiagVec2 {

        if (m === DiagBlockConst.category(DiagBlockCategory.MCU)) {

            switch (t) {

                case DiagBlockConst.category(DiagBlockCategory.Custom): return { x: 0, y: LogicDiagLayout.connOffsetB };
                case DiagBlockConst.category(DiagBlockCategory.Input): return { x: 0, y: LogicDiagLayout.connOffsetB };
                case DiagBlockConst.category(DiagBlockCategory.Output): return { x: 0, y: LogicDiagLayout.connOffsetT };
                case DiagBlockConst.category(DiagBlockCategory.Comm): return { x: -LogicDiagLayout.connOffsetR, y: 0 };
                case DiagBlockConst.category(DiagBlockCategory.Power): return { x: LogicDiagLayout.connOffsetR, y: 0 };
            }

            throw new Error(`Invalid block's category (${m} ${t})`);

        } else if (m === DiagBlockConst.category(DiagBlockCategory.Power)) {

            switch (t) {

                case DiagBlockConst.category(DiagBlockCategory.Battery): return { x: LogicDiagLayout.connOffsetR, y: 0 };
                case DiagBlockConst.category(DiagBlockCategory.PowerIn): return { x: 0, y: LogicDiagLayout.connOffsetB };
                case DiagBlockConst.category(DiagBlockCategory.PowerOut): return { x: 0, y: LogicDiagLayout.connOffsetT };
                case DiagBlockConst.category(DiagBlockCategory.MCU): return { x: -LogicDiagLayout.connOffsetR, y: 0 };
            }

            throw new Error(`Invalid block's category (${m} ${t})`);

        } else {

            throw new Error(`Invalid block's category (${m} ${t})`);

        }
    }

    private static _targetConnOffset(t: IDiagLogicBlockProps, o: IDiagLogicBlockProps): IDiagVec2 {

        const x = o.pos.x - t.pos.x;
        const y = o.pos.y - t.pos.y;
        if (Math.abs(x) > Math.abs(y)) {

            const rt = { x: LogicDiagLayout.connOffsetR, y: 0 };
            if (x < 0)
                rt.x = -rt.x;

            return rt;

        } else {

            return {
                x: 0,
                y: (y > 0) ? (LogicDiagLayout.connOffsetT) : (LogicDiagLayout.connOffsetB)
            };
        }
    }

    private static targetConnOffset(t: IDiagLogicBlockProps, o: IDiagLogicBlockProps): IDiagVec2 {

        if (t.model.category === DiagBlockConst.category(DiagBlockCategory.MCU)) {

            switch (o.model.category) {

                case DiagBlockConst.category(DiagBlockCategory.Custom): return { x: 0, y: LogicDiagLayout.connOffsetB };
                case DiagBlockConst.category(DiagBlockCategory.Input): return { x: 0, y: LogicDiagLayout.connOffsetB };
                case DiagBlockConst.category(DiagBlockCategory.Output): return { x: 0, y: LogicDiagLayout.connOffsetT };
                case DiagBlockConst.category(DiagBlockCategory.Comm): return { x: -LogicDiagLayout.connOffsetR, y: 0 };
                case DiagBlockConst.category(DiagBlockCategory.Power): return { x: LogicDiagLayout.connOffsetR, y: 0 };
            }

            throw new Error(`Invalid block's category (${o.model.category} ${t.model.category})`);

        } else if (t.model.category === DiagBlockConst.category(DiagBlockCategory.Power)) {

            switch (o.model.category) {

                case DiagBlockConst.category(DiagBlockCategory.Battery): return { x: LogicDiagLayout.connOffsetR, y: 0 };
                case DiagBlockConst.category(DiagBlockCategory.PowerIn): return { x: 0, y: LogicDiagLayout.connOffsetB };
                case DiagBlockConst.category(DiagBlockCategory.PowerOut): return { x: 0, y: LogicDiagLayout.connOffsetT };
                case DiagBlockConst.category(DiagBlockCategory.MCU): return { x: -LogicDiagLayout.connOffsetR, y: 0 };
            }

            throw new Error(`Invalid block's category (${o.model.category} ${t.model.category})`);

        } else {

            return LogicDiagLayout._targetConnOffset(t, o);
        }        

        throw new Error(`Not implemented. (category: ${t.model.category})`)
    }

    private static layoutInfo(): Map<string, IDiagVec2[]> {

        const mainPosX = 170;
        const subPosX = mainPosX + 180;
        const customPosX = -subPosX - 560;

        const gapX = 120;
        const gapY = 180;

        const subPosY1 = 260;
        const subPosY2 = 85;

        const db = new Map<string, IDiagVec2[]>();

        db.set(DiagBlockConst.category(DiagBlockCategory.Custom), LogicDiagLayout.genArray({

            // pos: DiagUtil.addVec2({ x: customPosX, y: -subPosY1 }, offset),
            pos: { x: customPosX, y: -subPosY1 },
            nextAdd: { x: -gapX, y: 0 },
            clampAdd: { x: 0, y: -gapY },
            clamp: 4,
            count: 12

        }));

        // db.set(DiagBlockConst.category(DiagBlockCategory.Subpart), LogicDiagLayout.genArray({
        db.set(DiagBlockConst.category(DiagBlockCategory.Power), LogicDiagLayout.genArray({

            // pos: DiagUtil.addVec2({ x: mainPosX, y: 0 }, offset),
            pos: { x: mainPosX, y: 0 },
            nextAdd: { x: 0, y: 0 },
            clampAdd: { x: 0, y: 0 },
            clamp: 1,
            count: 1

        }));

        db.set(DiagBlockConst.category(DiagBlockCategory.Input), LogicDiagLayout.genArray({

            // pos: DiagUtil.addVec2({ x: -subPosX, y: -subPosY1 }, offset),
            pos: { x: -subPosX, y: -subPosY1 },
            nextAdd: { x: -gapX, y: 0 },
            clampAdd: { x: 0, y: -gapY },
            clamp: 4,
            count: 12

        }));

        db.set(DiagBlockConst.category(DiagBlockCategory.Output), LogicDiagLayout.genArray({

            // pos: DiagUtil.addVec2({ x: -subPosX, y: subPosY1 }, offset),
            pos: { x: -subPosX, y: subPosY1 },
            nextAdd: { x: -gapX, y: 0 },
            clampAdd: { x: 0, y: gapY },
            clamp: 4,
            count: 12

        }));

        db.set(DiagBlockConst.category(DiagBlockCategory.Battery), LogicDiagLayout.genArray({

            // pos: DiagUtil.addVec2({ x: subPosX, y: -subPosY2 }, offset),
            pos: { x: subPosX, y: -subPosY2 },
            nextAdd: { x: 0, y: gapY },
            clampAdd: { x: gapX, y: 0 },
            clamp: 2,
            count: 6

        }));

        db.set(DiagBlockConst.category(DiagBlockCategory.Comm), LogicDiagLayout.genArray({

            // pos: DiagUtil.addVec2({ x: -subPosX, y: -subPosY2 }, offset),
            pos: { x: -subPosX, y: -subPosY2 },
            nextAdd: { x: 0, y: gapY },
            clampAdd: { x: -gapX, y: 0 },
            clamp: 2,
            count: 6

        }));

        db.set(DiagBlockConst.category(DiagBlockCategory.MCU), LogicDiagLayout.genArray({

            // pos: DiagUtil.addVec2({ x: -mainPosX, y: 0}, offset),
            pos: { x: -mainPosX, y: 0},
            nextAdd: { x: 0, y: 0 },
            clampAdd: { x: 0, y: 0 },
            clamp: 1,
            count: 1

        }));

        db.set(DiagBlockConst.category(DiagBlockCategory.PowerIn), LogicDiagLayout.genArray({

            // pos: DiagUtil.addVec2({ x: subPosX, y: -subPosY1 }, offset),
            pos: { x: subPosX, y: -subPosY1 },
            nextAdd: { x: gapX, y: 0 },
            clampAdd: { x: 0, y: -gapY },
            clamp: 4,
            count: 12

        }));

        db.set(DiagBlockConst.category(DiagBlockCategory.PowerOut), LogicDiagLayout.genArray({

            // pos: DiagUtil.addVec2({ x: subPosX, y: subPosY1 }, offset),
            pos: { x: subPosX, y: subPosY1 },
            nextAdd: { x: gapX, y: 0 },
            clampAdd: { x: 0, y: gapY },
            clamp: 4,
            count: 12

        }));

        return db;

    }

    private static genArray(p: ILayoutParams): IDiagVec2[] {

        const rt: IDiagVec2[] = [];

        for (let i = 0; i < p.count; ++i) {

            rt.push({
                x: p.pos.x + ((i % p.clamp) * p.nextAdd.x) + (Math.floor(i / p.clamp) * p.clampAdd.x),
                y: p.pos.y + ((i % p.clamp) * p.nextAdd.y) + (Math.floor(i / p.clamp) * p.clampAdd.y)
            });
        }

        return rt;
    }

    private static makePowerScheme(): IDiagBlockInfoScheme {

        const block_id = 'Power';
        const type = block_id;
        const category = DiagBlockConst.category(DiagBlockCategory.Power);

        return {
            block_id,
            index: "1",
            category,
            name: 'Power',
            color: '',
            description: '',
            footprint_image: '',
            icon: '/icons/power.svg',
            option_names: {
                additionalProp1: '',
                additionalProp2: '',
                additionalProp3: ''
            },
            part_id: '',
            part_image: '',
            part_name: '',
            specification: '',
            symbol_image: '',
            type,
            is_updated: false
        };

        // return {
        //     block_id,
        //     category,
        //     name: 'Power',
        //     color: '',
        //     part_id: '',
        //     part_name: '',
        //     symbol_image: 'icons/power.svg',
        //     type

        // };

    }
}