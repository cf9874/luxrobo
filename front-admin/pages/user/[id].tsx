import { useAsyncEffect } from "../../hooks"
import { useRouter } from "next/router"
import { PageFrameFooter } from "@/components/layout"
import {
  UserDesc,
  UserDescDetail,
  UserDescAType,
  UserDescBType,
  UserDescDType,
  UserDescEType,
  UserDescFType,
  UserDescGType,
  UserNullDataB,
} from "@/components/pages/user/userDesc"
import styles from "./userDetail.module.scss"
import { Divider, Image, RadioChangeEvent, message } from "antd"
import { useState } from "react"
import { USERDETAIL } from "@/const"
import { BasicInput } from "@/components/Input"
import { BasicButton, FileButton } from "@/components/Button"
import { BooleanRadioGroup } from "@/components/Radio"
import { BasicTable } from "@/components/Table"
import { PositionSelection } from "@/components/Select"
import { apiManager } from "@/apis"
import { apiUtil } from "@/apis/api.util"
import { NextPage } from "next"
import { API_ERROR_MSG } from "@/const/api.error.const"
import { ObjectDescription } from "@/components/Description/description.object"
import { TableDescription } from "@/components/Description/description.table"

//------------------------------------------------------------------------------------------------------
const getDateText = (timestamp: number) => {
  const date = new Date(timestamp * 1000)

  return `${date.getFullYear() % 100 < 10 ? `0${date.getFullYear() % 100}` : date.getFullYear() % 100}.${
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }.${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} ${
    date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  }:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`
}
//------------------------------------------------------------------------------------------------------
const UserDetail: NextPage = () => {
  const router = useRouter()
  //-------------------------------------------------------------------------
  // [Datas]
  const [userID, setUserID] = useState<number>(undefined)

  // (Desc A)
  const [userDataA, setUserDataA] = useState<UserDescAType>(undefined)

  // (Desc B)
  // Desc B - DB 데이터
  const [editUserAddresses, setEditUserAddresses] = useState<UserDescBType[]>([] as UserDescBType[])

  // Desc B - 추가 데이터
  const [instanceUserAddresses, setInstanceUserAddresses] = useState<UserDescBType[]>([] as UserDescBType[])

  // 삭제 address
  const [deleteAddressIDs, setDeleteAddressIDs] = useState<number[]>([])

  // (Desc C)
  // const [userDataC, setUserDataC] = useState<UserDescCType[]>([])

  // (Desc D)
  const [userDataD, setUserDataD] = useState<UserDescDType[]>([] as UserDescDType[])
  // 삭제할 project
  const [deleteProjectIDs, setDeleteProjectIDs] = useState<number[]>([])

  // (Desc E)
  const [userDataE, setUserDataE] = useState<UserDescEType[]>([] as UserDescEType[])
  // 삭제할 customblock
  const [deleteCustomBlockIDs, setDeleteCustomBlockIDs] = useState<number[]>([])

  // Desc F
  const [userDataF, setUserDataF] = useState<UserDescFType[]>([] as UserDescFType[])
  // 삭제할 team
  const [deleteTeamIDs, setDeleteTeamIDs] = useState<number[]>([])

  // Desc G
  const [userDataG, setUserDataG] = useState<UserDescGType>(undefined)

  // (profile_image)
  const [profile, setProfile] = useState<File>(null)
  const [profileURL, setProfileURL] = useState<string>(null)

  //-------------------------------------------------------------------------
  // [초기화]
  useAsyncEffect(async () => {
    if (!router.query.id) return

    // [set UserID]
    setUserID(Number(router.query.id))

    // [set DescA, DescG]
    const userResponse = await apiManager.userApi.getDetail(Number(router.query.id))
    if (apiUtil.isErrorResponse(userResponse)) {
      if (apiUtil.signChecker(userResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(userResponse.message)
      return
    }

    // set DescA
    const modifiedUserDataA = {
      userID: userResponse.userID,
      accountID: userResponse.accountID,
      resetPassword: userResponse.userID,
      username: userResponse.username,
      nickname: userResponse.nickname,
      phone: {
        code: userResponse.countrycode,
        value: userResponse.phone_number,
        opt_in: userResponse.phone_opt_in,
      },
      email: {
        value: userResponse.email,
        opt_in: userResponse.email_opt_in,
      },
      profile_image: userResponse.profile_image,
    } as UserDescAType
    setUserDataA(modifiedUserDataA)
    // set DescG
    const modifiedUserDataG = {
      userID: userResponse.userID,
      created_at: userResponse.created_at,
      last_login_at: userResponse.last_login_at,
    } as UserDescGType
    setUserDataG(modifiedUserDataG)

    // [set DescB - editUserAddress]
    const userAddressResponse = await apiManager.userApi.getUserAddresses(Number(router.query.id))
    if (apiUtil.isErrorResponse(userAddressResponse)) {
      if (apiUtil.signChecker(userAddressResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(userAddressResponse.message)
      return
    }
    setEditUserAddresses(
      userAddressResponse.map((item, index) => {
        const { address_json_string, ...addressInfo } = item

        const splitAddress = address_json_string.split("(")
        return {
          ...addressInfo,
          address: splitAddress.slice(1).join().slice(0, -1),
          detailAddress: splitAddress[0],
        } as UserDescBType
      }),
    )

    // [set DescD]
    const userProjectResponse = await apiManager.userApi.getUserProjects(Number(router.query.id))
    if (apiUtil.isErrorResponse(userProjectResponse)) {
      if (apiUtil.signChecker(userProjectResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(userProjectResponse.message)
      return
    }
    setUserDataD(userProjectResponse.map((item, index) => ({ ...item, index: index + 1 })))

    // [set DescE]
    const userCustomBlockResponse = await apiManager.userApi.getUserCustomblocks(Number(router.query.id))
    if (apiUtil.isErrorResponse(userCustomBlockResponse)) {
      if (apiUtil.signChecker(userCustomBlockResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(userCustomBlockResponse.message)
      return
    }
    setUserDataE(userCustomBlockResponse.map((item, index) => ({ ...item, index: index + 1 })))

    // [set DescF]
    const userTeamResponse = await apiManager.userApi.getUserTeams(Number(router.query.id))
    if (apiUtil.isErrorResponse(userTeamResponse)) {
      if (apiUtil.signChecker(userTeamResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(userTeamResponse.message)
      return
    }
    setUserDataF(userTeamResponse.map((item, index) => ({ ...item, index: index + 1 })))
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
    setInstanceUserAddresses([...instanceUserAddresses, UserNullDataB])
  }

  const deleteAddress = index => {
    const editLength = editUserAddresses.length

    if (index < editLength) {
      // 기존 Address 일때 - 신규 등록시 x
      setEditUserAddresses(
        (() => {
          const newEditUserAddress = editUserAddresses
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
          return newEditUserAddress
        })(),
      )
    } else {
      // 신규(임시) Address 일때
      const newIndex = index - editLength
      setInstanceUserAddresses(
        (() => {
          const newInstanceUserAddress = instanceUserAddresses
            .map((item, idx) => {
              if (newIndex === idx) return

              return item
            })
            .filter(item => item !== undefined)

          return newInstanceUserAddress
        })(),
      )
    }
  }

  const deleteProject = (projectID: number) => {
    setDeleteProjectIDs([...deleteProjectIDs, projectID])
    setUserDataD(
      userDataD.filter(item => item.projectID !== projectID).map((item, index) => ({ ...item, index: index + 1 })),
    )
  }
  const deleteCustomblock = (customblockID: number) => {
    setDeleteCustomBlockIDs([...deleteCustomBlockIDs, customblockID])
    setUserDataE(
      userDataE
        .filter(item => item.customblockID !== customblockID)
        .map((item, index) => ({ ...item, index: index + 1 })),
    )
  }
  const deleteTeam = (teamID: number) => {
    setDeleteTeamIDs([...deleteTeamIDs, teamID])
    setUserDataF(userDataF.filter(item => item.teamID !== teamID).map((item, index) => ({ ...item, index: index + 1 })))
  }

  const resetPassword = async (userID: number) => {
    console.log("Reset Password : ", userID)

    const userResetPWRes = await apiManager.userApi.resetUserPassword(userID)
    if (apiUtil.isErrorResponse(userResetPWRes)) {
      if (apiUtil.signChecker(userResetPWRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(userResetPWRes.message)
      return
    }

    message.info("Reset Password Success!")
  }

  // [footer Handler]
  const saveHandler = async () => {
    console.log("Save: Team")
    console.log(userID)

    // 1-1. User Profile 수정
    const userEdit = {
      profile_image: profile,
      nickname: userDataA.nickname,
      email: userDataA.email.value,
      countrycode: userDataA.phone.code,
      phone_number: userDataA.phone.value,
      email_opt_in: userDataA.email.opt_in,
      phone_opt_in: userDataA.phone.opt_in,
    }
    console.log("UserEdit", userEdit)
    const userEditRes = await apiManager.userApi.editUserProfile(userID, userEdit)
    if (apiUtil.isErrorResponse(userEditRes)) {
      if (apiUtil.signChecker(userEditRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(userEditRes.message)
      return
    }

    // 1-2. 비밀번호 초기화
    // if (userDataA.resetPassword) {
    //   const userResetPWRes = await apiManager.userApi.resetUserPassword(userID)
    //   if (apiUtil.isErrorResponse(userResetPWRes)) {
    //     if (apiUtil.signChecker(userResetPWRes)) {
    //       alert(API_ERROR_MSG.NEEDLOGIN)
    //       apiUtil.removeUserData()
    //       void router.push("/signin")
    //       return
    //     }
    //     alert(userResetPWRes.message)
    //     return
    //   }
    //   console.log("Reset Password!")
    // }

    // 2-1. 주소 삭제
    console.log("deleteAddressIDs", deleteAddressIDs)
    const userAddressDeleteRes = await apiManager.userApi.removeUserAddress(deleteAddressIDs)
    if (apiUtil.isErrorResponse(userAddressDeleteRes)) {
      if (apiUtil.signChecker(userAddressDeleteRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(userAddressDeleteRes.message)
      return
    }

    // 2-2. 주소 수정
    for (const item of editUserAddresses) {
      const addressEdit = {
        addressID: item.addressID,
        address_name: item.address_name,
        receiver: item.receiver,
        phone_number: item.phone_number,
        address_json_string: `${item.detailAddress}(${item.address})`,
        postal_code: item.postal_code,
        is_default: item.is_default,
      }

      console.log("addressEdit", addressEdit)
      const userEditAddressRes = await apiManager.userApi.editUserAddress(item.addressID, userID, addressEdit)
      if (apiUtil.isErrorResponse(userEditAddressRes)) {
        if (apiUtil.signChecker(userEditAddressRes)) {
          alert(API_ERROR_MSG.NEEDLOGIN)
          apiUtil.removeUserData()
          void router.push("/signin")
          return
        }
        alert(userEditAddressRes.message)
        return
      }
    }

    // 2-3. 주소 추가
    for (const item of instanceUserAddresses) {
      const addressNew = {
        // userID: userID,
        address_name: item.address_name,
        receiver: item.receiver,
        phone_number: item.phone_number,
        address_json_string: `${item.detailAddress}(${item.address})`,
        postal_code: item.postal_code,
        is_default: false,
      }

      console.log("addressNew", addressNew)
      const userNewAddressRes = await apiManager.userApi.createNewUserAddress(userID, addressNew)
      if (apiUtil.isErrorResponse(userNewAddressRes)) {
        if (apiUtil.signChecker(userNewAddressRes)) {
          alert(API_ERROR_MSG.NEEDLOGIN)
          apiUtil.removeUserData()
          void router.push("/signin")
          return
        }
        alert(userNewAddressRes.message)
        return
      }
    }

    // 4. 프로젝트 삭제
    console.log("deleteProjectIDs", deleteProjectIDs)
    const userProjectDeleteRes = await apiManager.projectApi.removeProjects(deleteProjectIDs)
    if (apiUtil.isErrorResponse(userProjectDeleteRes)) {
      if (apiUtil.signChecker(userProjectDeleteRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(userProjectDeleteRes.message)
      return
    }

    // 5. 커스텀블록 삭제
    console.log("deleteCustomBlockIDs", deleteCustomBlockIDs)
    const userCustomblockDeleteRes = await apiManager.customblockApi.removeCustomblocks(deleteCustomBlockIDs)
    if (apiUtil.isErrorResponse(userCustomblockDeleteRes)) {
      if (apiUtil.signChecker(userCustomblockDeleteRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(userCustomblockDeleteRes.message)
      return
    }

    // 6-1. 팀 탈퇴
    console.log("deleteTeamIDs", deleteTeamIDs)
    for (const item of deleteTeamIDs) {
      const userTeamLeaveRes = await apiManager.userApi.leaveTeam(userID, item)
      if (apiUtil.isErrorResponse(userTeamLeaveRes)) {
        if (apiUtil.signChecker(userTeamLeaveRes)) {
          alert(API_ERROR_MSG.NEEDLOGIN)
          apiUtil.removeUserData()
          void router.push("/signin")
          return
        }
        alert(userTeamLeaveRes.message)
        return
      }
    }

    // 6-2. 팀 수정
    for (const item of userDataF) {
      console.log(item.teamID, userID, item.role)
      const userTeamEditRes = await apiManager.teamApi.changeTeamMemberRole(item.teamID, userID, item.role)
      if (apiUtil.isErrorResponse(userTeamEditRes)) {
        if (apiUtil.signChecker(userTeamEditRes)) {
          alert(API_ERROR_MSG.NEEDLOGIN)
          apiUtil.removeUserData()
          void router.push("/signin")
          return
        }
        alert(userTeamEditRes.message)
        return
      }
    }

    router.push("/user")
  }

  const cancelHandler = () => {
    console.log("Cancel: Team")
    router.push("/user")
  }
  //-------------------------------------------------------------------------
  // [Content Render]
  const renderSetDescB = (index, key, change) => {
    const editLength = editUserAddresses.length

    if (index < editLength) {
      // 기존 Address Data
      setEditUserAddresses(
        (() => {
          const newEditUserAddress = editUserAddresses.map((item, idx) => {
            if (index === idx) {
              return {
                ...item,
                [key]: change,
              }
            }
            return item
          })
          return newEditUserAddress
        })(),
      )
    } else {
      // 신규(임시) Address 일때
      const newIndex = index - editLength
      setInstanceUserAddresses(
        (() => {
          const newInstanceUserAddress = instanceUserAddresses.map((item, idx) => {
            if (newIndex === idx) {
              return {
                ...item,
                [key]: change,
              }
            }

            return item
          })

          return newInstanceUserAddress
        })(),
      )
    }
  }

  const renderSetDescF = (index, key, change) => {
    setUserDataF(() => {
      const newUserDataF = userDataF.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            [key]: change,
          }
        }

        return item
      })

      return newUserDataF
    })
  }

  const UserRender = ({ index, key, pm_value }) => {
    switch (key) {
      // A
      case "nickname":
        return (
          <BasicInput
            value={pm_value}
            onChange={e => setUserDataA({ ...userDataA, [key]: e.target.value })}
          ></BasicInput>
        )
      case "resetPassword":
        return <BasicButton onClick={e => resetPassword(pm_value)}>초기화</BasicButton>
      case "phone":
        return (
          <div>
            <div className={styles.descA_phone_input_wrapper}>
              <BasicInput
                className={styles.descA_phone_countrycode}
                value={pm_value.code}
                onChange={e => setUserDataA({ ...userDataA, [key]: { ...pm_value, code: e.target.value } })}
              ></BasicInput>
              <BasicInput
                className={styles.descA_phone_phoneNum}
                value={pm_value.value}
                onChange={e => setUserDataA({ ...userDataA, [key]: { ...pm_value, value: e.target.value } })}
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
                setUserDataA({ ...userDataA, [key]: { ...pm_value, opt_in: value } })
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
              onChange={e => setUserDataA({ ...userDataA, [key]: { ...pm_value, value: e.target.value } })}
            ></BasicInput>
            <BooleanRadioGroup
              option={"custom"}
              options={[
                { label: "수신 허용", value: true },
                { label: "수신 거부", value: false },
              ]}
              value={pm_value.opt_in}
              onChange={({ target: { value } }: RadioChangeEvent) =>
                setUserDataA({ ...userDataA, [key]: { ...pm_value, opt_in: value } })
              }
            ></BooleanRadioGroup>
          </div>
        )
      case "profile_image":
        return (
          <div className={styles.descA_image_wrapper}>
            {profile ? (
              <Image src={profileURL} alt={"profile"} preview={false} className={styles.descA_image_image}></Image>
            ) : (
              <Image src={pm_value} alt={"profile"} preview={false} className={styles.descA_image_image}></Image>
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
      case "teamID":
        return (
          <div className={styles.desc_manage_button_wrapper}>
            <BasicButton
              onClick={() => {
                router.push(`/team/${pm_value}`)
              }}
            >
              수정
            </BasicButton>
            <BasicButton
              onClick={() => {
                deleteTeam(pm_value)
              }}
            >
              탈퇴
            </BasicButton>
          </div>
        )
      // G
      case "last_login_at":
        return <div> {getDateText(pm_value)} </div>
      default:
        if (typeof pm_value === "object" && !Array.isArray(pm_value) && pm_value !== null)
          return <div>{JSON.stringify(pm_value)}</div>
        return <div>{pm_value}</div>
    }
  }

  //------------------------------------------------------------------------------------------------------
  // [UI]
  return (
    <PageFrameFooter titleKey={USERDETAIL} handler={{ saveHandler: saveHandler, cancelHandler: cancelHandler }}>
      <div className={styles.container}>
        <ObjectDescription
          descInfo={UserDesc.descA}
          descDetails={UserDescDetail}
          data={userDataA}
          render={UserRender}
        ></ObjectDescription>
        <Divider></Divider>
        <>
          <div className={styles.user_descB_title}>
            <h3>배송지 정보</h3>
            <BasicButton onClick={addAddress}>배송지 추가</BasicButton>
          </div>
          <TableDescription
            descInfo={UserDesc.descB}
            descDetails={UserDescDetail}
            data={[...editUserAddresses, ...instanceUserAddresses]}
            render={UserRender}
          ></TableDescription>
        </>
        <Divider></Divider>
        {/* <>
          <TableDescription
            descInfo={UserDesc.descC}
            descDetails={UserDescDetail}
            data={userDataC}
            render={userRender}
          ></TableDescription>
        </> */}
        <Divider></Divider>
        <BasicTable
          tableInfo={UserDesc.descD}
          tableDetails={UserDescDetail}
          dataSource={userDataD}
          render={UserRender}
          pagination={{ position: ["bottomCenter"] }}
        ></BasicTable>
        <Divider></Divider>
        <BasicTable
          tableInfo={UserDesc.descE}
          tableDetails={UserDescDetail}
          dataSource={userDataE}
          render={UserRender}
          pagination={{ position: ["bottomCenter"] }}
        ></BasicTable>
        <Divider></Divider>
        <BasicTable
          tableInfo={UserDesc.descF}
          tableDetails={UserDescDetail}
          dataSource={userDataF}
          render={UserRender}
          pagination={{ position: ["bottomCenter"] }}
        ></BasicTable>
        <Divider></Divider>
        <ObjectDescription
          descInfo={UserDesc.descG}
          descDetails={UserDescDetail}
          data={userDataG}
          render={UserRender}
        ></ObjectDescription>
        <Divider></Divider>
      </div>
    </PageFrameFooter>
  )
}

export default UserDetail
