import { ISettingDiameterModalProps } from "components/Modal/modal.set.diameter";
import { IDiagGridProps } from "../Widgets/Grid";
import { SettingDiameterModal } from "components/Modal";
import { IDiagVec2 } from "../Utils/Common";
import { MutableRefObject, useEffect } from "react";

interface IDiagHoleUiEditorProps extends ISettingDiameterModalProps {

    gridProps: IDiagGridProps;
    gridPos: IDiagVec2;
    zoomScale: number;

    rootRef: MutableRefObject<HTMLElement | null>;
}

let cachedGridPos: IDiagVec2 = { x: 0, y: 0};
let cachedZoomScale: number = 1;

const DiagHoleUiEditor = (props: IDiagHoleUiEditorProps) => {

    const toffset = 50;

    useEffect(() => {

        cachedGridPos = props.gridPos;

    }, [props.gridPos]);

    useEffect(() => {

        cachedZoomScale = props.zoomScale;

    }, [props.zoomScale]);

    const getOffset = (): IDiagVec2 => {

        if (props.rootRef) {
            
            const r = props.rootRef.current?.getBoundingClientRect();
            if (r) {
                return { x: window.scrollX + r.left, y: window.scrollY + r.top };
            }
        }

        return { x: 0, y: 0 };
    };

    return (
        <div style={{ position: "absolute", left: `${(getOffset().x + props.target.pos.x) * cachedZoomScale + cachedGridPos.x}px`, top: `${(getOffset().y + props.target.pos.y) * cachedZoomScale + cachedGridPos.y + toffset}px` }}>
            <SettingDiameterModal {...props} />
        </div>
    );
}

export default DiagHoleUiEditor;