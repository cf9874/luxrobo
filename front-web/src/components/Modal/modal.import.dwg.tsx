import { BasicModal } from "./modal.basic"
import { Col, ConfigProvider, Radio, Row } from "antd"
import modalStyles from "./modal.module.scss"
import styles from "./modal.import.file.module.scss"
import { BasicButton } from "components/Button"
import { FilePdfOutlined } from "@ant-design/icons"
import { BasicDropdown } from "components/Dropdown"
import { BasicCheckBox } from "components/CheckBox"
import { ChangeEvent, useEffect, useState } from "react"
import { IImageDiagProps } from "type"
import ImageDiag from "components/Diagram/ImageDiagram"
import DxfDiag from "components/Diagram/DxfDiagram"
import { IDiagVec2 } from "components/Diagram/Utils/Common"

let result: undefined | string | IDiagVec2[];
let imageSize = { width: 0, height: 0};

let cachedApplySize = { width: 0, height: 0 };
let cachedOriginPos = { x: 0, y: 0 };
let cachedUnit = "mm";

export const ImportDwgModal = (props: { onApply: (svg: string | IDiagVec2[], size: { width: number, height: number }, offset?: IDiagVec2) => void, grid: number, dxf?: boolean }) => {
  //Upper Left : 1
  //Center : 2
  const [origin, setOrigin] = useState(0)
  const [isInvert, setIsInvert] = useState(false)

  const [unit, setUnit] = useState("mm");

  // const fileSizeLengthinput = useInputs({ value: "" })
  // const fileSizeWidthinput = useInputs({ value: "" })
  // const applySizeLengthinput = useInputs({ value: "" })
  // const applySizeWidthinput = useInputs({ value: "" })

  const [fileSize, setFileSize] = useState({ width: 0, height: 0 });
  const [applySize, setApplySize] = useState({ width: 0, height: 0 });

  const [orgPos, setOrgPos] = useState(cachedOriginPos);

  useEffect(() => {

    cachedUnit = unit;

  }, [unit]);

  useEffect(() =>{

    cachedApplySize = applySize;

  }, [applySize]);

  useEffect(() =>{

    cachedOriginPos = orgPos;

  },[orgPos]);

  const importInputId = `import-image-input`;

  const getOrgPos = (shape: IDiagVec2[]) => {

    let pos = { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY };
    for (const p of shape) {

      pos.x = Math.min(pos.x, p.x);
      pos.y = Math.min(pos.y, p.y);
    }

    return pos;
  }

  const convertOffset = (src: IDiagVec2[]) => {

    const org = getOrgPos(src);
    return { x: cachedOriginPos.x - org.x, y: cachedOriginPos.y - org.y };
  }

  const onApply = () => {
    // console.log("apply")
    // console.log(origin, isInvert)
    // console.log(result);

    const scale = (cachedUnit === "mm") ? (1) : (10);

    if (result) {

      if (props.dxf) {

        props.onApply(
          result,
          { width: cachedApplySize.width / imageSize.width * scale, height: cachedApplySize.height / imageSize.height * scale },
          convertOffset(result as IDiagVec2[]));

      } else {

        props.onApply(result, { width: cachedApplySize.width * scale, height: cachedApplySize.height * scale }, cachedOriginPos);
      }
    }
  };

  const [image, setImage] = useState(undefined as Blob | undefined);

  const onImport = () => {
    // console.log("import")

    const e = document.getElementById(importInputId);
    e?.click();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {

    if ((e.target.files) && (e.target.files.length === 1)) {
      setImage(e.target.files[0]);
    }
  }

  const onUpdateOrgPos = () => {

    const shape = result as IDiagVec2[];
    if (!shape) {
      throw new Error(`Invalid Proc!!!`);
    }

    const pos = getOrgPos(shape);
    setOrgPos({ ...pos });
  };

  const imageDiagProps: IImageDiagProps = {

    image,
    onLoadImage: (w, h, d) => {

      imageSize.width = w;
      imageSize.height = h;

      setFileSize({ ...imageSize });
      setApplySize({ ...imageSize });

      result = d;

      if (props.dxf) {
        onUpdateOrgPos();
      }
    },
    width: 844,
    height: 670,
    grid: props.grid,
    invert: isInvert,
    anchor: origin
  };

  const onChangeApplySize = (w: number, h: number) => {

    if (w > 0) {

      cachedApplySize.width = w;
      setApplySize({ ...cachedApplySize });

    }
    
    if (h > 0) {

      cachedApplySize.height = h;
      setApplySize({ ...cachedApplySize });
    }
  };

  const onClose = () => {

    props.onApply('', { width: 0, height: 0 });
  };

  return (
    <BasicModal
      header="Import Image"
      width={1200}
      height={796}
      footer={
        <Row justify={"end"} className={modalStyles.wide_modal_button_wrapper}>
          <BasicButton onClick={onApply}>Apply</BasicButton>
        </Row>
      }
      customClose={onClose}
    >
      <Col className={styles.import_dwg_container}>
        {/* <Col className={styles.dwg_sheet}></Col> */}
        { (props.dxf) ? (<DxfDiag {...imageDiagProps}></DxfDiag>) : (<ImageDiag {...imageDiagProps} />)}
        <Col className={styles.import_img_menu}>
          <Row className={styles.import_dwg_button_wrapper}>
            <input type="file" id={importInputId} style={{visibility: "hidden"}} onChange={onChange}></input>
            <BasicButton className={styles.import_dwg_button} onClick={onImport}>
              <FilePdfOutlined /> Select {(props.dxf) ? ('DXF') : ('Image')} File...
            </BasicButton>
          </Row>
          <div className={styles.divider} />
          <Row>
            <Row className={styles.menu_title}>File Information</Row>
            <Row align={"middle"}>
              <Col className={styles.size_title}>Size</Col>
              <input
                readOnly={true}
                className={styles.size_menu_input}
                placeholder={(fileSize.height === 0) ? ("Length") : (fileSize.height.toString())}
                // value={fileSizeLengthinput.value}
                // onChange={fileSizeLengthinput.onChange}
              />
              <Col className={styles.times_text}>X</Col>
              <input
                readOnly={true}
                className={styles.size_menu_input}
                placeholder={(fileSize.width === 0) ? ("Width") : (fileSize.width.toString())}
                // value={fileSizeWidthinput.value}
                // onChange={fileSizeWidthinput.onChange}
              />
              <div className={styles.unit_box}>mm</div>
            </Row>
          </Row>
          <div className={styles.divider} />
          <Row>
            <Row className={styles.menu_title}>Apply Information</Row>
            <Row align={"middle"}>
              <Col className={styles.size_title}>Size</Col>
              <input
                className={styles.size_menu_input}
                placeholder={(applySize.height === 0) ? ("Length") : (applySize.height.toString())}
                onChange={(e) => { onChangeApplySize(0, Number(e.target.value)); }}
                // value={applySizeLengthinput.value}
                // onChange={applySizeLengthinput.onChange}
              />
              <Col className={styles.times_text}>X</Col>
              <input
                className={styles.size_menu_input}
                placeholder={(applySize.width === 0) ? ("Width") : (applySize.width.toString())}
                onChange={(e) => { onChangeApplySize(Number(e.target.value), 0); }}
                // value={applySizeWidthinput.value}
                // onChange={applySizeWidthinput.onChange}
              />
              <BasicDropdown
                className={styles.unit_dropdown}
                options={[
                  { label: "mm", value: "mm" },
                  { label: "cm", value: "cm" }
                ]}
                defaultValue={{ label: "mm", value: "mm" }}
                size="small"
                onChange={(e) => { setUnit(e); }}
              />
            </Row>
          </Row>
          <Row
            align={"middle"}
            style={{
              marginTop: 24,
            }}
          >
            <Col className={styles.size_title}>Origin</Col>
            <Radio.Group onChange={e => setOrigin(e.target.value as number)} value={origin}>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#45d6df",
                  },
                }}
              >
                <Radio value={0}>Upper Left</Radio>
              </ConfigProvider>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#45d6df",
                  },
                }}
              >
                <Radio value={1}>Center</Radio>
              </ConfigProvider>
            </Radio.Group>            
          </Row>
          {
            (props.dxf) ?
              (
                <Row align={"middle"}
                  style={{
                    marginTop: 24,
                  }}>
                  <Col className={styles.size_title}>Origin Position</Col>
                  <input
                      className={styles.origin_pos_menu_input}
                      placeholder={orgPos.x.toString()}
                      onChange={(e) => { setOrgPos({ x: Number(e.target.value), y: cachedOriginPos.y }); }}
                  />
                  <Col className={styles.times_text}></Col>
                  <input
                      className={styles.origin_pos_menu_input}
                      placeholder={orgPos.y.toString()}
                      onChange={(e) => { setOrgPos({ x: cachedOriginPos.x, y : Number(e.target.value) }); }}
                  />
                </Row>
              ) :
              (<></>)
          }
          <div className={styles.divider} />
          {
            (props.dxf) ? (<></>) :
              (
                <Row>
                  <Row align={"middle"}>
                    <ConfigProvider
                      theme={{
                        token: {
                          controlInteractiveSize: 24,
                        },
                      }}
                    >
                      <BasicCheckBox
                        className={styles.color_invert_checkbox}
                        value={isInvert}
                        onChange={() => setIsInvert(state => !state)}
                      />
                    </ConfigProvider>
                    <Col className={styles.color_invert_text}>Color Invert</Col>
                  </Row>
                </Row>
              )
          }
          
        </Col>
      </Col>
    </BasicModal>
  )
}
