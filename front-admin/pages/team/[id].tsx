import { apiManager, apiUtil } from "@/apis"
import { PageFrameFooter } from "@/components/layout"
import {
  TeamDescDetail,
  TeamDesc,
  TeamDescAType,
  TeamDescBType,
  TeamDescDType,
  TeamDescEType,
  TeamDescFType,
  TeamNullDataB,
} from "@/components/pages/team/teamDesc"
import styles from "./teamDetail.module.scss"
import { Divider, Image, RadioChangeEvent } from "antd"
import { ObjectDescription, TableDescription } from "@/components/Description"
import { useState } from "react"
import { TEAMDETAIL } from "@/const"
import { useRouter } from "next/router"
import { BasicInput } from "@/components/Input"
import { BasicButton, FileButton } from "@/components/Button"
import { useAsyncEffect } from "@/hooks"
import { BooleanRadioGroup } from "@/components/Radio"
import { BasicTable } from "@/components/Table"
import { PositionSelection } from "@/components/Select"
import { NextPage } from "next"
import { API_ERROR_MSG } from "@/const/api.error.const"

const TeamDetail: NextPage = () => {
  const router = useRouter()
  //-------------------------------------------------------------------------
  // [Datas]
  const [teamID, setTeamID] = useState<number>(undefined)

  // (Desc A)
  const [teamDataA, setTeamDataA] = useState<TeamDescAType>(undefined)

  // (Desc B)
  // Desc B - DB 데이터
  const [editTeamAddresses, setEditTeamAddresses] = useState<TeamDescBType[]>([] as TeamDescBType[])

  // Desc B - 추가 데이터
  const [instanceTeamAddresses, setInstanceTeamAddresses] = useState<TeamDescBType[]>([] as TeamDescBType[])

  // 삭제 address
  const [deleteAddressIDs, setDeleteAddressIDs] = useState<number[]>([])

  // (Desc C)
  // const [teamDataC, setTeamDataC] = useState(undefined)

  // (Desc D)
  const [teamDataD, setTeamDataD] = useState<TeamDescDType[]>([] as TeamDescDType[])
  // 삭제할 project
  const [deleteProjectIDs, setDeleteProjectIDs] = useState<number[]>([])

  // (Desc E)
  const [teamDataE, setTeamDataE] = useState<TeamDescEType[]>([] as TeamDescEType[])
  // 삭제할 customblock
  const [deleteCustomBlockIDs, setDeleteCustomBlockIDs] = useState<number[]>([])

  // (Desc F)
  const [teamDataF, setTeamDataF] = useState<TeamDescFType[]>([] as TeamDescFType[])
  // 삭제할 member
  const [deleteMemberIDs, setDeleteMemberIDs] = useState<number[]>([])

  // (profile_image)
  const [profile, setProfile] = useState<File>(null)
  const [profileURL, setProfileURL] = useState<string>(null)

  //-------------------------------------------------------------------------
  // [초기화]
  useAsyncEffect(async () => {
    if (!router.query.id) return

    // [set UserID]
    setTeamID(Number(router.query.id))

    // [set DescA]
    const teamResponse = await apiManager.teamApi.getDetail(Number(router.query.id))
    if (apiUtil.isErrorResponse(teamResponse)) {
      if (apiUtil.signChecker(teamResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(teamResponse.message)
      return
    }

    const modifiedTeamDataA = {
      teamID: teamResponse.teamID,
      team_name: teamResponse.team_name,
      phone: {
        code: teamResponse.countrycode,
        value: teamResponse.phone_number,
        opt_in: teamResponse.phone_opt_in,
      },
      email: {
        value: teamResponse.email,
        opt_in: teamResponse.email_opt_in,
      },
      team_image: teamResponse.team_image,
    } as TeamDescAType
    setTeamDataA(modifiedTeamDataA)

    // [set DescB - editUserAddress]
    const teamAddressResponse = await apiManager.teamApi.getTeamAddresses(Number(router.query.id))
    if (apiUtil.isErrorResponse(teamAddressResponse)) {
      if (apiUtil.signChecker(teamAddressResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(teamAddressResponse.message)
      return
    }

    setEditTeamAddresses(
      teamAddressResponse.map((item, index) => {
        const { address_json_string, ...addressInfo } = item

        const splitAddress = item.address_json_string.split("(")
        return {
          ...addressInfo,
          address: splitAddress.slice(1).join().slice(0, -1),
          detailAddress: splitAddress[0],
        } as TeamDescBType
      }),
    )

    // [set DescD]
    const teamProjectResponse = await apiManager.teamApi.getTeamProjects(Number(router.query.id))
    if (apiUtil.isErrorResponse(teamProjectResponse)) {
      if (apiUtil.signChecker(teamProjectResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(teamProjectResponse.message)
      return
    }
    setTeamDataD(teamProjectResponse.map((item, index) => ({ ...item, index: index + 1 })))

    // [set DescE]
    const teamCustomblockResponse = await apiManager.teamApi.getTeamCustomblocks(Number(router.query.id))
    if (apiUtil.isErrorResponse(teamCustomblockResponse)) {
      if (apiUtil.signChecker(teamCustomblockResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(teamCustomblockResponse.message)
      return
    }
    setTeamDataE(teamCustomblockResponse.map((item, index) => ({ ...item, index: index + 1 })))

    // [set DescF]
    const teamMemberResponse = await apiManager.teamApi.getTeamMembers(Number(router.query.id))
    if (apiUtil.isErrorResponse(teamMemberResponse)) {
      if (apiUtil.signChecker(teamMemberResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(teamMemberResponse.message)
      return
    }

    setTeamDataF(
      teamMemberResponse.map((item, index) => {
        const { email, ...memberInfo } = item
        return { ...item, index: index + 1, user_email: email }
      }),
    )
  }, [router.query.id])
  //-------------------------------------------------------------------------
  // [Handler]
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]

    if (file) {
      setProfile(file)
      setProfileURL(URL.createObjectURL(file))
    }
  }

  const addAddress = () => {
    setInstanceTeamAddresses([...instanceTeamAddresses, TeamNullDataB])
  }

  const deleteAddress = index => {
    const editLength = editTeamAddresses.length

    if (index < editLength) {
      // 기존 Address 일때 - 신규 등록시 x
      setEditTeamAddresses(
        (() => {
          const newEditTeamAddress = editTeamAddresses
            .map((item, idx) => {
              if (index === idx) {
                // detailPage
                // - item.addressID를 삭제 할 ID 배열에 저장,
                //    -> 저장 버튼 클릭 시 삭제 API 호출
                setDeleteAddressIDs([...deleteAddressIDs, item.addressID])
                return
              }
              return item
            })
            .filter(item => item !== undefined)
          return newEditTeamAddress
        })(),
      )
    } else {
      // 신규(임시) Address 일때
      const newIndex = index - editLength
      setInstanceTeamAddresses(
        (() => {
          const newInstanceTeamAddress = instanceTeamAddresses
            .map((item, idx) => {
              if (newIndex === idx) return

              return item
            })
            .filter(item => item !== undefined)

          return newInstanceTeamAddress
        })(),
      )
    }
  }

  const deleteProject = (projectID: number) => {
    setDeleteProjectIDs([...deleteProjectIDs, projectID])
    setTeamDataD(
      teamDataD.filter(item => item.projectID !== projectID).map((item, index) => ({ ...item, index: index + 1 })),
    )
  }
  const deleteCustomblock = (customblockID: number) => {
    setDeleteCustomBlockIDs([...deleteCustomBlockIDs, customblockID])
    setTeamDataE(
      teamDataE
        .filter(item => item.customblockID !== customblockID)
        .map((item, index) => ({ ...item, index: index + 1 })),
    )
  }
  const deleteMember = (memberID: number) => {
    setDeleteMemberIDs([...deleteMemberIDs, memberID])
    setTeamDataF(
      teamDataF.filter(item => item.userID !== memberID).map((item, index) => ({ ...item, index: index + 1 })),
    )
  }

  // [footer Handler]
  const saveHandler = async () => {
    console.log("Save: Team")
    console.log(teamID)

    // 1. Team Profile 수정
    const teamEdit = {
      profile_image: profile,
      nickname: teamDataA.team_name,
      email: teamDataA.email.value,
      countrycode: teamDataA.phone.code,
      phone: teamDataA.phone.value,
      email_opt_in: teamDataA.email.opt_in,
      phone_opt_in: teamDataA.phone.opt_in,
    }
    console.log("teamEdit", teamEdit)
    const teamEditRes = await apiManager.teamApi.editTeamProfile(teamID, teamEdit)
    if (apiUtil.isErrorResponse(teamEditRes)) {
      if (apiUtil.signChecker(teamEditRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(teamEditRes.message)
      return
    }

    // 2-1. 주소 삭제
    console.log("deleteAddressIDs", deleteAddressIDs)
    const teamAddressDeleteRes = await apiManager.teamApi.removeTeamAddress(deleteAddressIDs)
    if (apiUtil.isErrorResponse(teamAddressDeleteRes)) {
      if (apiUtil.signChecker(teamAddressDeleteRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(teamAddressDeleteRes.message)
      return
    }

    // 2-2. 주소 수정
    for (const item of editTeamAddresses) {
      const addressEdit = {
        address_name: item.address_name,
        receiver: item.receiver,
        phone_number: item.phone_number,
        address_json_string: `${item.detailAddress}(${item.address})`,
        postal_code: item.postal_code,
        is_default: item.is_default,
      }

      console.log("addressEdit", addressEdit)
      const teamEditAddressRes = await apiManager.teamApi.editTeamAddress(item.addressID, teamID, addressEdit)
      if (apiUtil.isErrorResponse(teamEditAddressRes)) {
        if (apiUtil.signChecker(teamEditAddressRes)) {
          alert(API_ERROR_MSG.NEEDLOGIN)
          apiUtil.removeUserData()
          void router.push("/signin")
          return
        }
        alert(teamEditAddressRes.message)
        return
      }
    }

    // 2-3. 주소 추가
    for (const item of instanceTeamAddresses) {
      const addressNew = {
        address_name: item.address_name,
        receiver: item.receiver,
        phone_number: item.phone_number,
        address_json_string: `${item.detailAddress}(${item.address})`,
        postal_code: item.postal_code,
        is_default: item.is_default,
      }

      console.log("addressNew", addressNew)
      const teamNewAddressRes = await apiManager.teamApi.createTeamAddress(teamID, addressNew)
      if (apiUtil.isErrorResponse(teamNewAddressRes)) {
        if (apiUtil.signChecker(teamNewAddressRes)) {
          alert(API_ERROR_MSG.NEEDLOGIN)
          apiUtil.removeUserData()
          void router.push("/signin")
          return
        }
        alert(teamNewAddressRes.message)
        return
      }
    }

    // 4. 프로젝트 삭제
    console.log("deleteProjectIDs", deleteProjectIDs)
    const teamProjectDeleteRes = await apiManager.projectApi.removeProjects(deleteProjectIDs)
    if (apiUtil.isErrorResponse(teamProjectDeleteRes)) {
      if (apiUtil.signChecker(teamProjectDeleteRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(teamProjectDeleteRes.message)
      return
    }

    // 5. 커스텀 블록 삭제
    console.log("deleteCustomBlockIDs", deleteCustomBlockIDs)
    const teamCustomblockDeleteRes = await apiManager.customblockApi.removeCustomblocks(deleteCustomBlockIDs)
    if (apiUtil.isErrorResponse(teamCustomblockDeleteRes)) {
      if (apiUtil.signChecker(teamCustomblockDeleteRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(teamCustomblockDeleteRes.message)
      return
    }

    // 6-1. 팀 멤버 탈퇴
    console.log("deleteMemberIDs", deleteMemberIDs)
    for (const item of deleteMemberIDs) {
      const teamMemberDeleteRes = await apiManager.teamApi.removeTeamMember(teamID, item)
      if (apiUtil.isErrorResponse(teamMemberDeleteRes)) {
        if (apiUtil.signChecker(teamMemberDeleteRes)) {
          alert(API_ERROR_MSG.NEEDLOGIN)
          apiUtil.removeUserData()
          void router.push("/signin")
          return
        }
        alert(teamMemberDeleteRes.message)
        return
      }
    }

    // 6-2. 팀 멤버 정보 수정
    for (const item of teamDataF) {
      console.log(teamID, item.userID, item.role)
      const teamMemberEditRes = await apiManager.teamApi.changeTeamMemberRole(teamID, item.userID, item.role)
      if (apiUtil.isErrorResponse(teamMemberEditRes)) {
        if (apiUtil.signChecker(teamMemberEditRes)) {
          alert(API_ERROR_MSG.NEEDLOGIN)
          apiUtil.removeUserData()
          void router.push("/signin")
          return
        }
        alert(teamMemberEditRes.message)
        return
      }
    }

    router.push("/team")
  }

  const cancelHandler = () => {
    console.log("Cancel: Team")
    router.push("/team")
  }

  //-------------------------------------------------------------------------
  // [Content Render]
  const renderSetDescB = (index, key, change) => {
    const editLength = editTeamAddresses.length

    if (index < editLength) {
      // 기존 Address Data
      setEditTeamAddresses(
        (() => {
          const newEditTeamAddress = editTeamAddresses.map((item, idx) => {
            if (index === idx) {
              return {
                ...item,
                [key]: change,
              }
            }
            return item
          })
          return newEditTeamAddress
        })(),
      )
    } else {
      // 신규(임시) Address 일때
      const newIndex = index - editLength
      setInstanceTeamAddresses(
        (() => {
          const newInstanceTeamAddress = instanceTeamAddresses.map((item, idx) => {
            if (newIndex === idx) {
              return {
                ...item,
                [key]: change,
              }
            }

            return item
          })

          return newInstanceTeamAddress
        })(),
      )
    }
  }

  const renderSetDescF = (index, key, change) => {
    setTeamDataF(() => {
      const newTeamDataF = teamDataF.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            [key]: change,
          }
        }

        return item
      })

      return newTeamDataF
    })
  }

  const teamRender = ({ index, key, pm_value }) => {
    switch (key) {
      // A
      case "team_name":
        return (
          <BasicInput
            value={pm_value}
            onChange={e => setTeamDataA({ ...teamDataA, [key]: e.target.value })}
          ></BasicInput>
        )
      case "phone":
        return (
          <div>
            <div className={styles.descA_phone_input_wrapper}>
              <BasicInput
                className={styles.descA_phone_countrycode}
                value={pm_value.code}
                onChange={e => setTeamDataA({ ...teamDataA, [key]: { ...pm_value, code: e.target.value } })}
              ></BasicInput>
              <BasicInput
                className={styles.descA_phone_phoneNum}
                value={pm_value.value}
                onChange={e => setTeamDataA({ ...teamDataA, [key]: { ...pm_value, value: e.target.value } })}
              ></BasicInput>
            </div>
            <BooleanRadioGroup
              option={"custom"}
              options={[
                { label: "수신 허용", value: true },
                { label: "수신 거부", value: false },
              ]}
              value={pm_value.opt_in}
              onChange={({ target: { value } }: RadioChangeEvent) =>
                setTeamDataA({ ...teamDataA, [key]: { ...pm_value, opt_in: value } })
              }
            ></BooleanRadioGroup>
          </div>
        )
      case "email":
        return (
          <div>
            <BasicInput
              className={styles.descA_email_input}
              value={pm_value.value}
              onChange={e => setTeamDataA({ ...teamDataA, [key]: { ...pm_value, value: e.target.value } })}
            ></BasicInput>
            <BooleanRadioGroup
              option={"custom"}
              options={[
                { label: "수신 허용", value: true },
                { label: "수신 거부", value: false },
              ]}
              value={pm_value.opt_in}
              onChange={({ target: { value } }: RadioChangeEvent) =>
                setTeamDataA({ ...teamDataA, [key]: { ...pm_value, opt_in: value } })
              }
            ></BooleanRadioGroup>
          </div>
        )
      case "team_image":
        return (
          <div className={styles.descA_image_wrapper}>
            {profile ? (
              <Image src={profileURL} alt={"team_image"} preview={false} className={styles.descA_image_image}></Image>
            ) : (
              <Image src={pm_value} alt={"team_image"} preview={false} className={styles.descA_image_image}></Image>
            )}
            <FileButton option={"image"} handleFile={handleFile} className={styles.descA_image_button}>
              이미지 교체
            </FileButton>
          </div>
        )
      // B
      case "addressID":
        return <BasicButton onClick={e => deleteAddress(index)}>배송지 삭제</BasicButton>
      case "address_name":
      case "receiver":
      case "phone_number":
      case "address":
      case "postal_code":
      case "detailAddress":
        return (
          <BasicInput
            value={pm_value}
            onChange={e => {
              renderSetDescB(index, key, e.target.value)
            }}
          ></BasicInput>
        )
      // C
      // case "cardName":
      //   return <BasicInput value={pm_value} onChange={e => renderSetDescC(index, key, e.target.value)}></BasicInput>
      // D
      case "projectID":
        return (
          <div className={styles.desc_manage_button_wrapper}>
            <BasicButton
              onClick={() => {
                router.push(`/project/${pm_value}`)
              }}
            >
              수정
            </BasicButton>
            <BasicButton
              onClick={() => {
                deleteProject(pm_value)
              }}
            >
              삭제
            </BasicButton>
          </div>
        )
      // E
      case "customblockID":
        return (
          <div className={styles.desc_manage_button_wrapper}>
            <BasicButton
              onClick={() => {
                router.push(`/custom/${pm_value}`)
              }}
            >
              수정
            </BasicButton>
            <BasicButton
              onClick={() => {
                deleteCustomblock(pm_value)
              }}
            >
              삭제
            </BasicButton>
          </div>
        )
      // F
      case "role":
        return (
          <>
            <PositionSelection
              value={pm_value}
              onChange={change => {
                renderSetDescF(index, key, change)
              }}
            ></PositionSelection>
          </>
        )
      case "userID":
        return (
          <div className={styles.desc_manage_button_wrapper}>
            <BasicButton
              onClick={() => {
                router.push(`/user/${pm_value}`)
              }}
            >
              수정
            </BasicButton>
            <BasicButton
              onClick={() => {
                deleteMember(pm_value)
              }}
            >
              탈퇴
            </BasicButton>
          </div>
        )
      //
      default:
        if (typeof pm_value === "object" && !Array.isArray(pm_value) && pm_value !== null)
          return <div>{JSON.stringify(pm_value)}</div>
        return <div>{pm_value}</div>
    }
  }
  //------------------------------------------------------------------------------------------------------
  // [UI]
  return (
    <PageFrameFooter titleKey={TEAMDETAIL} handler={{ saveHandler: saveHandler, cancelHandler: cancelHandler }}>
      <div className={styles.container}>
        <ObjectDescription
          descInfo={TeamDesc.descA}
          descDetails={TeamDescDetail}
          data={teamDataA}
          render={teamRender}
        ></ObjectDescription>
        <Divider></Divider>
        <>
          <div className={styles.team_descB_title}>
            <h3>배송지 정보</h3>
            <BasicButton onClick={addAddress}>배송지 추가</BasicButton>
            {/* <BasicButton>배송지 추가</BasicButton> */}
          </div>
          <TableDescription
            descInfo={TeamDesc.descB}
            descDetails={TeamDescDetail}
            data={[...editTeamAddresses, ...instanceTeamAddresses]}
            render={teamRender}
          ></TableDescription>
        </>
        <Divider></Divider>
        {/* <>
          <TableDescription
            descInfo={TeamDesc.descC}
            descDetails={TeamDescDetail}
            data={teamDataC}
            render={teamRender}
          ></TableDescription>
        </> */}
        <Divider></Divider>
        <BasicTable
          tableInfo={TeamDesc.descD}
          tableDetails={TeamDescDetail}
          dataSource={teamDataD}
          render={teamRender}
          pagination={{ position: ["bottomCenter"] }}
        ></BasicTable>
        <Divider></Divider>
        <BasicTable
          tableInfo={TeamDesc.descE}
          tableDetails={TeamDescDetail}
          dataSource={teamDataE}
          render={teamRender}
          pagination={{ position: ["bottomCenter"] }}
        ></BasicTable>
        <Divider></Divider>
        <BasicTable
          tableInfo={TeamDesc.descF}
          tableDetails={TeamDescDetail}
          dataSource={teamDataF}
          render={teamRender}
          pagination={{ position: ["bottomCenter"] }}
        ></BasicTable>
      </div>
    </PageFrameFooter>
  )
}

export default TeamDetail
