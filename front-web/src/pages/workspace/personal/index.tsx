import { useState } from "react"
import { Col, Row, Space } from "antd"
import styles from "./index.module.scss"
import { PlusOutlined } from "@ant-design/icons"
import { LayoutWorkspace } from "Layout"
import { ProjectDto, ProjectProgress, TeamDto } from "apis/dto"
import { BasicButton } from "components/Button"
import { useAsyncEffect, useRedux } from "hooks"
import { setModal } from "redux/reducers/config"
import { CloneProjectModal, CreateProjectModal, DeleteProjectModal } from "components/Modal"
import { useRouter } from "next/router"
// import { GetServerSideProps } from "next"
import { apiManager } from "apis/api.manager"
import { apiUtil } from "apis/api.util"
import dayjs from "dayjs"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/TextLayer.css"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import Image from "next/image"
import { imgAsset } from "@assets/image"
import AuthHoc from "hoc/AuthHoc"
import { ShareProjectModal } from "components/Modal/modal.share.project"
import { MODIFIED_STEP } from "@const/project.const"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   const apiCaller = apiManager.updateContext(ctx)

//   const [teamListRes, projectListRes] = await Promise.all([
//     apiCaller.userApi.getTeamList(),
//     apiCaller.projectApi.getList(),
//   ])

//   if (apiUtil.isErrorResponse(teamListRes)) {
//     return {
//       props: { teamList: [], projectList: [], errorMsg: teamListRes.message },
//     }
//   } else if (apiUtil.isErrorResponse(projectListRes)) {
//     return {
//       props: { teamList: [], projectList: [], errorMsg: projectListRes.message },
//     }
//   }

//   return {
//     props: { teamList: teamListRes, projectList: projectListRes, errorMsg: "" },
//   }
// }

