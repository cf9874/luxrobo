
import { IDiagVec2 } from "./Common";



export class DiagGeoUtil {

    static wnPnPoly(p: IDiagVec2, v: IDiagVec2[]) {

        let wn = 0;
        for (let i = 0; i < (v.length - 1); i++) {

            if (v[i].y <= p.y) {

                if ((v[i + 1].y > p.y) && (DiagGeoUtil.isLeft(v[i], v[i+1], p) > 0)) {
                    ++wn;
                }
                        
            } else if ((v[i + 1].y <= p.y) && (DiagGeoUtil.isLeft(v[i], v[i+1], p) < 0)) {
                --wn;
            }
        }

        return wn;
    }

    static rotate(src: IDiagVec2, center: IDiagVec2, degree: number) {

        if (degree === 0) {
            return { ...src };
        }

        const x = src.x;
        const y = src.y;

        const a = center.x;
        const b = center.y;

        const t = degree * (Math.PI / 180);

        return {
            x: (x - a) * Math.cos(t) - (y - b) * Math.sin(t) + a,
            y: (x - a) * Math.sin(t) + (y - b) * Math.cos(t) + b
        };
    }

    private static isLeft(P0: IDiagVec2, P1: IDiagVec2, P2: IDiagVec2)
    {
        return ((P1.x - P0.x) * (P2.y - P0.y) - (P2.x -  P0.x) * (P1.y - P0.y));
    }
}