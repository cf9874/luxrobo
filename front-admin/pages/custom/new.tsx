import styles from "./customNew.module.scss"
import { PageFrameFooter } from "@/components/layout"
import { NextPage } from "next"
import { apiManager, apiUtil } from "@/apis"
import {
  CustomNewDesc,
  CustomNewDescBType,
  CustomNewDescEType,
  CustomNewDescDetail,
  CustomblockRawData,
  CustomNewDescDType,
  customNewNullInfo,
} from "@/components/pages/custom/newDesc"
import { ObjectDescription } from "@/components/Description"
import { Divider } from "antd"
import { CUSTOMNEW } from "@/const"
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
const schemaBOMProcess = (schema_bom: SchemaBom[]): CustomNewDescDType[] => {
  const resultMap: Map<string, number> = new Map()

  schema_bom.forEach(item => {
    const key = `${item.part_name}-${item.part_prefix}-${item.footprint}`
    resultMap.set(key, (resultMap.get(key) || 0) + 1)
  })

  const removeDuplicate: CustomNewDescDType[] = schema_bom.filter(item => {
    const key = `${item.part_name}-${item.part_prefix}-${item.footprint}`
    const count = resultMap.get(key)
    // console.log(key, count)
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
//------------------------------------------------------------------------------------------------------
// [Main]
const CustomNew: NextPage = () => {
  const router = useRouter()
  const reader = new FileReader()

  //-------------------------------------------------------------------------
  // [Datas]
  const [customblockInfo, setCustomblockInfo] = useState<CustomblockDto>(customNewNullInfo)
  const [customblockRawDataInfo, setCustomblockRawDataInfo] = useState<CustomNewDescBType>({
    rawData: JSON.stringify(
      {
        color: customNewNullInfo.color,
        type: customNewNullInfo.type,
        specification: customNewNullInfo.specification,
      } as CustomblockRawData,
      null,
      4,
    ),
  })
  const [customblockSchema, setCustomblockSchema] = useState<CustomNewDescDType[]>(
    schemaBOMProcess(customNewNullInfo.schema_bom),
  )
  const [customblockIOPorts, setCustomblockIOPorts] = useState<CustomNewDescEType[]>(
    customNewNullInfo.naming_param.map((item, index) => ({ ...item, index: index + 1 })),
  )

  const [workspaceInfo, setWorkspaceInfo] = useState({
    workspace: "",
    userID: 0,
    teamID: 0,
  })

  // files
  const [versionList, setVersionList] = useState<number[]>([1])
  const [versionUpdated, setVersionUpdated] = useState<string>("--.--.--")
  const [fileversion, setFileVersion] = useState<number>(1)

  const [schematicFile, setSchematicFile] = useState<File>(null)
  const [schematicFileURL, setSchematicFileURL] = useState<string>(null)
  const [PCBBoardFile, setPCBBoardFile] = useState<File>(null)
  const [PCBBoardFileURL, setPCBBoardFileURL] = useState<string>(null)
  //-------------------------------------------------------------------------
  // [초기화]
  useAsyncEffect(async () => {}, [])

  //-------------------------------------------------------------------------
  // [Handler]
  const handleSchematicsFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    const fileReader = new FileReader()

    if (file) {
      fileReader.onload = event => {
        const fileContent = event.target?.result as string
        console.log("fileContent", fileContent)
      }

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

    setWorkspaceInfo({
      workspace: workspace,
      userID: userID,
      teamID: teamID,
    })
  }

  // [footer Handler]
  const saveHandler = async () => {
    console.log("New: Custom")

    if(!JSONFormChecker(customblockRawDataInfo.rawData)){
      alert("파일 형식이 맞지 않습니다.")
      return
    }

    // 1. customblock 신규 등록
    const customblockNew = {
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
    console.log("customblockNew", customblockNew)
    const customblockEditRes = await apiManager.customblockApi.createCustomBlock(customblockNew)
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

    // 프로젝트 작업 공간 지정
    if (workspaceInfo) {
      if (workspaceInfo.userID === 0) {
        console.log(customblockEditRes.customblockID, workspaceInfo.userID, workspaceInfo.teamID)
        const customblockMoveRes = await apiManager.customblockApi.moveCustomBlock(
          customblockEditRes.customblockID,
          workspaceInfo.userID,
          workspaceInfo.teamID,
        )
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
      } else {
        console.log(customblockEditRes.customblockID, workspaceInfo.userID, workspaceInfo.teamID)
        const customblockMoveRes = await apiManager.customblockApi.moveCustomBlock(
          customblockEditRes.customblockID,
          workspaceInfo.userID,
          workspaceInfo.teamID,
        )
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
      }
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
  const CustomNewRender = ({ index, key, pm_value, record }) => {
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
            {workspaceInfo ? (
              <WorkSpaceModal
                workspace={workspaceInfo.workspace}
                userID={workspaceInfo.userID}
                teamID={workspaceInfo.teamID}
                movingHandler={customblockMovingHandler}
              ></WorkSpaceModal>
            ) : (
              <WorkSpaceModal
                workspace={customblockInfo.workspace}
                userID={customblockInfo.userID}
                teamID={customblockInfo.teamID}
                movingHandler={customblockMovingHandler}
              ></WorkSpaceModal>
            )}
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
    <PageFrameFooter titleKey={CUSTOMNEW} handler={{ saveHandler: saveHandler, cancelHandler: cancelHandler }}>
      <div className={styles.container}>
        <ObjectDescription
          descInfo={CustomNewDesc.descA}
          descDetails={CustomNewDescDetail}
          data={customblockInfo}
          render={CustomNewRender}
        ></ObjectDescription>
        <Divider></Divider>
        <ObjectDescription
          descInfo={CustomNewDesc.descB}
          descDetails={CustomNewDescDetail}
          data={customblockRawDataInfo}
          render={CustomNewRender}
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
              ></BasicSelect>
            </div>
          </div>
          <ObjectDescription
            descInfo={CustomNewDesc.descC}
            descDetails={CustomNewDescDetail}
            data={customblockInfo}
            render={CustomNewRender}
          ></ObjectDescription>
        </>
        <Divider></Divider>
        <BasicTable
          tableInfo={CustomNewDesc.descD}
          tableDetails={CustomNewDescDetail}
          dataSource={customblockSchema}
          pagination={{ position: ["bottomCenter"] }}
        ></BasicTable>
        <Divider></Divider>
        <BasicTable
          tableInfo={CustomNewDesc.descE}
          tableDetails={CustomNewDescDetail}
          dataSource={customblockIOPorts}
          render={CustomNewRender}
          pagination={{ position: ["bottomCenter"] }}
        ></BasicTable>
        <Divider></Divider>
      </div>
    </PageFrameFooter>
  )
}

export default CustomNew
