import { ImportDwgModal } from "components/Modal";
import { useState } from "react";
import { IDiagVec2 } from "../Utils/Common";

interface IDiagImportOutlineEditorProps {

    onApply: (svg: IDiagVec2[], size: { width: number, height: number }, offset?: IDiagVec2) => void;
    grid: number;
}

const DiagImportOutlineEditor = (props: IDiagImportOutlineEditorProps) => {

    const [close, setClose] = useState(false);

    const toffset = 100;

    const onClose = (vertices: string | IDiagVec2[], size: { width: number, height: number }, offset?: IDiagVec2) => {

        setClose(true);
        props.onApply(vertices as IDiagVec2[], size, offset);
    };

    return (
        (close) ? (<></>) :
            (<div style={{ position: "absolute", left: `${toffset}px`, top: `${toffset}px` }}>
                <ImportDwgModal onApply={onClose} dxf={true} grid={props.grid}></ImportDwgModal>
            </div>)
    );
}

export default DiagImportOutlineEditor;