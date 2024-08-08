import { IOutLinerModalProps, OutLinerModal } from "components/Modal/modal.outliner";

export interface IOutlineUiEditorProps extends IOutLinerModalProps {

    x: number;
    y: number;
}

const OutlineUiEditor = (props: IOutlineUiEditorProps) => {

    return (
        <div style={{ position: "absolute", left: `${props.x}px`, top: `${props.y}px` }}>
            <OutLinerModal {...props} />
        </div>
    );
}

export default OutlineUiEditor;
