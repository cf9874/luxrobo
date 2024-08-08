import { Col, ConfigProvider, Row, Tabs, Layout as AntdLayout, Progress } from "antd"
import styles from "./result.module.scss"
import { LayoutMain } from "Layout"
import { useState } from "react"
import { imgAsset } from "@assets/image"
import Image from "next/image"
import { DownloadOutlined } from "@ant-design/icons"
import { BasicButton } from "components/Button"
// import { GetServerSideProps } from "next"
import { apiManager, apiUtil } from "apis"
import { useRouter } from "next/router"
import { Document, Page, pdfjs } from "react-pdf"
import Papa from "papaparse"
import "react-pdf/dist/esm/Page/TextLayer.css"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
import { useAsyncEffect, useRedux, useToast } from "hooks"
import AuthHoc from "hoc/AuthHoc"
import { setCheck, setLoading, setPause } from "redux/reducers/config"
import { PROJECT_ALERT } from "@const/alarm.const"
import { getCheckPoint } from "utils"
import { CheckPointModal } from "components/Modal"
import { MODIFIED_STEP } from "@const/project.const"

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   const apiCaller = apiManager.updateContext(ctx)
//   const [modelRes, pcbRes, bomRes, schemeRes] = await Promise.all([
//     apiCaller.resultApi.get3dmodel(Number(ctx.query.id)),
//     apiCaller.resultApi.getPcb(Number(ctx.query.id)),
//     apiCaller.resultApi.getBOM(Number(ctx.query.id)),
//     apiCaller.resultApi.getSchema(Number(ctx.query.id)),
//   ])

//   if (apiUtil.isErrorResponse(modelRes)) {
//     return {
//       props: { modelRes: {}, pcbRes: {}, bomRes: {}, schemeRes: {}, errorMsg: modelRes.message },
//     }
//   } else if (apiUtil.isErrorResponse(pcbRes)) {
//     return {
//       props: { modelRes: {}, pcbRes: {}, bomRes: {}, schemeRes: {}, errorMsg: pcbRes.message },
//     }
//   } else if (apiUtil.isErrorResponse(bomRes)) {
//     return {
//       props: { modelRes: {}, pcbRes: {}, bomRes: {}, schemeRes: {}, errorMsg: bomRes.message },
//     }
//   } else if (apiUtil.isErrorResponse(schemeRes)) {
//     return {
//       props: { modelRes: {}, pcbRes: {}, bomRes: {}, schemeRes: {}, errorMsg: schemeRes.message },
//     }
//   }
//   return {
//     props: {
//       model: modelRes.model_image,
//       pcb: pcbRes.board_image,
//       bom: bomRes.bom_image,
//       schema: schemeRes.schematics_image,
//     },
//   }
// }

