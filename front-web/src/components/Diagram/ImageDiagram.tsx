import { Graphics as _Graphics } from "pixi.js";
import { Container, Graphics, Sprite, Stage } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import { IImageDiagProps } from "type";
import { IDiagVec2 } from "./Utils/Common";
import { DiagGrid } from "./Widgets/Grid";

const convertSvgString = (width: number, height: number, data: string): string => {

    return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
        width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">${data}</svg>`;
}

const convertRectString = (x: number, y: number, f: string): string => {

    return `<rect x="${x}" y="${y}" width="1" height="1" fill="${f}"/>`;
}

const isColored = (r: number, g: number, b: number, a: number): boolean => {

    if ((a === 0) || ((r + g + b) === (255 * 3))) {
        return false;
    }

    return true;
}

const NotColored = (r: number, g: number, b: number, a: number): boolean => {

    return !isColored(r, g, b, a);
}

const ImageDiag = (props: IImageDiagProps) => {

    const [zoomScale, setZoomScale] = useState(1);

    const [image, setImage] = useState('');
    const [imageSize, setImageSize] = useState({ width: 0, height: 0});

    const gridProps = {
        sx: 0,
        sy: 0,
        width: props.width,
        height: props.height,
        lineWidth: 1,
        lineColor: 0xe5e5e5,
        interval: props.grid,
        fillColor: 0xf0f0f0,
        onClick: () => {

            // props.onRelease();
        }
    };

    const onLoadImage = (ev: ProgressEvent<FileReader>) =>{

        if (ev.target) {

            const data = ev.target.result as string;
            if (data) {

                const image = new Image();
                image.src = data;
                image.onload = () => {
                    
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (ctx) {

                        const width = image.width;
                        const height = image.height;

                        canvas.width = width;
                        canvas.height = height;

                        ctx.drawImage(image, 0, 0, width, height);
                        const imageData = ctx.getImageData(0, 0, image.width, image.height);

                        const skipComp = (props.invert) ? (isColored) : (NotColored);

                        const list: string[] = [];
                        for (let i = 0; i < imageData.data.length; i += 4) {

                            const pixelNumber = i / 4;
                            const x = pixelNumber % width;
                            const y = Math.floor(pixelNumber / width);

                            if (skipComp(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3])) {
                                continue;
                            }

                            const fillHex =
                                '#' + [0, 0, 0].map((color: number): string => color.toString(16).padStart(2, '0')).join('');

                            list.push(convertRectString(x, y, fillHex));
                        }

                        const rt = convertSvgString(width, height, list.join(''));
                        setImage(rt);
                        setImageSize({ width, height });

                        const cf = 0.8;
                        const sw = (props.width * cf);
                        const sh = (props.height * cf);
                        if (sw < width) {
                            setZoomScale(sw / width);
                        } else if (sh < height) {
                            setZoomScale(sh / height);
                        }

                        props.onLoadImage(image.width, image.height, rt);
                    }

                    canvas.remove();
                };
            }
        }

    };

    useEffect(() => {

        if (!props.image) {
            return;
        }

        const fr = new FileReader();
        fr.onload = onLoadImage;
        fr.readAsDataURL(props.image);

    }, [props.image, props.invert]);

    const draw = useCallback((g: _Graphics) => {

        g.clear();

        if (image) {

            g.beginFill(0xff0000);
            g.drawCircle(0, 0, 6 / zoomScale);
            g.endFill();
        }
  
      }, [image]);

    const getAnchorPos = (): IDiagVec2 => {

        const center = { x: 0, y: 0 };
        if (props.anchor === 0) {
            return { x: -(imageSize.width / 2 * zoomScale), y: -(imageSize.height / 2 * zoomScale) };
        }

        return center;
    }

    return (
        <Stage width={props.width} height={props.height} options={{ backgroundColor: 0xe6e6e6, antialias: true, autoDensity: true, resolution: window.devicePixelRatio }}>
            <Container scale={1}>
                <Container scale={zoomScale}>
                    <DiagGrid {...gridProps} zoomScale={zoomScale} interval={props.grid}/>
                    {
                        (image === '') ? (<></>)
                            : (
                                <Sprite anchor={0.5} image={image} x={props.width / 2 / zoomScale} y={props.height / 2 / zoomScale}>
                                    <Graphics draw={draw} {...getAnchorPos()} />
                                </Sprite>
                            )
                    }
                </Container>
            </Container>
        </Stage>
    );
}

export default ImageDiag;