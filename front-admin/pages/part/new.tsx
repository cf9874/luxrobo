import { NextPage } from "next"
import styles from "./partDetail.module.scss"
import { Col, Divider, Image, Row } from "antd"
import { apiManager, apiUtil } from "@/apis"
import { PageFrameFooter } from "@/components/layout"
import {
  PartNewDescDetail,
  PartNewDesc,
  PartNewDescDType,
  PartNewDescEType,
  PartNewDescTableDetail,
  PartNewDescBType,
  partNewNullInfo,
} from "@/components/pages/part/newDesc"
import { ObjectDescription } from "@/components/Description"
import { PARTNEW } from "@/const"
import { useRouter } from "next/router"
import { useAsyncEffect } from "@/hooks"
import { useState } from "react"
import { BasicInput, BasicInputArea } from "@/components/Input"
import { BasicTable } from "@/components/Table"
import { FileButton } from "@/components/Button"
import { BasicSelect, ToolFeatureCategorySelection, ToolFeatureKindSelection } from "@/components/Select"
import { IOPOrtPinTypeSelection, IOPortTypeSelection } from "@/components/Select"
import { PartDto } from "@/apis/dto/part.dto"
import { API_ERROR_MSG } from "@/const/api.error.const"
import { JSONFormChecker } from "@/utils"
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"

