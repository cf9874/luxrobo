import styles from "./customblocks.module.scss"
import { useState } from "react"
// import { useRouter } from "next/router"
import { Col, Row, Space } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { BasicButton } from "components/Button"
import { BasicInput } from "components/Input"
import { LayoutWorkspace } from "Layout"
import { useAsyncEffect, useInputs, useRedux } from "hooks"
import { setModal } from "redux/reducers/config"
import { CloneCustomBlockModal, DeleteCustomBlockModal, ShareCustomBlockModal } from "components/Modal"
// import { GetServerSideProps } from "next"
import { TeamDto } from "apis/dto/teams.dto"
import { apiManager, apiUtil } from "apis"
import { CustomblockDto } from "apis/dto"
import AuthHoc from "hoc/AuthHoc"
import Image from "next/image"
import { useRouter } from "next/router"

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   const apiCaller = apiManager.updateContext(ctx)
//   const [teamListRes, customblockListRes] = await Promise.all([
//     apiCaller.userApi.getTeamList(),
//     apiCaller.blockApi.getList(Number(ctx.query.team)),
//   ])

//   if (apiUtil.isErrorResponse(teamListRes)) {
//     return {
//       props: { teamList: [], customblockList: [], errorMsg: teamListRes.message + "asdasd" },
//     }
//   } else if (apiUtil.isErrorResponse(customblockListRes)) {
//     return {
//       props: { teamList: [], customblockList: [], errorMsg: customblockListRes.message + "asd1asd213asd" },
//     }
//   }
//   const myTeam = teamListRes.find(team => team.teamID === Number(ctx.query.team)) ?? null

//   return {
//     props: {
//       teamList: teamListRes,
//       customblockList: customblockListRes,
//       myTeam: myTeam,
//       errorMsg: "",
//     },
//   }
// }

