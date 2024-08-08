import { Graphics as _Graphics } from "pixi.js";
import { Container, Graphics, Sprite, Stage } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import { IImageDiagProps } from "type";
import { IDiagVec2 } from "./Utils/Common";
import { DiagGrid } from "./Widgets/Grid";

import { Helper } from "dxf";
import PolylineEntityData from "dxf/handlers/entity/polyline";
import { Point2D } from "dxf/Common";

const DxfDiag = (props: IImageDiagProps) => {

    const [zoomScale, setZoomScale] = useState(1);
    const [vertices, setVertices] = useState([] as IDiagVec2[]);
    const [imageSize, setImageSize] = useState({ min: { x: 0, y: 0 }, max: { x: 0, y: 0 }, width: 0, height: 0 });

    const gridProps = {
        sx: 0,
        sy: 0,
        width: props.width,
        height: props.height,
        lineWidth: 1,
        lineColor: 0xe5e5e5,
        interval: props.grid,
        fillColor: 0xf0f0f0,
        onClick: () => {}
    };

    const onLoadDxf = (ev: ProgressEvent<FileReader>) => {

        const setPolylineSize = (src: IDiagVec2[]) => {

            const min = { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY };
            const max = { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY };

            for (const v of src) {

                min.x = Math.min(v.x, min.x);
                min.y = Math.min(v.y, min.y);

                max.x = Math.max(v.x, max.x);
                max.y = Math.max(v.y, max.y);   
            }

            // center.x = (center.x - (props.width / 2)) / src.length;
            // center.y = (center.y - (props.height / 2)) / src.length;

            const width = max.x - min.x;
            const height = max.y - min.y;
            const size = { min, max, width, height };
            setImageSize(size);
            return size;
        };

        const correctVertices = (src: IDiagVec2[]) => {

            const sv = src[0];
            const ev = src[src.length - 1];

            if ((sv.x === ev.x) && (sv.y === ev.y)) {

                const t = [...src];
                t.splice(t.length - 1, 1);
                return t;
            }

            return src;
        }

        const setPolylines = (src: Point2D[]) => {

            const converted = correctVertices(src);
            setVertices([...converted]);
            const rt = setPolylineSize(converted);

            const sw = (props.width * 0.9);
            if (sw < rt.width) {
                setZoomScale(sw / rt.width);
            }

            return { data: converted, ...rt };
        };

        if (ev.target) {

            const data = ev.target.result as string;
            const helper = new Helper(data);
  
            // The 1-to-1 object representation of the DXF
            // console.log('parsed:', helper.parsed)
  
            // // Denormalised blocks inserted with transforms applied
            // console.log('denormalised:', helper.denormalised)
  
            // // Create polylines (e.g. to render in WebGL)
            // console.log('polylines:', helper.toPolylines())
            
            // console.log((helper.parsed?.entities[0]as PolylineEntityData).vertices);

            // const a = helper.denormalised?[0]

            // const src = helper.denormalised?[0]
            if (helper.denormalised) {
                const src = (helper.denormalised[0] as PolylineEntityData).vertices;
                if (src) {
                    const rt = setPolylines(src);
                    props.onLoadImage(rt.width, rt.height, rt.data);                    
                }
            }
          }

    };

    useEffect(() => {

        if (!props.image) {
            return;
        }

        const fr = new FileReader();
        fr.onload = onLoadDxf;
        fr.readAsText(props.image);

    }, [props.image, props.invert]);

    const drawBoard = useCallback((g: _Graphics) => {

        g.clear();

        if (vertices.length > 0) {

            const center = { x: imageSize.min.x + ((imageSize.max.x - imageSize.min.x) / 2), y: imageSize.min.y + ((imageSize.max.y - imageSize.min.y) / 2) };

            // g.beginFill(0xff0000);
            g.lineStyle(2 / zoomScale, 0x000000);

            const offset = { x: props.width / 2 / zoomScale, y: props.height / 2 / zoomScale };

            let i = 0;
            g.moveTo(vertices[i].x - center.x + offset.x, vertices[i].y - center.y + offset.y);

            for (; i < vertices.length; ++i) {
                g.lineTo(vertices[i].x - center.x + offset.x, vertices[i].y - center.y + offset.y);
            }

            g.lineTo(vertices[0].x - center.x + offset.x, vertices[0].y - center.y + offset.y);

            g.endFill();
        }

    }, [vertices]);

    const draw = useCallback((g: _Graphics) => {

        if (vertices.length > 0) {

            g.clear();

            g.beginFill(0xff0000);
            g.drawCircle(0, 0, 6);
            g.endFill();
        }
  
      }, [vertices]);

    const getAnchorPos = (): IDiagVec2 => {

        const center = { x: props.width / 2, y: props.height / 2 };
        if (props.anchor === 0) {

            return { x: center.x - (imageSize.width / 2 * zoomScale), y: center.y - (imageSize.height / 2 * zoomScale) };
        }

        return center;
    }

    return (
        <Stage width={props.width} height={props.height} options={{ backgroundColor: 0xe6e6e6, antialias: true, autoDensity: true, resolution: window.devicePixelRatio }}>
            <Container scale={1}>
                <Container  scale={zoomScale}>
                    <DiagGrid {...gridProps} zoomScale={zoomScale} interval={props.grid}/>
                    <Graphics draw={drawBoard}/>
                </Container>
                <Graphics draw={draw} {...getAnchorPos()} />
            </Container>
        </Stage>
    );
}

export default DxfDiag;