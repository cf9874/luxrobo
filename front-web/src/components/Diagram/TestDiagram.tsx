import { Container, Graphics, Sprite, Stage } from "@pixi/react";
import { EditBoardTextModal } from "components/Modal";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Texture, Graphics as _Graphics } from "pixi.js";


const TestDiag = () => {

    const [image, setImage] = useState('');

    const test = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fill-rule="evenodd">
            <path d="M80 0c11.046 0 20 8.954 20 20v60c0 11.046-8.954 20-20 20H20C8.954 100 0 91.046 0 80V20C0 8.954 8.954 0 20 0h60zm-4.142 6H20C12.28 6 6 12.28 6 20v60c0 7.72 6.28 14 14 14h60c7.72 0 14-6.28 14-14V24.143a3.979 3.979 0 0 0-1.171-2.83L78.686 7.172A3.971 3.971 0 0 0 75.858 6z" fill="#FFF"/>
            <rect width="16" height="16" rx="8" transform="translate(8 8)"/>
        </g>
    </svg>`;

    const convertSvgString = (width: number, height: number, data: string): string => {

        return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
            width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">${data}</svg>`;
    }

    const convertRectString = (x: number, y: number, f: string): string => {

        return `<rect x="${x}" y="${y}" width="1" height="1" fill="${f}"/>`;
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {

        if ((e.target.files) && (e.target.files.length === 1)) {

            const fr = new FileReader();
            fr.onload = (ev) => {

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

                                const list: string[] = [];
                                for (let i = 0; i < imageData.data.length; i += 4) {

                                    const pixelNumber = i / 4;
                                    const x = pixelNumber % width;
                                    const y = Math.floor(pixelNumber / width);
                                    const r = imageData.data[i];
                                    const g = imageData.data[i + 1];
                                    const b = imageData.data[i + 2];
                                    const a = imageData.data[i + 3];
                                    
                                    let d = 0;
                                    if ((a === 0) || ((r + g + b) === (255 * 3))) {
                                        d = 255;
                                    }

                                    const fillHex =
                                        '#' + [d, d, d].map((color: number): string => color.toString(16).padStart(2, '0')).join('');

                                    list.push(convertRectString(x, y, fillHex));
                                }

                                const rt = convertSvgString(width, height, list.join(''));
                                setImage(rt);
                            }

                            canvas.remove();
                        };
                    }                    
                }
            };

            fr.readAsDataURL(e.target.files[0]);
        }
        
    }

    const onClick = () => {

        setImage(image.replaceAll('#000000', '#111111').replaceAll('#ffffff', '#000000').replaceAll('#111111', '#ffffff'));

    }

    // return (
    //     <div>
    //         {/* <input type={"file"} onChange={onChange}></input>
    //         <button onClick={onClick}>반전!!!</button> */}
    //         <Stage width={1600} height={1200} options={{ backgroundColor: 0xe6e6e6, antialias: true, autoDensity: true, resolution: window.devicePixelRatio }}>
    //             <Container eventMode='static' onmousedown={() => { console.log('pointer'); }} >
    //                 {
    //                     (image === '') ? (<></>)
    //                         : <Sprite image={image}></Sprite>
    //                 }
    //                 {/* <Sprite image={test} tint={0x000000}></Sprite> */}
    //             </Container>
    //         </Stage>
    //         {/* <EditBoardTextModal></EditBoardTextModal> */}
    //     </div>
    // );

    const x = -200;

    const [pos, setPos] = useState({ x: 0, y: 0});

    const draw = useCallback((g: _Graphics) => {

        g.clear();
        g.lineStyle(5, 0xffffff);
        g.drawCircle(pos.x - x, pos.y, 100);

    }, [pos]);

    return (
        <Stage width={1600} height={1200} options={{ backgroundColor: 0xe6e6e6, antialias: true, autoDensity: true, resolution: window.devicePixelRatio }}>
            <Container anchor={0.5} x={x} eventMode="static" onmousemove={(e) => { setPos({ ...e.screen }) }}>
                <Sprite texture={Texture.WHITE} width={1600} height={1200} tint={0x000000}></Sprite>
                <Graphics draw={draw} />
            </Container>
        </Stage>
    );
}

export default TestDiag;