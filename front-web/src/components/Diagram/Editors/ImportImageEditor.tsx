import { ImportDwgModal } from "components/Modal";
import { useState } from "react";
import { IDiagVec2 } from "../Utils/Common";

interface IDiagImportImageEditorProps {

    onApply: (svg: string, size: { width: number, height: number }) => void;
    grid: number;
}

const DiagImportImageEditor = (props: IDiagImportImageEditorProps) => {

    const [close, setClose] = useState(false);

    const toffset = 100;

    const onClose = (svg: string | IDiagVec2[], size: { width: number, height: number }) => {

        setClose(true);
        props.onApply(svg as string, size);
    };

    return (
        (close) ? (<></>) :
            (<div style={{ position: "absolute", left: `${toffset}px`, top: `${toffset}px` }}>
                <ImportDwgModal onApply={onClose} grid={props.grid}></ImportDwgModal>
            </div>)
    );
}

export default DiagImportImageEditor;