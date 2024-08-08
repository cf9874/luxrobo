import { IDiagBlockInfoScheme, IDiagLayoutInfoScheme, ILayoutDiagPos, ILayoutDiagBlockScheme, ILayoutDiagTextScheme, ILayoutDiagImageScheme, ILayoutDiagHoleScheme } from "../Models/Block";
import { DiagUtil, IDiagVec2 } from "../Utils/Common";
import { IDiagLayoutBlockProps } from "../Widgets/LayoutBlock";
import { IDiagLayoutHoleProps } from "../Widgets/LayoutHoles";
import { IDiagLayoutImageProps } from "../Widgets/LayoutImage";
import { IDiagLayoutTextProps } from "../Widgets/LayoutText";

interface ILayoutInfo {

    blocks: IDiagLayoutBlockProps[];
    shape: ILayoutDiagPos[];
    texts: IDiagLayoutTextProps[];
    images: IDiagLayoutImageProps[];
    holes: IDiagLayoutHoleProps[];
};

export class LayoutDiagLayout {

    static layout(center: IDiagVec2, json: string, onClickWidget: (id: string) => void): ILayoutInfo {

        const o = JSON.parse(json);

        const blockInfo: IDiagBlockInfoScheme[] = o.blocks;
        const layout: IDiagLayoutInfoScheme = o.layout;

        const blocks: IDiagLayoutBlockProps[] = [];
        for (const b of layout.layout_blocks) {

            const i = blockInfo.find((v) => (v.block_id === b.block_id));
            if (!i) {
                throw new Error(`Not found block! (ID: ${b.block_id})`);
            }

            blocks.push({
                id: DiagUtil.id(),
                pos: { ...DiagUtil.addVec2(b.pos, center), r: b.pos.r },
                is_placed: b.is_placed,
                is_top: b.is_top,
                model: {
                    ...i,
                    layoutInfo: b
                },
                selected: false,
                isTop: false,
                onClick: onClickWidget
            });
        }

        const shape = layout.shape;
        const texts = LayoutDiagLayout.parseTexts(layout.text_blocks, onClickWidget);
        const images = LayoutDiagLayout.parseImages(layout.image_blocks, onClickWidget);
        const holes = LayoutDiagLayout.parseHoles(layout.hole_blocks);
        return { blocks, shape, texts, images, holes };
    }

    static parseText(src: ILayoutDiagTextScheme, onClick: (id: string) => void): IDiagLayoutTextProps {

        return {
            ...src,
            id: DiagUtil.id(),            
            model: src,
            selected: false,
            isTop: false,
            onClick
        };
    }

    private static parseTexts(src: ILayoutDiagTextScheme[], onClick: (id: string) => void): IDiagLayoutTextProps[] {

        return src.map((t) => (LayoutDiagLayout.parseText(t, onClick)));
    }

    static parseImage(src: ILayoutDiagImageScheme, onClick: (id: string) => void): IDiagLayoutImageProps {

        return {
            ...src,
            id: DiagUtil.id(),            
            model: src,
            selected: false,
            isTop: false,
            onClick
        };
    }

    private static parseImages(src: ILayoutDiagImageScheme[], onClick: (id: string) => void): IDiagLayoutImageProps[] {

        return src.map((t) => (LayoutDiagLayout.parseImage(t, onClick)));
    }

    private static parseHoles(src: ILayoutDiagHoleScheme[]): IDiagLayoutHoleProps[] {

        return src.map((t) => ({
            ...t,
            id: DiagUtil.id(),
            model: t,
            selected: false,
            isTop: false
        }));
    }

    static convertBlockInfo(blocks: IDiagLayoutBlockProps[]) {

        const layoutBlocks: ILayoutDiagBlockScheme[] = [];
        for (const b of blocks) {

            layoutBlocks.push({
                ...b.model.layoutInfo,
                pos: { ...b.pos },
                is_placed: b.is_placed,
                is_top: b.is_top
            });
        }

        return layoutBlocks;
    }

    static convertImageInfo(images: IDiagLayoutImageProps[]) {

        const layoutImages: ILayoutDiagImageScheme[] = [];
        for (const i of images) {

            layoutImages.push({
                ...i.model,
                is_top: i.is_top,
                image_str: i.image_str,
                pos: i.pos
            });
        }

        return layoutImages;
    }

    static convertTextInfo(texts: IDiagLayoutTextProps[]) {

        const layoutTexts: ILayoutDiagTextScheme[] = [];
        for (const t of texts) {

            layoutTexts.push({
                ...t.model,
                string: t.string,
                font_size: t.font_size,
                is_top: t.is_top
            });
        }

        return layoutTexts;
    }

    static convertHoleInfo(holes: IDiagLayoutHoleProps[]) {

        const layoutHoles: ILayoutDiagHoleScheme[] = [];
        for (const h of holes) {

            layoutHoles.push({
                ...h.model,
                pos: h.pos,
                diameter: h.diameter
            });
        }

        return layoutHoles;
    }
}