import styles from "./customDetail.module.scss"
import { PageFrameFooter } from "@/components/layout"
import { NextPage } from "next"
import { apiManager, apiUtil } from "@/apis"
import {
  CustomDesc,
  CustomDescBType,
  CustomDescEType,
  CustomDescDetail,
  CustomblockRawData,
  CustomDescDType,
} from "@/components/pages/custom/customDesc"
import { ObjectDescription } from "@/components/Description"
import { Divider, message } from "antd"
import { CUSTOMDETAIL } from "@/const"
import { useRouter } from "next/router"
import { useState } from "react"
import { useAsyncEffect } from "@/hooks"
import { BasicInput, BasicInputArea } from "@/components/Input"
import { FileButton } from "@/components/Button"
import { BasicTable } from "@/components/Table"
import { BasicSelect, IOPOrtPinTypeSelection, IOPortTypeSelection } from "@/components/Select"
import WorkSpaceModal from "@/components/modal/workspace.modal"
import { CustomblockDto, SchemaBom } from "@/apis/dto/customblock.dto"
import { API_ERROR_MSG } from "@/const/api.error.const"
import { JSONFormChecker } from "@/utils"
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"

//------------------------------------------------------------------------------------------------------
// [Main]
const CustomDetail: NextPage = () => {
  const router = useRouter()
  const reader = new FileReader()

  //-------------------------------------------------------------------------
  // [Datas]
  const [customblockID, setCustomBlockID] = useState<number>(undefined)

  const [customblockInfo, setCustomblockInfo] = useState<CustomblockDto>(undefined)
  const [customblockRawDataInfo, setCustomblockRawDataInfo] = useState<CustomDescBType>(undefined)
  const [customblockSchema, setCustomblockSchema] = useState<CustomDescDType[]>([] as CustomDescDType[])
  const [customblockIOPorts, setCustomblockIOPorts] = useState<CustomDescEType[]>([] as CustomDescEType[])

  // files
  const [versionList, setVersionList] = useState<number[]>([])
  const [versionUpdated, setVersionUpdated] = useState<string>(undefined)
  const [fileversion, setFileVersion] = useState<number>(undefined)

  const [schematicFile, setSchematicFile] = useState<File>(null)
  const [schematicFileURL, setSchematicFileURL] = useState<string>(null)
  const [PCBBoardFile, setPCBBoardFile] = useState<File>(null)
  const [PCBBoardFileURL, setPCBBoardFileURL] = useState<string>(null)
  //-------------------------------------------------------------------------
  // [초기화]
  const schemaBOMProcess = (schema_bom: SchemaBom[]): CustomDescDType[] => {
    const resultMap: Map<string, number> = new Map()

    schema_bom.forEach(item => {
      const key = `${item.part_name}-${item.part_prefix}-${item.footprint}`
      resultMap.set(key, (resultMap.get(key) || 0) + 1)
    })

    const removeDuplicate: CustomDescDType[] = schema_bom.filter(item => {
      const key = `${item.part_name}-${item.part_prefix}-${item.footprint}`
      const count = resultMap.get(key)
      console.log(key, count)
      if (count && count >= 1) {
        resultMap.set(key, 0)
        return true
      }
      return false
    })

    schema_bom.forEach(item => {
      const key = `${item.part_name}-${item.part_prefix}-${item.footprint}`
      resultMap.set(key, (resultMap.get(key) || 0) + 1)
    })

    removeDuplicate.forEach(item => {
      const key = `${item.part_name}-${item.part_prefix}-${item.footprint}`
      item.quantity = resultMap.get(key) || 0
    })

    return removeDuplicate.map((item, index) => ({ ...item, index: index + 1 }))
  }

  useAsyncEffect(async () => {
    if (!router.query.id) return

    // [set CustomblockID]
    setCustomBlockID(Number(router.query.id))

    // [set CustomblockInfo]
    const customblockResponse = await apiManager.customblockApi.getCustomblock(Number(router.query.id).toString())
    if (apiUtil.isErrorResponse(customblockResponse)) {
      if (apiUtil.signChecker(customblockResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(customblockResponse.message)
      return
    }

    setCustomblockInfo(customblockResponse)
    setCustomblockRawDataInfo({
      rawData: JSON.stringify(
        {
          color: customblockResponse.color,
          type: customblockResponse.type,
          specification: customblockResponse.specification,
        } as CustomblockRawData,
        null,
        4,
      ),
    })

    const newCustomblockSchema = schemaBOMProcess(customblockResponse.schema_bom)
    setCustomblockSchema(newCustomblockSchema)

    setCustomblockIOPorts(customblockResponse.naming_param.map((item, index) => ({ ...item, index: index + 1 })))

    // file version list 불러와 versionList 초기화
    // 가장 최신 version으로 fileversion 초기화
    // 가장 최신 version으로 update_dt, schematics_file, pcb_board_file 데이터 호출 및 초기화
  }, [router.query.id])
  //-------------------------------------------------------------------------
  // [Handler]
  const handleSchematicsFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    // const fileReader = new FileReader()
    // fileReader.onload = event => {
    //   const fileContent = event.target?.result as string
    //   console.log("fileContent", fileContent)
    //   console.log("fileContent-parse", JSON.parse(fileContent.toString()))
    // }

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

  const customblockMovingHandler = async (userID: number, teamID: number, workspace?: string) => {
    console.log("Customblock : Move")
    // console.log("CustomblockID", customblockID)
    // console.log("userID", userID, "teamID", teamID)

    const customblockMoveRes = await apiManager.customblockApi.moveCustomBlock(customblockID, userID, teamID)
    if (apiUtil.isErrorResponse(customblockMoveRes)) {
      if (apiUtil.signChecker(customblockMoveRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(customblockMoveRes.message)
      return
    }

    // 데이터 초기화
    const customblockResponse = await apiManager.customblockApi.getCustomblock(customblockID.toString())
    if (apiUtil.isErrorResponse(customblockResponse)) {
      if (apiUtil.signChecker(customblockResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(customblockResponse.message)
      return
    }

    setCustomblockInfo({
      ...customblockResponse,
      name: customblockInfo.name,
      description: customblockInfo.description,
    })
  }

  const customblockCloneHandler = async (userID: number, teamID: number) => {
    console.log("Customblock : Clone")
    // console.log("CustomblockID", customblockID)
    // console.log("userID", userID, "teamID", teamID)

    const customblockCloneRes = await apiManager.customblockApi.cloneCustomBlock(customblockID, userID, teamID)
    if (apiUtil.isErrorResponse(customblockCloneRes)) {
      if (apiUtil.signChecker(customblockCloneRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(customblockCloneRes.message)
      return
    }

    message.info("Clone Project Success!")
  }

  const fileVersionChangeHandler = async (version: number) => {
    // 1. version 변경
    // files의 version 변경시 별도 api를 사용하는지 / version을 인자로 getCustomblock을 재호출하는지에 따라
    // version으로 fileversion 초기화
    // version으로 update_dt, schematics_file, pcb_board_file 데이터 호출 및 초기화 진행

    // 2. 업로드 파일 초기화
    setPCBBoardFile(null)
    setPCBBoardFileURL(null)
    setSchematicFile(null)
    setSchematicFileURL(null)
  }

  // [footer Handler]
  const saveHandler = async () => {
    console.log("Save: Custom")
    console.log(customblockID)
    if(!JSONFormChecker(customblockRawDataInfo.rawData)){
      alert("파일 형식이 맞지 않습니다.")
      return
    }

    // 1. customblock 수정
    const customblockEdit = {
      name: customblockInfo.name,
      description: customblockInfo.description,
      rawData: JSON.stringify(JSON.parse(customblockRawDataInfo.rawData)),
      schematics_file: schematicFile,
      pcb_board_file: PCBBoardFile,
      schema_bom: JSON.stringify(customblockInfo.schema_bom),
      naiming_param: JSON.stringify(
        customblockIOPorts.map(item => {
          const { index, ...IOPorts } = item

          return IOPorts
        }),
      ),
    }
    console.log("customblockEdit", customblockEdit)
    const customblockEditRes = await apiManager.customblockApi.editCustomBlock(customblockID, customblockEdit)
    if (apiUtil.isErrorResponse(customblockEditRes)) {
      if (apiUtil.signChecker(customblockEditRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(customblockEditRes.message)
      return
    }

    router.push("/custom")
  }

  const cancelHandler = () => {
    console.log("Cancel: Custom")
    router.push("/custom")
  }
  //-------------------------------------------------------------------------
  // [Content Render]
  const renderSetDescE = (index, key, change) => {
    setCustomblockIOPorts(() => {
      const newCustomblockIOPorts = customblockIOPorts.map((item, idx) => {
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
  const CustomRender = ({ index, key, pm_value, record }) => {
    switch (key) {
      // A
      case "name":
        return (
          <BasicInput
            value={pm_value}
            onChange={e => setCustomblockInfo({ ...customblockInfo, [key]: e.target.value })}
          ></BasicInput>
        )
      case "workspace":
        return (
          <>
            <WorkSpaceModal
              workspace={customblockInfo.workspace}
              userID={customblockInfo.userID}
              teamID={customblockInfo.teamID}
              movingHandler={customblockMovingHandler}
              cloneHandler={customblockCloneHandler}
            ></WorkSpaceModal>
          </>
        )
      case "description":
        return (
          <BasicInputArea
            option={"smallFixed"}
            value={pm_value}
            onChange={e => setCustomblockInfo({ ...customblockInfo, [key]: e.target.value })}
          ></BasicInputArea>
        )
      // B
      case "rawData":
        return (
          <div className={styles.descB_rawData_wrapper}>
            <BasicInputArea
              option={"middle"}
              value={pm_value}
              onChange={e => {
                setCustomblockRawDataInfo({ ...customblockRawDataInfo, [key]: e.target.value })
              }}
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
            <FileButton handleFile={handleSchematicsFile} className={styles.customblock_desc_file_btn}>
              파일 찾기
            </FileButton>
          </div>
        )
      case "PCBBoardFileBtn":
        return (
          <div className={styles.customblock_desc_file_btn_wrapper}>
            <FileButton handleFile={handlePCBBoardFile} className={styles.customblock_desc_file_btn}>
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
                  setCustomblockIOPorts(() => {
                    const newCustomblockIOPorts = customblockIOPorts.map((item, idx) => {
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

  //-------------------------------------------------------------------------
  // [UI]
  return (
    <PageFrameFooter titleKey={CUSTOMDETAIL} handler={{ saveHandler: saveHandler, cancelHandler: cancelHandler }}>
      <div className={styles.container}>
        <ObjectDescription
          descInfo={CustomDesc.descA}
          descDetails={CustomDescDetail}
          data={customblockInfo}
          render={CustomRender}
        ></ObjectDescription>
        <Divider></Divider>
        <ObjectDescription
          descInfo={CustomDesc.descB}
          descDetails={CustomDescDetail}
          data={customblockRawDataInfo}
          render={CustomRender}
        ></ObjectDescription>
        <Divider></Divider>
        <>
          <div className={styles.customblock_descC_title}>
            <h3>커스텀 블록 Files</h3>
            <div className={styles.customblock_descC_title_version_wrapper}>
              <div className={styles.customblock_descC_title_version_text}>
                <div>Update at</div>
                <div className={styles.customblock_descC_title_version_text_update}>{versionUpdated? versionUpdated: "--.--.--"}</div>
              </div>
              <BasicSelect
                className={styles.customblock_descC_title_version}
                options={versionList.map(item => ({ value: item, label: `V ${item.toFixed(1)}` }))}
                value={fileversion}
                onChange={fileVersionChangeHandler}
              ></BasicSelect>
            </div>
          </div>
          <ObjectDescription
            descInfo={CustomDesc.descC}
            descDetails={CustomDescDetail}
            data={customblockInfo}
            render={CustomRender}
          ></ObjectDescription>
        </>
        <Divider></Divider>
        <BasicTable
          tableInfo={CustomDesc.descD}
          tableDetails={CustomDescDetail}
          dataSource={customblockSchema}
          pagination={{ position: ["bottomCenter"] }}
        ></BasicTable>
        <Divider></Divider>
        <BasicTable
          tableInfo={CustomDesc.descE}
          tableDetails={CustomDescDetail}
          dataSource={customblockIOPorts}
          render={CustomRender}
          pagination={{ position: ["bottomCenter"] }}
        ></BasicTable>
        <Divider></Divider>
      </div>
    </PageFrameFooter>
  )
}

export default CustomDetail