//------------------------------------------------------------------------------------------------------
// [Main]
const ToolDetail: NextPage = () => {
  const router = useRouter()
  //-------------------------------------------------------------------------
  // [Datas]
  const [partInfo, setPartInfo] = useState<PartDto>(partNewNullInfo)
  const [partDescB, setPartDescB] = useState<PartNewDescBType>({
    category: partNewNullInfo.category,
    type: partNewNullInfo.type,
    optionsRawData: JSON.stringify({ ...partNewNullInfo.options }, null, 4),
    apiRawData: JSON.stringify(
      (() => {
        const { part_name, part_image, category, type, schematics_file, pcb_board_file, options, ...partRawData } =
          partNewNullInfo

        return partRawData
      })(),
      null,
      4,
    ),
  })
  const [partSchema, setPartSchema] = useState<PartNewDescDType[]>([{}] as PartNewDescDType[])
  const [partIOPorts, setPartIOPorts] = useState<PartNewDescEType[]>([{}] as PartNewDescEType[])

  // files
  const [versionList, setVersionList] = useState<number[]>([1])
  const [versionUpdated, setVersionUpdated] = useState<string>(undefined)
  const [fileversion, setFileVersion] = useState<number>(1)

  const [thumbNail, setThumbNail] = useState<File>(null)
  const [thumbNailURL, setThumbNailURL] = useState<string>(null)
  const [schematicFile, setSchematicFile] = useState<File>(null)
  const [schematicFileURL, setSchematicFileURL] = useState<string>(null)
  const [PCBBoardFile, setPCBBoardFile] = useState<File>(null)
  const [PCBBoardFileURL, setPCBBoardFileURL] = useState<string>(null)

  //-------------------------------------------------------------------------
  useAsyncEffect(async () => {}, [])
  //-------------------------------------------------------------------------
  // [Function]
  const handleThumbNailFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]

    if (file) {
      setThumbNail(file)
      setThumbNailURL(URL.createObjectURL(file))
    }
  }

  const handleSchematicsFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]

    if (file) {
      // fileReader.readAsText(file)
      setSchematicFile(file)
      setSchematicFileURL(URL.createObjectURL(file))
    }
  }

  const handlePCBBoardFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]

    if (file) {
      setPCBBoardFile(file)
      setPCBBoardFileURL(URL.createObjectURL(file))
    }
  }

  const saveHandler = async () => {
    console.log("New: Part")
    if (!JSONFormChecker(partDescB.optionsRawData)) {
      alert("파일 형식이 맞지 않습니다.")
      return
    }
    if (!JSONFormChecker(partDescB.apiRawData)) {
      alert("파일 형식이 맞지 않습니다.")
      return
    }

    // 1. part 수정
    const partNew = {
      name: partInfo.part_name,
      part_image: thumbNail,
      rawData: JSON.stringify({
        ...JSON.parse(partDescB.apiRawData),
        options: JSON.parse(partDescB.optionsRawData),
      }),
      schematics_file: schematicFile,
      pcb_board_file: PCBBoardFile,
      schema_bom: JSON.stringify(
        partSchema.map(item => {
          const { index, ...IOPorts } = item

          return IOPorts
        }),
      ),
      naiming_param: JSON.stringify(
        partIOPorts.map(item => {
          const { index, ...IOPorts } = item

          return IOPorts
        }),
      ),
    }
    console.log("partNew", partNew)

    const partEditRes = await apiManager.partApi.createNewPart(partNew)
    if (apiUtil.isErrorResponse(partEditRes)) {
      if (apiUtil.signChecker(partEditRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(partEditRes.message)
      return
    }

    router.push("/part")
  }

  const cancelHandler = () => {
    console.log("Cancel: Part")

    router.push("/part")
  }

  //-------------------------------------------------------------------------
  // [Content Render]
  const renderSetDescE = (index, key, change) => {
    setPartIOPorts(() => {
      const newCustomblockIOPorts = partIOPorts.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            [key]: change,
          }
        }

        return item
      })

      return newCustomblockIOPorts
    })
  }

  const PartNewRender = ({ index, key, pm_value, record }) => {
    switch (key) {
      case "part_name":
        return (
          <BasicInput value={pm_value} onChange={e => setPartInfo({ ...partInfo, [key]: e.target.value })}></BasicInput>
        )
      case "quantity_prices":
        return (() => {
          try {
            const priceObj = JSON.parse(pm_value)
            console.log(priceObj)
            return (
              <Col className={styles.descA_price_table}>
                {Object.keys(priceObj).map(item => (
                  <Row className={styles.descA_price_table_row}>
                    <Col className={styles.descA_price_table_col_head}>{item}</Col>
                    <Col className={styles.descA_price_table_col_data}>{priceObj[item]}</Col>
                  </Row>
                ))}
              </Col>
            )
          } catch (error) {
            return <></>
          }
        })()
      case "datasheet_url":
        return (
          <div>
            <a href={pm_value} download>
              {partInfo.part_name}
            </a>
          </div>
        )
      case "part_image":
        return (
          <div className={styles.descA_image_wrapper}>
            {thumbNail ? (
              <Image src={thumbNailURL} alt={"ThumbNail"} preview={false} className={styles.descA_image_image}></Image>
            ) : (
              <></>
            )}
            <FileButton option={"image"} handleFile={handleThumbNailFile} className={styles.descA_image_button}>
              이미지 교체
            </FileButton>
          </div>
        )
      // B
      case "category":
        return (
          <div className={styles.descB_select_wrapper}>
            <ToolFeatureCategorySelection
              className={styles.descB_select_category}
              value={pm_value}
              onChange={change => {
                if (change !== pm_value) {
                  setPartDescB({ ...partDescB, [key]: change, type: null })
                }
              }}
            ></ToolFeatureCategorySelection>
            <ToolFeatureKindSelection
              option={pm_value}
              className={styles.descB_select_type}
              value={partDescB.type}
              onChange={change => {
                setPartDescB({ ...partDescB, type: change })
              }}
            ></ToolFeatureKindSelection>
          </div>
        )
      case "optionsRawData":
      case "apiRawData":
        return (
          <div className={styles.descB_rawData_wrapper}>
            <BasicInputArea
              option={"middle"}
              value={pm_value}
              onChange={e => setPartDescB({ ...partDescB, [key]: e.target.value })}
            ></BasicInputArea>
            {JSONFormChecker(pm_value) ? (
              <div className={styles.descB_rawData_formCheck_wrapper}>
                <CheckOutlined className={`${styles.descB_rawData_formCheck} ${styles.descB_rawData_formCheck_true}`} />
              </div>
            ) : (
              <div className={styles.descB_rawData_formCheck_wrapper}>
                파일 형식이 맞지 않습니다.{" "}
                <CloseOutlined
                  className={`${styles.descB_rawData_formCheck} ${styles.descB_rawData_formCheck_false}`}
                />
              </div>
            )}
          </div>
        )
      // C
      case "schematics_file":
        return (
          <div>
            {schematicFile ? (
              <a href={schematicFileURL} download={schematicFile.name}>
                {schematicFile.name}
              </a>
            ) : (
              <a href={pm_value} download>
                {pm_value.split("/").at(-1)}
              </a>
            )}
          </div>
        )
      case "pcb_board_file":
        return (
          <div>
            {PCBBoardFile ? (
              <a href={PCBBoardFileURL} download={PCBBoardFile.name}>
                {PCBBoardFile.name}
              </a>
            ) : (
              <a href={pm_value} download>
                {pm_value.split("/").at(-1)}
              </a>
            )}
          </div>
        )
      case "schematicsFileBtn":
        return (
          <div className={styles.customblock_desc_file_btn_wrapper}>
            <FileButton handleFile={handleSchematicsFile} className={styles.part_desc_file_btn}>
              파일 찾기
            </FileButton>
          </div>
        )
      case "PCBBoardFileBtn":
        return (
          <div className={styles.customblock_desc_file_btn_wrapper}>
            <FileButton handleFile={handlePCBBoardFile} className={styles.part_desc_file_btn}>
              파일 찾기
            </FileButton>
          </div>
        )
      // E
      case "io_type":
        return (
          <>
            <IOPortTypeSelection
              value={pm_value}
              onChange={change => {
                if (change !== pm_value) {
                  setPartIOPorts(() => {
                    const newCustomblockIOPorts = partIOPorts.map((item, idx) => {
                      if (idx === index) {
                        return {
                          ...item,
                          [key]: change,
                          pin_type: "---",
                        }
                      }

                      return item
                    })

                    return newCustomblockIOPorts
                  })
                }
              }}
            ></IOPortTypeSelection>
          </>
        )
      case "pin_type":
        if (["GND", "GPIO", "ADC", "PWM", "ETC"].includes(record.io_type)) {
          return (
            <>
              <BasicInput
                value={pm_value.IOPin}
                onChange={e => renderSetDescE(index, key, e.target.value)}
              ></BasicInput>
            </>
          )
        }

        return (
          <>
            <IOPOrtPinTypeSelection
              option={record.io_type}
              value={pm_value}
              onChange={change => renderSetDescE(index, key, change)}
            ></IOPOrtPinTypeSelection>
          </>
        )
      case "min_vol":
      case "max_vol":
        return (
          <BasicInput
            value={pm_value}
            onChange={e => {
              const value = Number(e.target.value)
              if (Number.isNaN(value)) return
              renderSetDescE(index, key, value)
            }}
          ></BasicInput>
        )
      default:
        if (typeof pm_value === "object" && !Array.isArray(pm_value) && pm_value !== null)
          return <div>{JSON.stringify(pm_value)}</div>
        return <div>{pm_value}</div>
    }
  }
  //------------------------------------------------------------------------------------------------------
  // [UI]
  return (
    <PageFrameFooter titleKey={PARTNEW} handler={{ saveHandler: saveHandler, cancelHandler: cancelHandler }}>
      <div className={styles.container}>
        <>
          <div className={styles.part_descA_title}>
            <h3>부품 정보</h3>
            <div>Last update : {partInfo ? partInfo.updated_at : "--.--.--"}</div>
          </div>
          <ObjectDescription
            descInfo={PartNewDesc.descA}
            descDetails={PartNewDescDetail}
            data={partInfo}
            render={PartNewRender}
          ></ObjectDescription>
        </>
        <Divider></Divider>
        <ObjectDescription
          descInfo={PartNewDesc.descB}
          descDetails={PartNewDescDetail}
          data={partDescB}
          render={PartNewRender}
        ></ObjectDescription>
        <Divider></Divider>
        <>
          <div className={styles.part_descC_title}>
            <h3>커스텀 블록 Files</h3>
            <div className={styles.part_descC_title_version_wrapper}>
              <div className={styles.part_descC_title_version_text}>
                <div>Update at</div>
                <div className={styles.part_descC_title_version_text_update}>
                  {versionUpdated ? versionUpdated : "--.--.--"}
                </div>
              </div>
              <BasicSelect
                className={styles.customblock_descC_title_version}
                options={versionList.map(item => ({ value: item, label: `V ${item.toFixed(1)}` }))}
                value={fileversion}
              ></BasicSelect>
            </div>
          </div>
          <ObjectDescription
            descInfo={PartNewDesc.descC}
            descDetails={PartNewDescDetail}
            data={partInfo}
            render={PartNewRender}
          ></ObjectDescription>
        </>
        <Divider></Divider>
        <BasicTable
          tableInfo={PartNewDesc.descD}
          tableDetails={PartNewDescTableDetail}
          dataSource={partSchema}
          pagination={{ position: ["bottomCenter"] }}
        ></BasicTable>
        <Divider></Divider>
        <BasicTable
          tableInfo={PartNewDesc.descE}
          tableDetails={PartNewDescTableDetail}
          dataSource={partIOPorts}
          render={PartNewRender}
          pagination={{ position: ["bottomCenter"] }}
        ></BasicTable>
        <Divider></Divider>
      </div>
    </PageFrameFooter>
  )
}

export default ToolDetail