const PersonalPage = () => {
  const router = useRouter()
  const modalDispatch = useRedux(setModal)
  const [numPages, setNumPages] = useState(0)
  const [teamList, setTeamList] = useState<TeamDto[]>([])
  const [projectListState, setProjectListState] = useState<ProjectDto[]>([])
  const [searchProjectListState, setSearchProjectListState] = useState<ProjectDto[]>([])
  const [isSelectProjectId, setIsSelectProjectId] = useState<number | null>(null)

  const [selectProjectDetail, setSelectProjectDetail] = useState<(ProjectDto & ProjectProgress) | null>(null)

  useAsyncEffect(async () => {
    const teamListRes = await apiManager.userApi.getTeamList()
    const projectListRes = await apiManager.projectApi.getList()
    if (apiUtil.isErrorResponse(teamListRes)) {
      alert(teamListRes.message)
      return
    } else {
      setTeamList(teamListRes)
    }
    if (apiUtil.isErrorResponse(projectListRes)) {
      alert(projectListRes.message)
      return
    } else {
      setProjectListState(projectListRes)
      setSearchProjectListState(projectListRes)
    }

    if (isSelectProjectId !== null) {
      const [detailRes, progressRes] = await Promise.all([
        apiManager.projectApi.getDetail(isSelectProjectId),
        apiManager.projectApi.progress(isSelectProjectId),
      ])

      if (!apiUtil.isErrorResponse(detailRes) && !apiUtil.isErrorResponse(progressRes)) {
        setSelectProjectDetail({ ...detailRes, ...progressRes } as ProjectDto & ProjectProgress)
      }
    } else {
      setSelectProjectDetail(null)
    }
  }, [isSelectProjectId])
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }
  // if (errorMsg) {
  //   alert(errorMsg)

  //   return <></>
  // }

  return (
    <LayoutWorkspace teamList={teamList}>
      <Row className={styles.main_container}>
        <Col className={styles.contents_container}>
          <Row className={styles.content_main_title} align={"bottom"}>
            <Col>Personal</Col>
            <Col />
          </Row>
          <Row className={styles.projects_title} justify={"space-between"} align={"middle"}>
            <Col>Projects</Col>
            <Col className={styles.view_all} onClick={() => void router.push("/workspace/personal/projects")}>
              View All {">"}
            </Col>
          </Row>
          <Row className={styles.project_list} justify={"space-evenly"}>
            <Col
              className={styles.add_project}
              onClick={() => {
                setIsSelectProjectId(null)
                // 프로젝트 추가 로직
                modalDispatch({
                  open: true,
                  children: (
                    <CreateProjectModal
                      onApply={async (title: string) => {
                        const response = await apiManager.projectApi.create({ title })

                        modalDispatch({ open: false })

                        if (apiUtil.isErrorResponse(response)) {
                          alert(response.message)
                          return
                        }

                        void router.push(`/feature/${response.data.projectID}`)
                      }}
                    />
                  ),
                })
              }}
            >
              <Row className={styles.add_icon} justify={"space-evenly"} align={"middle"}>
                <PlusOutlined size={20} />
              </Row>
              <Row className={styles.project_item_project_name} justify={"center"}>
                New Project
              </Row>
            </Col>
            {projectListState
              .sort((a, b) => {
                return Number(b.updated_at.replaceAll("-", "")) - Number(a.updated_at.replaceAll("-", ""))
              })
              .slice(0, 4)
              .map((project, index) => {
                return (
                  <Col
                    className={styles.project_item}
                    key={index}
                    onClick={() => setIsSelectProjectId(project.projectID)}
                  >
                    <Row className={styles.project_item_img} justify={"center"} align={"middle"}>
                      {project.project_image !== "" ? (
                        <Document file={project.project_image} onLoadSuccess={onDocumentLoadSuccess}>
                          {Array.from(new Array(numPages), (_, index) => (
                            <Page height={92} key={index} pageNumber={index + 1} error={<div></div>} />
                          ))}
                        </Document>
                      ) : (
                        <Image src={imgAsset.projectImg} height={92} width={172} alt="example" />
                      )}
                    </Row>
                    <div className={styles.item_divider} />
                    <Row className={styles.project_item_project_name} justify={"center"}>
                      {project.title}
                    </Row>
                  </Col>
                )
              })}
          </Row>
          {/* <Row className={styles.section_divider} />
          <Row className={styles.reference_title} justify={"space-between"} align={"middle"}>
            <Col>Reference</Col>
          </Row>
          <Row className={styles.reference_list} justify={"space-evenly"}>
            {[1, 2, 3, 4, 5].map((project, index) => (
              <Col
                className={styles.reference_item}
                key={index}
                onClick={() => setIsSelectProjectId(project)}
              >
                <Row className={styles.reference_item_img} justify={"center"} align={"middle"}>
                  image
                </Row>
                <div className={styles.item_divider} />
                <Row className={styles.project_item_project_name} justify={"center"}>
                  Reference Name
                </Row>
              </Col>
            ))}
          </Row> */}
        </Col>
        <Col className={styles.project_detail_container}>
          <Space direction="vertical" size={0}>
            <Row className={styles.project_detail_title} align={"bottom"}>
              <Col>Project Properties</Col>
            </Row>
            {isSelectProjectId !== null ? (
              <Space className={styles.project_detail_wrapper} direction="vertical" size={0}>
                <Row
                  className={styles.project_detail_img}
                  justify={"center"}
                  align={"middle"}
                  style={{ overflow: "hidden" }}
                >
                  {searchProjectListState.find(v => v.projectID === isSelectProjectId)?.project_image !== "" ? (
                    <Document
                      file={searchProjectListState.find(v => v.projectID === isSelectProjectId)?.project_image}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      {Array.from(new Array(numPages), (_, index) => (
                        <Page height={175} key={index} pageNumber={index + 1} error={<div></div>} />
                      ))}
                    </Document>
                  ) : (
                    <Image src={imgAsset.projectImg} width={330} height={220} alt="example" />
                  )}
                </Row>
                <Space direction="vertical" className={styles.project_name}>
                  <Col className={styles.project_properties_title}>NAME</Col>
                  <Col className={styles.project_properties_desc}>{selectProjectDetail?.title}</Col>
                </Space>
                <Space direction="vertical" className={styles.project_info}>
                  <Col className={styles.project_properties_title}>INFORMATION</Col>
                  <Col>Owner : {selectProjectDetail?.owner}</Col>
                  <Col>Data Created : {dayjs(selectProjectDetail?.created_at).format("MMM D, h:mm A")}</Col>
                  <Col>Last Modified : {dayjs(selectProjectDetail?.updated_at).format("MMM D, h:mm A")}</Col>
                </Space>
                <Space direction="vertical" className={styles.project_status}>
                  <Col className={styles.project_properties_title}>BOARD CREATE</Col>
                  <Col className={styles.project_properties_desc}>
                    Auto Placement : {selectProjectDetail?.auto_placement?.percent}
                  </Col>
                  <Col className={styles.project_properties_desc}>
                    Running time : {selectProjectDetail?.auto_placement?.running_time}
                  </Col>
                  <Col className={styles.project_properties_desc}>
                    Auto Routing : {selectProjectDetail?.auto_routing?.percent}
                  </Col>
                  <Col className={styles.project_properties_desc}>
                    Running time : {selectProjectDetail?.auto_routing?.running_time}
                  </Col>
                </Space>
              </Space>
            ) : (
              <Space className={styles.project_detail_wrapper} direction="vertical" size={0}>
                <Row className={styles.project_detail_img} justify={"center"} align={"middle"}>
                  <Col>
                    <Row justify={"center"} align={"middle"}>
                      Nothing Selected
                    </Row>
                    <Row justify={"center"} align={"middle"}>
                      Select a project to view its properties.
                    </Row>
                  </Col>
                </Row>
              </Space>
            )}
          </Space>
          <Space direction="vertical" size={0} className={styles.menu_button_gruop}>
            <Row className={styles.menu_button_gruop1} justify={"space-between"}>
              <BasicButton
                disabled={isSelectProjectId === null}
                onClick={() => {
                  if (isSelectProjectId === null) return

                  modalDispatch({
                    open: true,
                    children: (
                      <ShareProjectModal
                        onApply={async (id: string) => {
                          const response = await apiManager.projectApi.share({
                            accountID: id,
                            projectId: isSelectProjectId,
                          })

                          modalDispatch({ open: false })

                          if (apiUtil.isErrorResponse(response)) {
                            alert(response.message)
                            return
                          }
                        }}
                      />
                    ),
                  })
                }}
              >
                Share
              </BasicButton>
              <BasicButton
                disabled={isSelectProjectId === null}
                onClick={() =>
                  modalDispatch({
                    open: true,
                    children: (
                      <CloneProjectModal
                        onApply={async (title: string) => {
                          const res = await apiManager.projectApi.clone({
                            projectId: isSelectProjectId as number,
                            clone_title: title,
                          })

                          modalDispatch({ open: false })

                          if (apiUtil.isErrorResponse(res)) {
                            alert(res.message)
                            return
                          }

                          void router.push(`/feature/${isSelectProjectId}`)
                        }}
                      />
                    ),
                  })
                }
              >
                Clone
              </BasicButton>
              <BasicButton
                disabled={isSelectProjectId === null}
                onClick={() =>
                  modalDispatch({
                    open: true,
                    children: (
                      <DeleteProjectModal
                        onApply={async (title: string) => {
                          const res = await apiManager.projectApi.delete({
                            projectId: isSelectProjectId as number,
                            delete_title: title,
                          })

                          modalDispatch({ open: false })

                          if (apiUtil.isErrorResponse(res)) {
                            alert(res.message)
                            return
                          }

                          setProjectListState(list => list.filter(project => project.projectID !== res.data.projectID))
                        }}
                        title={projectListState.find(v => v.projectID === isSelectProjectId)?.title ?? ""}
                      />
                    ),
                  })
                }
              >
                Delete
              </BasicButton>
            </Row>
            <Row className={styles.menu_button_gruop2} justify={"center"}>
              <BasicButton
                disabled={isSelectProjectId === null}
                onClick={async () => {
                  if (!selectProjectDetail) return
                  const response = await apiManager.projectApi.lastModified(Number(selectProjectDetail?.projectID))
                  if (apiUtil.isErrorResponse(response)) {
                    alert(response.message)
                    return
                  }

                  void router.push(`/${MODIFIED_STEP[response.last_modified_step]}/${response.projectID}`)
                }}
              >
                Edit
              </BasicButton>
            </Row>
          </Space>
        </Col>
      </Row>
    </LayoutWorkspace>
  )
}
export default AuthHoc(PersonalPage)