const ResultPage = () =>
  // { model, pcb, bom, schema }: { model: string; pcb: string; bom: string; schema: string }
  {
    const router = useRouter()
    const loadingDispatch = useRedux(setLoading)
    const checkDispatch = useRedux(setCheck)
    const pauseDispatch = useRedux(setPause)
    const resultToast = useToast()

    const [model, setModel] = useState<string>()
    const [pcb, setPcb] = useState<string>()
    const [bom, setBom] = useState<string>()
    const [schema, setSchema] = useState<string>()

    const [category, setCategory] = useState<{
      title: string
      activeColor: string
      url: string
    }>()
    useAsyncEffect(async () => {
      if (router.query.id === undefined) return

      loadingDispatch(true)
      const projectRes = await apiManager.projectApi.getDetail(Number(router.query.id))
      if (apiUtil.isErrorResponse(projectRes)) {
        loadingDispatch(false)
        resultToast.onMessage({
          type: "error",
          content: projectRes.message ?? "",
        })
        return
      }

      const current = router.route.split("/")[1] as keyof typeof MODIFIED_STEP
      const checkPoint = getCheckPoint({ current, checkPoint: projectRes.checkpoint })

      if (!checkPoint) {
        loadingDispatch(false)
        checkDispatch({ open: true, children: <CheckPointModal checkPoint={projectRes.checkpoint} /> })
        return
      }

      const modelRes = await apiManager.resultApi.get3dmodel(Number(router.query.id))
      const pcbRes = await apiManager.resultApi.getPcb(Number(router.query.id))
      const bomlRes = await apiManager.resultApi.getBOM(Number(router.query.id))
      const schemaRes = await apiManager.resultApi.getSchema(Number(router.query.id))

      if (apiUtil.isErrorResponse(modelRes)) {
        alert(modelRes.message)
      } else {
        setModel(modelRes.model_image)
        setCategory({
          title: "3D",
          activeColor: "#45d6df",
          url: modelRes.model_image,
        })
      }
      if (apiUtil.isErrorResponse(pcbRes)) {
        alert(pcbRes.message)
      } else {
        setPcb(pcbRes.board_image)
      }
      if (apiUtil.isErrorResponse(bomlRes)) {
        alert(bomlRes.message)
      } else {
        setBom(bomlRes.bom_image)
      }
      if (apiUtil.isErrorResponse(schemaRes)) {
        alert(schemaRes.message)
      } else {
        setSchema(schemaRes.schematics_image)
      }
      loadingDispatch(false)
    }, [router.query.id])
    const categoryList = [
      {
        title: "3D",
        activeColor: "#45d6df",
        imgFileName: {
          active: "result3dActive",
          inactive: "result3dInactive",
        },
        result: model,
      },
      {
        title: "Board(PCB)",
        activeColor: "#45d6df",
        imgFileName: {
          active: "resultBoardActive",
          inactive: "resultBoardInActive",
        },
        result: pcb,
      },
      {
        title: "BOM",
        activeColor: "#45d6df",
        imgFileName: {
          active: "resultBomActive",
          inactive: "resultBomInactive",
        },
        result: bom,
      },
      {
        title: "Schematics",
        activeColor: "#45d6df",
        imgFileName: {
          active: "resultSchemActive",
          inactive: "resultSchemInactive",
        },
        result: schema,
      },
    ]
    const [numPages, setNumPages] = useState(0)
    const [row, setRow] = useState<Record<string, string>[]>([])
    const [selectMenu, setSelctMenu] = useState<string>("")
    const [progress, setProgress] = useState(0)
    useAsyncEffect(async () => {
      async function getData() {
        // const response = await fetch(process.env.NEXT_PUBLIC_S3_URL + bom)
        const response = await fetch(bom ?? "")
        const reader = response?.body?.getReader()
        const result = await reader?.read() // raw array
        const decoder = new TextDecoder("utf-8")
        const csv = decoder.decode(result?.value) // the csv text
        const results = Papa.parse(csv, { header: true }) // object with { data, errors, meta }
        const row = results.data as Record<string, string>[] // array of objects
        const data = row.map(row => {
          const result: Record<string, string> = {}
          Object.entries(row).forEach(([key, value]) => {
            const keys = key.replaceAll("\x00", "").replaceAll(`"`, "").replaceAll(`,`, ", ")
            const values = value.replaceAll("\x00", "").replaceAll(`"`, "").replaceAll(`,`, ", ")
            result[keys.includes("ID") ? "ID" : keys] = values
          })
          return result
        })
        setRow(data)
      }
      await getData()

      getProgress()
    }, [])

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
      setNumPages(numPages)
    }

    const downloadLink = ({ url = "/", filename = "file" }) => {
      void fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const link = document.createElement("a")
          link.href = URL.createObjectURL(blob)
          link.download = filename
          link.click()
        })
    }
    const getProgress = () => {
      let progress: number
      const intervalId = setInterval(async () => {
        const response = await apiManager.projectApi.progress(Number(router.query.id))
        if (apiUtil.isErrorResponse(response)) {
          loadingDispatch(false)
          pauseDispatch(true)
          resultToast.onMessage({
            type: "error",
            content: response.message ?? "",
          })
          pauseDispatch(false)
          clearInterval(intervalId) // 에러 발생 시 인터벌 종료
          return
        }
        progress = response.auto_routing.percent
        setProgress(progress)
        if (progress > 98.9) {
          setProgress(100)
          pauseDispatch(true)
          resultToast.onMessage({
            type: "success",
            content: PROJECT_ALERT.S009.kor,
          })
          pauseDispatch(false)
          clearInterval(intervalId) // progress가 99일 때 인터벌 종료
        }
      }, 1000)
    }
    return (
      <LayoutMain>
        <>{resultToast.contextHolder}</>
        <Row>
          <BasicButton
            className={styles.next_button_box}
            onClick={() => void router.push(`/order/id/?id=${String(router.query.id)}`)}
          >
            <Image src={imgAsset.arrowNext} width={24} height={24} alt="next" />
          </BasicButton>
          <Col className={styles.main}>
            <ConfigProvider
              theme={{
                components: {
                  Tabs: {
                    colorPrimary: category?.activeColor ?? "#000",
                    colorPrimaryHover: "#000",
                  },
                },
              }}
            >
              <Tabs
                defaultActiveKey="0"
                items={categoryList?.map((v, i) => {
                  return {
                    key: i.toString(),
                    label: (
                      <Col
                        onClick={e => {
                          setCategory({
                            title: e.currentTarget.outerText,
                            activeColor: v.activeColor,
                            url: v.result ?? "",
                          })
                        }}
                        className={styles.tab_wrapper}
                      >
                        <Row>
                          <Image
                            src={
                              imgAsset[
                                (category?.title === v.title ? v.imgFileName?.active : v.imgFileName?.inactive) ?? ""
                              ]
                            }
                            width={24}
                            height={24}
                            alt="title"
                          />
                          {v.title}
                        </Row>
                      </Col>
                    ),
                    children: (
                      <Col className={styles.image_wrapper}>
                        {v.title === "BOM" ? (
                          <AntdLayout className={styles.result_wrapper_BOM}>
                            <Row className={styles.BOM_table_nav}>
                              <Col className={styles.BOM_table_title}>Part</Col>
                              <Col className={styles.BOM_table_title}>Description</Col>
                              <Col className={styles.BOM_table_title}>Designator</Col>
                              <Col className={styles.BOM_table_title}>Quatity</Col>
                              <Col className={styles.BOM_table_title}>Price Each</Col>
                              <Col className={styles.BOM_table_title}>Price Total</Col>
                            </Row>
                            {row.map((data, idx) => (
                              <Row key={idx} className={styles.BOM_table_data}>
                                <Col className={styles.BOM_table_data_item}>{data.Name}</Col>
                                <Col className={styles.BOM_table_data_item}>{data.Footprint}</Col>
                                <Col className={styles.BOM_table_data_item}>{data.Designator}</Col>
                                <Col className={styles.BOM_table_data_item}> {data.Quantity}</Col>
                                <Col className={styles.BOM_table_data_item}>₩ {data.Price}</Col>
                                <Col className={styles.BOM_table_data_item}>
                                  ₩ {parseFloat((Number(data.Quantity ?? 0) * Number(data.Price ?? 0)).toFixed(5))}
                                </Col>
                              </Row>
                            ))}
                          </AntdLayout>
                        ) : null}
                        {v.title === "3D" ? (
                          <Document
                            // file={process.env.NEXT_PUBLIC_S3_URL + v.result}
                            file={v.result}
                            onLoadSuccess={onDocumentLoadSuccess}
                          >
                            <div className={styles.document_wrapper}>
                              {Array.from(new Array(numPages), (_, index) => (
                                <Page height={720} key={index} pageNumber={index + 1} error={<div></div>} />
                              ))}
                            </div>
                          </Document>
                        ) : null}
                        {v.title === "Board(PCB)" ? (
                          <Document
                            // file={process.env.NEXT_PUBLIC_S3_URL + v.result}
                            file={v.result}
                            onLoadSuccess={onDocumentLoadSuccess}
                          >
                            <div className={styles.document_wrapper}>
                              {Array.from(new Array(numPages), (_, index) => (
                                <Page
                                  height={720}
                                  width={1200}
                                  key={index}
                                  pageNumber={index + 1}
                                  error={<div></div>}
                                />
                              ))}
                            </div>
                          </Document>
                        ) : null}
                        {v.title === "Schematics" ? (
                          <Document
                            // file={process.env.NEXT_PUBLIC_S3_URL + v.result}
                            file={v.result}
                            onLoadSuccess={onDocumentLoadSuccess}
                          >
                            <div className={styles.document_wrapper}>
                              {Array.from(new Array(numPages), (_, index) => (
                                <Page height={undefined} key={index} pageNumber={index + 1} error={<div></div>} />
                              ))}
                            </div>
                          </Document>
                        ) : null}
                      </Col>
                    ),
                  }
                })}
                onChange={e => {
                  setSelctMenu(categoryList[Number(e)].result ?? "")
                }}
                size="large"
                className={styles.tabs}
                tabBarExtraContent={{
                  left: (
                    <div className={styles.tabs_icon_wrapper}>
                      <Image src={imgAsset.headerFeature} width={40} className={styles.tabs_icon} alt="" />
                      <h2 className={styles.title}>Result</h2>
                    </div>
                  ),
                  right: (
                    <div className={styles.right_element}>
                      <div className={styles.progress_box}>
                        {progress < 100 ? (
                          <div className={styles.progress_text}>Routing Processing...</div>
                        ) : (
                          <div className={styles.progress_text_success}>PCB creation has been completed.</div>
                        )}
                        <Progress
                          type="circle"
                          percent={progress}
                          size={40}
                          strokeColor={"#45d6df"}
                          style={{
                            color: "#45d6df",
                          }}
                          success={{ strokeColor: "#3cc800" }}
                        />
                      </div>
                      <BasicButton
                        className={styles.download_button}
                        onClick={() => {
                          downloadLink({ url: selectMenu })
                        }}
                      >
                        <DownloadOutlined className={styles.download_icon} />
                        Download
                      </BasicButton>
                    </div>
                  ),
                }}
              />
            </ConfigProvider>
          </Col>
        </Row>
      </LayoutMain>
    )
  }

export default AuthHoc(ResultPage)
