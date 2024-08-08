import { useAsyncEffect, useRedux, useToast } from "hooks"
import { setLoading, setModal } from "redux/reducers/config"
import { BasicModal } from "./modal.basic"
import { Col, ConfigProvider, Row, Space, Tabs } from "antd"
import { BasicButton } from "components/Button"
import modalStyles from "./modal.module.scss"
import styles from "./modal.edit.logic.block.module.scss"
import { LogicBlockSchemaDto } from "apis/dto"
import { apiManager, apiUtil } from "apis"
import { NamingRow } from "components/Extras"
import { ChangeEvent, useState } from "react"
import { useRouter } from "next/router"
import { PROJECT_ALERT } from "@const/alarm.const"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/TextLayer.css"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export const EditLogicBlock = ({ blockId, allUpdate }: { blockId: string; allUpdate: () => Promise<void> }) => {
  const router = useRouter()
  const editLogicToast = useToast()
  const [numPages, setNumPages] = useState(0)
  const modalDispatch = useRedux(setModal)
  const loadingDispatch = useRedux(setLoading)

  const [schema, setSchema] = useState<LogicBlockSchemaDto>()
  const [schemaState, setSchemaState] = useState<LogicBlockSchemaDto>()
  const [prevSchema, setPrevSchema] = useState<LogicBlockSchemaDto>()
  console.log(schema?.params)
  console.log(schemaState?.params)

  useAsyncEffect(async () => {
    loadingDispatch(true)
    const response = await apiManager.logicApi.getBlockSchema({
      projectId: Number(router.query.id),
      blockId,
    })
    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      return
    }
    setSchema(response)
    console.log(3838, response)
    setSchemaState(response)
    loadingDispatch(false)
  }, [])
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }
  const onDownload = ({ file = "", name = "schema.json", type = "" }) => {
    const blob = new Blob([file], { type })

    const link = document.createElement("a")
    const href = window.URL.createObjectURL(blob)

    link.href = href
    link.download = name
    link.click()
    link.remove()
    window.URL.revokeObjectURL(href)
  }

  const onUpload = () => {
    const readFileContent = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = event => {
          if (event.target) {
            resolve(event.target.result as string)
          }
        }
        reader.onerror = error => reject(error)
        reader.readAsText(file)
      })
    }

    const inputElement = document.createElement("input")
    inputElement.type = "file"
    inputElement.accept = ".json"
    inputElement.onchange = async e => {
      const file = (e as unknown as ChangeEvent<HTMLInputElement>).target.files?.[0]

      if (file) {
        if (file?.type !== "application/json") {
          alert("파일 형식이 올바르지 않습니다.")
          return
        }
        const fileContent = await readFileContent(file)
        const schema = JSON.stringify(JSON.parse(fileContent))
        const response = await apiManager.logicApi.editBlockSchema({
          blockId,
          projectId: Number(router.query.id),
          schema: {
            schema,
          },
        })
        if (apiUtil.isErrorResponse(response)) {
          alert(response.message + "asdasd")
          return
        }
        console.log(101, response)
        setSchemaState(response)
      }
    }
    console.log(106106)
    inputElement.click()
    //json update
  }
  const onApply = () => {
    editLogicToast.onMessage({
      type: "success",
      content: PROJECT_ALERT["S011"].kor,
    })
    modalDispatch({ open: false })
  }
  console.log("now : ", schemaState?.params.naming_param)
  const onApplyParam = async () => {
    console.log("input : ", schemaState?.params.naming_param)
    const prevNaming = await apiManager.logicApi.getBlockSchema({
      blockId,
      projectId: Number(router.query.id),
    })
    if (apiUtil.isErrorResponse(prevNaming)) {
      alert(prevNaming.message)
      return
    }
    setPrevSchema(prevNaming)
    const response = await apiManager.logicApi.editNamingParam({
      blockId,
      projectId: Number(router.query.id),
      param: schemaState?.params.naming_param ?? [],
    })

    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      return
    }

    editLogicToast.onMessage({
      type: "success",
      content: PROJECT_ALERT["S011"].kor,
    })
    console.log("response : ", response.params.naming_param)

    setSchemaState(response)
    // modalDispatch({ open: false })
  }
  const onCancelNamingParam = async () => {
    const response = await apiManager.logicApi.editNamingParam({
      blockId,
      projectId: Number(router.query.id),
      param: prevSchema?.params.naming_param ?? [],
    })
    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      return
    }
    console.log(157157, prevSchema)
    setSchemaState(prevSchema)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onCancelParam = async () => {
    const response = await apiManager.logicApi.editBlockSchema({
      blockId,
      projectId: Number(router.query.id),
      schema: {
        schema: "",
      },
    })

    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
    }
    console.log(response)
  }

  const mappingBOM = (bom: { part_name: string; part_prefix: string; footprint: string }[]) => {
    return bom.reduce(
      (
        acc: { part_name: string; part_prefix: string; footprint: string; quantity: number }[],
        cur: { part_name: string; part_prefix: string; footprint: string },
      ) => {
        const index = acc.findIndex(
          item =>
            item?.part_name === cur.part_name &&
            item.part_prefix === cur.part_prefix &&
            item.footprint === cur.footprint,
        )

        if (index !== -1) {
          acc[index].quantity += 1
        } else {
          acc.push({ ...cur, quantity: 1 })
        }

        return acc
      },
      [],
    )
  }
  // console.log(9595, schema?.schema_image)
  // console.log(9696, schema)
  return (
    <BasicModal
      header="Edit"
      width={1812}
      height={892}
      footer={
        <Row justify={"space-between"} className={modalStyles.wide_modal_button_wrapper}>
          <BasicButton
            onClick={() => modalDispatch({ open: false })}
            style={{
              width: 132,
            }}
          >
            Cancel
          </BasicButton>
          <Col className={styles.edit_logic_button_wrapper}>
            {editLogicToast.contextHolder}
            <BasicButton onClick={() => onDownload({ file: schemaState?.schematic ?? "" })}>Download</BasicButton>
            {/* <BasicButton onClick={e => fileUploadValidHandler(e)}>Upload</BasicButton>
             */}

            <BasicButton
              onClick={async () => {
                onUpload()
                await allUpdate()
              }}
            >
              {/* <input type="file" style={{ display: "none" }} /> */}
              Upload
            </BasicButton>
            <BasicButton onClick={onApplyParam}>Apply</BasicButton>
          </Col>
        </Row>
      }
    >
      {/* PVFLMoJrZ8YqrUEA5XKvyQ */}
      <Space className={modalStyles.wide_modal_container}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1b38520",
            },
          }}
        >
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                label: "BOM (Bill of Material)",
                key: "1",
                children: (
                  <Space direction="vertical" className={styles.edit_block_container}>
                    <Col className={styles.BOM_nav_text}>
                      <Row>커스텀 블록 회로도의 BOM 입니다.</Row>
                      <Row>입력한 회로도의 부품이 올바른지 확인하십시오.</Row>
                    </Col>
                    <Col className={styles.table_wrapper}>
                      <Row className={styles.BOM_nav_item_wrapper}>
                        <Col className={styles.nav_item}>No</Col>
                        <Col className={styles.nav_item}>Name</Col>
                        <Col className={styles.nav_item}>Prefix</Col>
                        <Col className={styles.nav_item}>Footprint</Col>
                        <Col className={styles.nav_item}>Quantity</Col>
                      </Row>
                      {mappingBOM(schemaState?.params.schema_bom ?? []).map((e, index) => (
                        <Row
                          key={index}
                          className={
                            e.footprint === "0" || e.footprint === ""
                              ? styles.BOM_item_wrapper_error
                              : styles.BOM_item_wrapper
                          }
                        >
                          <Col className={styles.BOM_item_center}>{index + 1}</Col>
                          <Col className={styles.BOM_item}>
                            {e.part_name.slice(0, 15)}
                            <br />
                            {e.part_name.slice(15)}
                          </Col>
                          <Col className={styles.BOM_item}>{e.part_prefix}</Col>
                          <Col className={styles.BOM_item}>
                            {e.footprint.slice(0, 15)}
                            <br />
                            {e.footprint.slice(15)}
                          </Col>
                          <Col className={styles.BOM_item_center}>{e.quantity}</Col>
                        </Row>
                      ))}
                    </Col>
                  </Space>
                ),
              },
              {
                label: "Block IO Naming",
                key: "2",
                children: (
                  <Space direction="vertical" className={styles.edit_block_container}>
                    <Col className={styles.IO_nav_text}>
                      <Row>자동 Naming을 위한 파라미터 설정 창입니다.</Row>
                      <Row>Naming 양식 :“IO Type - Block type _Pin Type”</Row>
                    </Col>
                    <Col className={styles.IO_nav_text}>
                      <Row>각 Port의 파라미터가 의도한 바와 맞는지 확인하세요.</Row>
                    </Col>
                    <Col className={styles.button_group}>
                      <BasicButton onClick={onCancelNamingParam}>Cancel</BasicButton>
                      <BasicButton onClick={onApplyParam}>Apply</BasicButton>
                    </Col>
                    <Col>
                      <Row className={styles.IO_nav_item_wrapper}>
                        <Col className={styles.nav_item}>No</Col>
                        <Col className={styles.nav_item}>Port Name</Col>
                        <Col className={styles.nav_item}>IO Type</Col>
                        <Col className={styles.nav_item}>PinType</Col>
                        <Col className={styles.nav_divide}>
                          <Row justify={"center"}>Volt Range</Row>
                          <Row className={styles.nav_divide_min_max}>
                            <Col>min</Col>
                            <Col>max</Col>
                          </Row>
                        </Col>
                      </Row>
                      <Col className={styles.table_wrapper}>
                        {schemaState?.params.naming_param.map((v, index) => {
                          return (
                            <NamingRow
                              key={index}
                              index={index}
                              naminOption={v}
                              namingParam={schemaState?.params.naming_param ?? []}
                              setSchemaState={setSchemaState}
                            />
                          )
                        })}
                      </Col>
                    </Col>
                  </Space>
                ),
              },
            ]}
            style={{
              height: 760,
              alignSelf: "flex-start",
            }}
          ></Tabs>
        </ConfigProvider>
        <Col className={styles.circuit_container}>
          {schemaState?.schema_image === "" ? (
            <div className={styles.empty_schema_image}> schematics image가 존재하지 않습니다.</div>
          ) : (
            <Document file={schemaState?.schema_image} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from(new Array(numPages), (_, index) => (
                <Page height={92} key={index} pageNumber={index + 1} error={<div></div>} />
              ))}
            </Document>
            // <Image
            //   src={process.env.NEXT_PUBLIC_S3_URL + (schema?.schema_image ?? "")}
            //   width={1148}
            //   height={660}
            //   alt="schema_image"
            // />
          )}
        </Col>
      </Space>
    </BasicModal>
  )
}
