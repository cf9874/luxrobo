import { TextStyle, TextStyleFontWeight, TextStyleFill } from "pixi.js";


export default class _ {

    static readonly fontFamily = 'Arial';

    private static getStyle(size: number, fontWeight: TextStyleFontWeight, fill: TextStyleFill, lineHeight?: number): TextStyle {

        return new TextStyle({

            fill,
            fontFamily: _.fontFamily,
            fontSize: size,
            lineHeight: lineHeight || size,
            fontWeight: fontWeight,
            align: 'center'

        });
        
    }

    static getB(size: number, fill: TextStyleFill = 0x000000, lineHeight?: number): TextStyle {

        return _.getStyle(size, 'bold', fill, lineHeight);
    }

    static getR(size: number, fill: TextStyleFill = 0x000000, lineHeight?: number): TextStyle {

        return _.getStyle(size, 'normal', fill, lineHeight);
    }

}