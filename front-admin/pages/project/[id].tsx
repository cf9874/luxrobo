import { apiManager, apiUtil } from "@/apis"
import { ObjectDescription } from "@/components/Description"
import { PageFrameFooter } from "@/components/layout"
import { ProjectDescDetail, ProjectDesc } from "@/components/pages/project/projectDesc"
import { Divider, message } from "antd"
import styles from "./projectDetail.module.scss"
import { PROJECTDETAIL } from "@/const"
import { useRouter } from "next/router"
import { useState } from "react"
import { useAsyncEffect } from "@/hooks"
import { BasicInput } from "@/components/Input"
import { BasicButton, FileButton } from "@/components/Button"
import { BasicTable } from "@/components/Table"
import { NextPage } from "next"
import { ProjectDto } from "@/apis/dto/project.dto"
import { API_ERROR_MSG } from "@/const/api.error.const"
import WorkSpaceModal from "@/components/modal/workspace.modal"
import { ProjectAlarmModal } from "@/components/modal"

//------------------------------------------------------------------------------------------------------
// [Main]
const ProjectDetail: NextPage = () => {
  const router = useRouter()
  //-------------------------------------------------------------------------
  // [Datas]
  const [projectID, setProjectID] = useState<number>(undefined)

  // (Desc A, B, C)
  const [projectInfo, setProjectInfo] = useState<ProjectDto>(undefined)

  const [projectFile, setProjectFile] = useState<File>(null)
  const [projectFileURL, setProjectFileURL] = useState<string>(null)
  const [schematicFile, setSchematicFile] = useState<File>(null)
  const [schematicFileURL, setSchematicFileURL] = useState<string>(null)
  const [PCBBoardFile, setPCBBoardFile] = useState<File>(null)
  const [PCBBoardFileURL, setPCBBoardFileURL] = useState<string>(null)
  //-------------------------------------------------------------------------
  // [초기화]
  useAsyncEffect(async () => {
    if (!router.query.id) return

    // [set ProjectID]
    setProjectID(Number(router.query.id))

    // [set ProjectInfo - desc A, B, C]
    const projectResponse = await apiManager.projectApi.getProject(Number(router.query.id).toString())
    if (apiUtil.isErrorResponse(projectResponse)) {
      if (apiUtil.signChecker(projectResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(projectResponse.message)
      return
    }
    setProjectInfo(projectResponse)
  }, [router.query.id])

  //-------------------------------------------------------------------------
  // [Handler]
  const handleProjectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]

    if (file) {
      setProjectFile(file)
      setProjectFileURL(URL.createObjectURL(file))
    }
  }

  const handleSchematicsFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]

    if (file) {
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

  const projectMovingHandler = async (userID: number, teamID: number, workspace?: string) => {
    console.log("Project : Move")
    // console.log("projectID", projectID)
    // console.log("userID", userID, "teamID", teamID)

    const projectMoveRes = await apiManager.projectApi.moveProjectToWorkspace(projectID, userID, teamID)
    if (apiUtil.isErrorResponse(projectMoveRes)) {
      if (apiUtil.signChecker(projectMoveRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(projectMoveRes.message)
      return
    }

    // 데이터 초기화
    const projectResponse = await apiManager.projectApi.getProject(projectID.toString())
    if (apiUtil.isErrorResponse(projectResponse)) {
      if (apiUtil.signChecker(projectResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(projectResponse.message)
      return
    }

    setProjectInfo({
      ...projectResponse,
      title: projectInfo.title,
    })
  }

  const projectCloneHandler = async (userID: number, teamID: number) => {
    console.log("Project : Clone")
    // console.log("projectID", projectID)
    // console.log("userID", userID, "teamID", teamID)

    const projectCloneRes = await apiManager.projectApi.moveProjectToWorkspace(projectID, userID, teamID)
    if (apiUtil.isErrorResponse(projectCloneRes)) {
      if (apiUtil.signChecker(projectCloneRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(projectCloneRes.message)
      return
    }

    message.info("Clone Project Success!")
  }

  // [footer Handler]
  const saveHandler = async () => {
    console.log("Save: Project")
    console.log(projectID)

    // 1. Project 수정
    const projectEdit = {
      name: projectInfo.title,
      project_file: projectFile,
      schematics_file: schematicFile,
      pcb_board_file: PCBBoardFile,
    }

    console.log("projectEdit", projectEdit)
    const projectEditRes = await apiManager.projectApi.editProject(projectID, projectEdit)
    if (apiUtil.isErrorResponse(projectEditRes)) {
      if (apiUtil.signChecker(projectEditRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(projectEditRes.message)
      return
    }

    router.push("/project")
  }

  const cancelHandler = () => {
    console.log("Cancel: Project")

    router.push("/project")
  }

  //-------------------------------------------------------------------------
  const ProjectRender = ({ index, key, pm_value }) => {
    switch (key) {
      // A
      case "title":
        return (
          <BasicInput
            value={pm_value}
            onChange={e => setProjectInfo({ ...projectInfo, [key]: e.target.value })}
          ></BasicInput>
        )
      case "workspace":
        return (
          <>
            <WorkSpaceModal
              workspace={projectInfo.workspace}
              userID={projectInfo.userID}
              teamID={projectInfo.teamID}
              movingHandler={projectMovingHandler}
              cloneHandler={projectCloneHandler}
            ></WorkSpaceModal>
          </>
        )
      // B
      case "part_id":
        return (
          <div>
            <BasicButton
              onClick={() => {
                router.push(`/part/${pm_value}`)
              }}
            >
              상세 정보
            </BasicButton>
          </div>
        )
      // C
      case "project_file":
        return (
          <div>
            {projectFile ? (
              <a href={projectFileURL} download={projectFile.name}>
                {projectFile.name}
              </a>
            ) : (
              <a href={pm_value} download>
                {pm_value.split("/").at(-1)}
              </a>
            )}
          </div>
        )
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
      case "projectFileBtn":
        return (
          <div>
            <FileButton handleFile={handleProjectFile} className={styles.project_desc_file_btn}>
              파일 찾기
            </FileButton>
          </div>
        )
      case "schematicFileBtn":
        return (
          <div>
            <FileButton handleFile={handleSchematicsFile} className={styles.project_desc_file_btn}>
              파일 찾기
            </FileButton>
          </div>
        )
      case "PCBBoardFileBtn":
        return (
          <div>
            <FileButton handleFile={handlePCBBoardFile} className={styles.project_desc_file_btn}>
              파일 찾기
            </FileButton>
          </div>
        )
      default:
        if (typeof pm_value === "object" && !Array.isArray(pm_value) && pm_value !== null)
          return <div>{JSON.stringify(pm_value)}</div>
        return <div>{pm_value}</div>
    }
  }

  //----------------------------------------------------------------------------
  // [UI]
  return (
    <PageFrameFooter titleKey={PROJECTDETAIL} handler={{ saveHandler: saveHandler, cancelHandler: cancelHandler }}>
      <div className={styles.container}>
        <>
          <div className={styles.project_descA_title}>
            <h3>프로젝트 정보</h3>
            <ProjectAlarmModal projectID={projectID}></ProjectAlarmModal>
          </div>
          <ObjectDescription
            descInfo={ProjectDesc.descA}
            descDetails={ProjectDescDetail}
            data={projectInfo}
            render={ProjectRender}
          ></ObjectDescription>
        </>
        <Divider></Divider>
        <BasicTable
          tableInfo={ProjectDesc.descB}
          tableDetails={ProjectDescDetail}
          dataSource={
            projectInfo
              ? projectInfo.project_blocks
                ? projectInfo.project_blocks.map((item, index) => ({ ...item, index: index + 1 }))
                : []
              : []
          }
          render={ProjectRender}
          pagination={{ position: ["bottomCenter"] }}
        ></BasicTable>
        <Divider></Divider>
        <ObjectDescription
          descInfo={ProjectDesc.descC}
          descDetails={ProjectDescDetail}
          data={projectInfo}
          render={ProjectRender}
        ></ObjectDescription>
      </div>
    </PageFrameFooter>
  )
}

export default ProjectDetail
