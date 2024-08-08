import { Container, Graphics, Sprite, Text } from "@pixi/react";
import { useEffect, useCallback } from "react";
import { IHitArea, Graphics as _Graphics, Texture } from "pixi.js";
import TextStyle from '../Utils/TextStyle';
import { DiagUtil, IDiagVec2 } from "../Utils/Common";

export enum EDiagRegDir {

    None,
    Down,
    Up
}

export interface IDiagRegulatorInfo {

    path: IDiagVec2[];
    siblings: number;

    x: number;
    y: number;

    dir: EDiagRegDir;

    id: string;
    type: string;
}


export interface IDiagRegulatorsProps {

    x: number;
    y: number;

    regs: IDiagRegulatorInfo[];

    onClick: (id: string) => void;
}


export const DiagRegulators = (props: IDiagRegulatorsProps) => {

    const draw = useCallback((g: _Graphics) => {

        const drawPath = (path: IDiagVec2[]) => {

            g.lineStyle(2, 0xb2b2b2);

            let i = 0;
            g.moveTo(path[i]. x, path[i].y);

            for (; i < path.length; ++i) {

                g.lineTo(path[i]. x, path[i].y);
                g.moveTo(path[i]. x, path[i].y);
            }
        };

        const drawPathNode = (path: IDiagVec2[]) => {

            g.beginFill(0xb2b2b2);
            g.lineStyle(0);

            for (const p of path) {

                g.drawCircle(p.x, p.y, 6);
            }
        };

        g.clear();

        const tr = 15;
        for (const p of props.regs) {

            const x = p.x;
            const y = p.y;

            drawPath([...p.path, { x, y }]);
            if (p.siblings > 1) {
                drawPathNode(p.path);
            }

            if (p.dir === EDiagRegDir.None) {

                // TODO: 같은 전압에서도 REG 바탕 렌더링.
                g.beginFill(0xffffff);
                g.lineStyle(2, 0xb2b2b2);
                g.drawRoundedRect(x - 64 - tr, y - 12, 64, 24, 4);

                g.beginFill(0xb2b2b2);
                g.lineStyle(0);
                g.moveTo(x, y);
                g.lineTo(x - tr, (y - (tr / 2)));
                g.lineTo(x - tr, (y + (tr / 2)));
                g.lineTo(x, y);
                g.closePath();        
                g.endFill();

            } else {

                const up = (p.dir === EDiagRegDir.Up);

                g.beginFill(0xffffff);
                g.lineStyle(2, 0xb2b2b2);
                g.drawRoundedRect(x - 32, (up) ? (y + tr) : (y - 24 - tr), 64, 24, 4);

                g.beginFill(0xb2b2b2);
                g.lineStyle(0);
                g.moveTo(x, y);
                g.lineTo(x + (tr / 2), (up) ? (y + tr) : (y - tr));
                g.lineTo(x - (tr / 2), (up) ? (y + tr) : (y - tr));
                g.lineTo(x, y);
                g.closePath();        
                g.endFill();
            }
        }

    }, [props.regs]);

    useEffect(() => {

    }, []);

    return (
        <Container x={props.x} y={props.y}>
            <Graphics draw={draw} anchor={0.5} />
            {
                props.regs.map((v) => {

                    // TODO: 같은 전압에서도 reg 렌더링.
                    // if (v.dir === EDiagRegDir.None) {
                    //     console.log(v);
                    //     return;
                    // }

                    const tx = 32 + 15;
                    const ty = 27;

                    let x = v.x;                    
                    let y = v.y;

                    if (v.dir === EDiagRegDir.None) {
                        x -= tx;
                    } if (v.dir === EDiagRegDir.Up) {
                        y += ty;
                    } else if (v.dir === EDiagRegDir.Down) {
                        y -= ty;
                    }
                    // const y = v.y + ((v.dir === EDiagRegDir.Up) ? (t) : (-t));
                    return <Container key={DiagUtil.id()}>
                        <Text text={v.type} x={x} y={y} anchor={0.5} style={TextStyle.getB(16, 0x4d4d4d)} />
                        <Sprite texture={Texture.WHITE} x={v.x} y={y} anchor={0.5} width={64} height={24} alpha={0} eventMode={'static'} onmousedown={() => { props.onClick(v.id); }}></Sprite>
                    </Container>;
                })
            }
        </Container>
    );
}