const CustomBlocksPage = () =>
  //   {
  //   teamList,
  //   customblockList,
  //   myTeam,
  //   errorMsg,
  // }: {
  //   teamList: TeamDto[]
  //   customblockList: CustomblockDto[]
  //   myTeam: TeamDto
  //   errorMsg: string
  // }
  {
    const router = useRouter()
    const modalDispatch = useRedux(setModal)
    const [blockListState, setBlockListState] = useState<CustomblockDto[]>([])
    const [searchBlockListState, setSearchBlockListState] = useState<CustomblockDto[]>([])
    const [isSelectBlockId, setIsSelectBlockId] = useState<number | null>(null)
    const [selectBlockDetail, setSelectBlockDetail] = useState<CustomblockDto | null>(null)
    const [teamList, setTeamList] = useState<TeamDto[]>([])
    const [myTeam, setMyTeam] = useState<TeamDto | null>(null)

    useAsyncEffect(async () => {
      const teamId = router.query.team

      const teamListRes = await apiManager.userApi.getTeamList()
      const blockListRes = await apiManager.blockApi.getList(Number(teamId))
      if (apiUtil.isErrorResponse(teamListRes)) {
        alert(teamListRes.message)
        return
      } else {
        setTeamList(teamListRes)
        const myTeam = teamListRes.find(team => team.teamID === Number(teamId)) ?? null
        setMyTeam(myTeam)
      }
      if (apiUtil.isErrorResponse(blockListRes)) {
        alert(blockListRes.message)
        return
      } else {
        setBlockListState(blockListRes)
        setSearchBlockListState(blockListRes)
      }
      if (isSelectBlockId !== null) {
        const detailRes = await apiManager.blockApi.custom(isSelectBlockId)
        if (!apiUtil.isErrorResponse(detailRes)) {
          setSelectBlockDetail(detailRes)
        }
      } else {
        setSelectBlockDetail(null)
      }
    }, [isSelectBlockId, router.query.team])

    const searchInput = useInputs({ value: "" })

    // if (errorMsg) {
    //   alert(errorMsg)

    //   return <></>
    // }

    return (
      <LayoutWorkspace teamList={teamList}>
        <Row className={styles.main_container}>
          <Col className={styles.contents_container}>
            <Row className={styles.content_main_title} align={"bottom"}>
              <Col>{myTeam?.team_name}</Col>
              <Col>/ Custom Blocks</Col>
            </Row>
            <Row className={styles.block_detail_title} justify={"space-between"} align={"middle"}>
              <Col>Custom Blocks</Col>
              <BasicInput
                style={{ width: 600 }}
                onChange={searchInput.onChange}
                value={searchInput.value}
                onKeyDown={event => {
                  if (event.key === "Enter") {
                    setBlockListState(() => blockListState.filter(blcok => blcok.name.includes(searchInput.value)))
                  }
                }}
                theme={{
                  colorPrimary: "#45d6df",
                  borderRadius: 20,
                  colorBorder: "#1b3852",
                }}
              />
            </Row>
            <Row className={styles.block_list}>
              <Col className={styles.add_block} onClick={() => setIsSelectBlockId(null)}>
                <Row className={styles.add_icon} justify={"space-evenly"} align={"middle"}>
                  <PlusOutlined size={20} />
                </Row>
                <Row className={styles.project_item_block_name} justify={"center"}>
                  New
                </Row>
              </Col>
              {searchBlockListState.map((block, index) => {
                return (
                  <Col
                    className={styles.block_item}
                    key={index}
                    onClick={() => setIsSelectBlockId(block.customblockID)}
                  >
                    <Row className={styles.block_item_img} justify={"center"} align={"middle"}>
                      <Image
                        unoptimized={true}
                        src={process.env.NEXT_PUBLIC_S3_URL + "icons/" + block.type.toLocaleLowerCase() + ".svg"}
                        width={40}
                        height={40}
                        alt={block.type}
                      />
                    </Row>
                    <Row className={styles.block_item_name} justify={"center"} align={"middle"}>
                      {block.name}
                    </Row>
                  </Col>
                )
              })}
            </Row>
            {/* <div className={styles.divider} />
          <Row className={styles.block_detail_title} justify={"space-between"} align={"middle"}>
            <Col>Reference</Col>
          </Row>
          <Row className={styles.reference_list}>
            {[1, 2, 3, 4, 5, 6, 7].map((project, index) => (
              <Col className={styles.block_item} key={index} onClick={() => setIsSelectBlockId(project)}>
                <Row className={styles.block_item_img} justify={"center"} align={"middle"}>
                  img
                </Row>
                <Row className={styles.block_item_name} justify={"center"} align={"middle"}>
                  ref : {project}
                </Row>
              </Col>
            ))}
          </Row> */}
          </Col>
          <Col className={styles.block_detail_container}>
            <Space direction="vertical" size={0}>
              <Row className={styles.block_detail_title} align={"bottom"}>
                <Col>Project Properties</Col>
              </Row>
              {isSelectBlockId !== null ? (
                <Space className={styles.block_detail_wrapper} direction="vertical" size={0}>
                  <Row className={styles.block_detail_img} justify={"center"} align={"middle"}>
                    Img
                  </Row>
                  <Space direction="vertical" className={styles.block_name}>
                    <Col className={styles.block_properties_title}>NAME</Col>
                    <Col className={styles.block_properties_desc}>{selectBlockDetail?.name}</Col>
                    <div className={styles.divider} />
                  </Space>
                  <Space direction="vertical" className={styles.project_info}>
                    <Col className={styles.block_properties_title}>DESCRIPTION</Col>
                    <Col className={styles.block_properties_desc}>{selectBlockDetail?.description}</Col>
                    <div className={styles.divider} />
                  </Space>
                  <Space direction="vertical" className={styles.project_icon}>
                    <Col className={styles.block_properties_title}>ICON</Col>
                    <Col className={styles.block_icon_img}>ICON</Col>
                    <div className={styles.divider} />
                  </Space>
                  <Space direction="vertical" className={styles.project_color}>
                    <Col className={styles.block_properties_title}>COLOR</Col>
                    <Col
                      // className={styles.block_properties_desc}
                      style={{
                        backgroundColor: `${selectBlockDetail?.color}`,
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                      }}
                    ></Col>
                    <div className={styles.divider} />
                  </Space>
                  {/* <Space direction="vertical" className={styles.project_function}>
                  <Col className={styles.block_properties_title}>FUNCTION</Col>
                  <Col className={styles.block_properties_desc}>Output</Col>
                  <div className={styles.divider} />
                </Space> */}
                  {/* <Space direction="vertical" className={styles.project_cost}>
                  <Col className={styles.block_properties_title}>COST</Col>
                  <Col className={styles.block_properties_desc}>₩ 3,800</Col>
                  <div className={styles.divider} />
                </Space> */}
                  <Space direction="vertical" className={styles.project_spec}>
                    <Col className={styles.block_properties_title}>SPECIFICATION</Col>
                    <Col>
                      <Row justify={"space-between"}>
                        <Col className={styles.block_properties_desc}>Type</Col>
                        <Col className={styles.block_properties_desc}>LED</Col>
                      </Row>
                      <Row justify={"space-between"}>
                        <Col className={styles.block_properties_desc}>Termination</Col>
                        <Col className={styles.block_properties_desc}>SMD/SMT</Col>
                      </Row>
                      <Row justify={"space-between"}>
                        <Col className={styles.block_properties_desc}>Forward Current</Col>
                        <Col className={styles.block_properties_desc}>10 mA</Col>
                      </Row>
                    </Col>
                  </Space>
                </Space>
              ) : (
                <Space className={styles.block_detail_wrapper} direction="vertical" size={0}>
                  <Row className={styles.block_empty_img} justify={"center"} align={"middle"}>
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
                  disabled={isSelectBlockId === null}
                  onClick={() => {
                    if (selectBlockDetail) {
                      modalDispatch({
                        open: true,
                        children: (
                          <ShareCustomBlockModal
                            onApply={async (accountID: string) => {
                              const response = await apiManager.blockApi.share({
                                customblockID: selectBlockDetail.customblockID,
                                blocks: { accountID },
                              })
                              if (apiUtil.isErrorResponse(response)) {
                                alert(response.message)
                                return
                              }
                            }}
                            selectItem={selectBlockDetail}
                          />
                        ),
                      })
                    }
                  }}
                >
                  Share
                </BasicButton>
                <BasicButton
                  disabled={isSelectBlockId === null}
                  onClick={() => {
                    if (selectBlockDetail) {
                      modalDispatch({
                        open: true,
                        children: (
                          <CloneCustomBlockModal
                            onApply={async ({
                              clone_description,
                              clone_name,
                            }: {
                              clone_description: string
                              clone_name: string
                            }) => {
                              const response = await apiManager.blockApi.clone({
                                customblockID: selectBlockDetail.customblockID,
                                clone_description: clone_description,
                                clone_name: clone_name,
                              })
                              if (apiUtil.isErrorResponse(response)) {
                                alert(response.message)
                                return
                              }
                            }}
                            selectItem={selectBlockDetail}
                          />
                        ),
                      })
                    }
                  }}
                >
                  Clone
                </BasicButton>
                <BasicButton
                  disabled={isSelectBlockId === null}
                  onClick={() => {
                    if (selectBlockDetail) {
                      modalDispatch({
                        open: true,
                        children: (
                          <DeleteCustomBlockModal
                            onApply={async ({ id, title }: { id: number; title: string }) => {
                              const response = await apiManager.blockApi.remove({
                                customblockID: id,
                                blocks: { delete_name: title },
                              })
                              if (apiUtil.isErrorResponse(response)) {
                                alert(response.message)
                                return
                              }
                              setIsSelectBlockId(null)
                              modalDispatch({ open: false })
                            }}
                            selectItem={selectBlockDetail}
                          />
                        ),
                      })
                    }
                  }}
                >
                  Delete
                </BasicButton>
              </Row>
              <Row className={styles.menu_button_gruop2} justify={"center"}>
                <BasicButton
                  disabled={isSelectBlockId === null}
                  onClick={() => {
                    console.log("커스텀 블록 생성")
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

export default AuthHoc(CustomBlocksPage)
