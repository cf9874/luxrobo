import { useState } from "react"
import { useRouter } from "next/router"
import { Col, Row, Space } from "antd"
import styles from "./projects.module.scss"
import { PlusOutlined } from "@ant-design/icons"
import { BasicInput } from "components/Input"
import { LayoutWorkspace } from "Layout"
import { ProjectDto, ProjectProgress, TeamDto } from "apis/dto"
import { BasicButton } from "components/Button"
import { setModal } from "redux/reducers/config"
import { useAsyncEffect, useInputs, useRedux } from "hooks"
import { CloneProjectModal, CreateProjectModal, DeleteProjectModal } from "components/Modal"
// import { GetServerSideProps } from "next"
import { apiManager, apiUtil } from "apis"
import dayjs from "dayjs"

import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/TextLayer.css"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import { imgAsset } from "@assets/image"
import Image from "next/image"
import AuthHoc from "hoc/AuthHoc"
import { ShareProjectModal } from "components/Modal/modal.share.project"
import { MODIFIED_STEP } from "@const/project.const"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
//server data
// export const getServerSideProps: GetServerSideProps = async ctx => {
//   const apiCaller = apiManager.updateContext(ctx)

//   const [teamListRes, projectListRes] = await Promise.all([
//     apiCaller.userApi.getTeamList(),
//     apiCaller.projectApi.getList(Number(ctx.query.team)),
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

//   const myTeam = teamListRes.find(team => team.teamID === Number(ctx.query.team)) ?? null

//   return {
//     props: { teamList: teamListRes, projectList: projectListRes, myTeam },
//   }
// }
const ProjectPage = () =>
  //   {
  //   teamList,
  //   projectList,
  //   myTeam,
  // }: {
  //   teamList: TeamDto[]
  //   projectList: ProjectDto[]
  //   myTeam: TeamDto | null
  // }
  {
    const router = useRouter()
    const modalDispatch = useRedux(setModal)
    const [numPages, setNumPages] = useState(0)

    const [projectListState, setProjectListState] = useState<ProjectDto[]>([])
    const [searchProjectListState, setSearchProjectListState] = useState<ProjectDto[]>([])
    const [teamList, setTeamList] = useState<TeamDto[]>([])

    const [myTeam, setMyTeam] = useState<TeamDto | null>(null)
    const [isSelectProjectId, setIsSelectProjectId] = useState<number | null>(null)

    const { query } = router

    const [selectProjectDetail, setSelectProjectDetail] = useState<(ProjectDto & ProjectProgress) | null>(null)

    useAsyncEffect(async () => {
      const teamListRes = await apiManager.userApi.getTeamList()
      const projectListRes = await apiManager.projectApi.getList(Number(query.team))
      if (apiUtil.isErrorResponse(teamListRes)) {
        alert(teamListRes.message)
        return
      } else {
        setTeamList(teamListRes)
        const myTeam = teamListRes.find(team => team.teamID === Number(query.team)) ?? null
        setMyTeam(myTeam)
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
    }, [isSelectProjectId, query.team])

    const searchInput = useInputs({ value: "" })
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
      setNumPages(numPages)
    }
    return (
      <LayoutWorkspace teamList={teamList}>
        <Row className={styles.main_container}>
          <Col className={styles.contents_container}>
            <Row className={styles.content_main_title} align={"bottom"}>
              <Col>{myTeam?.team_name}</Col>
              <Col>/ Project</Col>
            </Row>
            <Row className={styles.projects_title} justify={"space-between"} align={"middle"}>
              <Col>Projects</Col>
              <BasicInput
                style={{ width: 600 }}
                onChange={searchInput.onChange}
                value={searchInput.value}
                onClick={() => {
                  setSearchProjectListState(() =>
                    projectListState.filter(project => project.title.includes(searchInput.value)),
                  )
                }}
                onKeyDown={event => {
                  if (event.key === "Enter") {
                    setSearchProjectListState(() =>
                      projectListState.filter(project => project.title.includes(searchInput.value)),
                    )
                  }
                }}
                theme={{
                  colorPrimary: "#45d6df",
                  borderRadius: 20,
                  colorBorder: "#1b3852",
                }}
              />
            </Row>
            <Row className={styles.project_list} justify={"space-evenly"}>
              <Col
                className={styles.add_project}
                onClick={() => {
                  setIsSelectProjectId(null)
                  console.log(isSelectProjectId)
                  modalDispatch({
                    open: true,
                    children: (
                      <CreateProjectModal
                        onApply={async (title: string) => {
                          const response = await apiManager.projectApi.create({ title, teamId: Number(query.team) })

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
                  // 프로젝트 추가 로직
                }}
              >
                <Row className={styles.add_icon} justify={"space-evenly"} align={"middle"}>
                  <PlusOutlined size={20} />
                </Row>
                <Row className={styles.project_item_project_name} justify={"center"}>
                  New Project
                </Row>
              </Col>
              {searchProjectListState.map((project, index) => (
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
                  <div className={styles.divider} />
                  <Row className={styles.project_item_project_name} justify={"center"}>
                    {project.title}
                  </Row>
                </Col>
              ))}
            </Row>
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

                            setProjectListState(list =>
                              list.filter(project => project.projectID !== res.data.projectID),
                            )
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
                    console.log("해당 프로젝트 최근 편집 지점으로 이동")
                    if (!selectProjectDetail) return
                    const response = await apiManager.projectApi.lastModified(Number(selectProjectDetail?.projectID))
                    if (apiUtil.isErrorResponse(response)) {
                      alert(response.message)
                      return
                    }

                    console.log(334, response)
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
export default AuthHoc(ProjectPage)
