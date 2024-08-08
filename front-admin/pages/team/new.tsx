import { apiManager, apiUtil } from "@/apis"
import { BasicButton, FileButton } from "@/components/Button"
import { BasicInput } from "@/components/Input"
import { BooleanRadioGroup } from "@/components/Radio"
import { PageFrameFooter } from "@/components/layout"
import {
  TeamNewDesc,
  TeamNewDescAType,
  TeamNewDescBType,
  TeamNewDescDetail,
  TeamNewNullDataA,
  TeamNewNullDataB,
} from "@/components/pages/team/newDesc"
import { TEAMNEW } from "@/const"
import { Divider, Image, RadioChangeEvent } from "antd"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import styles from "./teamNew.module.scss"
import { ObjectDescription, TableDescription } from "@/components/Description"
import { useAsyncEffect } from "@/hooks"
import { API_ERROR_MSG } from "@/const/api.error.const"

//------------------------------------------------------------------------------------------------------
// [Main]
export const NewTeamPage: NextPage = () => {
  const router = useRouter()
  //-------------------------------------------------------------------------
  // [Datas]
  // (A)
  const [teamDataA, setTeamDataA] = useState<TeamNewDescAType>(TeamNewNullDataA)

  // (B)
  // DB 데이터 - detail 페이지에서 useState로 (신규 페이지에서는 [], logic만 구현)
  const editTeamAddress = [] as TeamNewDescBType[]
  // 추가 데이터
  const [instanceTeamAddresses, setInstanceTeamAddresses] = useState<TeamNewDescBType[]>([] as TeamNewDescBType[])

  // (profile_image)
  const [profile, setProfile] = useState<File>(null)
  const [profileURL, setProfileURL] = useState<string>(null)
  //-------------------------------------------------------------------------
  // 초기화
  useAsyncEffect(async () => {}, [])

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
    setInstanceTeamAddresses([...instanceTeamAddresses, TeamNewNullDataB])
  }

  const deleteAddress = index => {
    const editLength = editTeamAddress.length
    //console.log(index < editLength)
    // true : edit(기존 Address), false : instance(임시 Address)

    if (index < editLength) {
      // 신규페이지 작동 x
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

  // [footer Handler]
  const saveHandler = async () => {
    console.log("Save: NewTeam")

    //-1. 신규 등록
    const teamNew = {
      profile_image: profile,
      team_name: teamDataA.team_name,
      email: teamDataA.email.value,
      countrycode: teamDataA.phone.code,
      phone_number: teamDataA.phone.value,
      email_opt_in: teamDataA.email.opt_in,
      phone_opt_in: teamDataA.phone.opt_in,
    }
    console.log("teamNew", teamNew)

    const teamNewRes = await apiManager.teamApi.createNewTeam(teamNew)
    if (apiUtil.isErrorResponse(teamNewRes)) {
      if (apiUtil.signChecker(teamNewRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(teamNewRes.message)
      return
    }

    const teamID = teamNewRes.teamID
    console.log(teamID)

    //-2. 주소 추가
    for (const item of instanceTeamAddresses) {
      const addressNew = {
        address_name: item.address_name,
        receiver: item.receiver,
        phone_number: item.phone_number,
        address_json_string: `${item.detailAddress}(${item.address})`,
        postal_code: item.postal_code,
        is_default: false,
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

    router.push("/team")
  }

  const cancelHandler = () => {
    console.log("Cancel: NewTeam")

    router.push("/team")
  }

  //-------------------------------------------------------------------------
  const renderSetDescB = (index, key, change) => {
    const editLength = editTeamAddress.length
    if (index < editLength) {
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
              <Image src={profileURL} alt={"profile"} preview={false} className={styles.descA_image_image}></Image>
            ) : (
              <></>
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
      //
      default:
        if (typeof pm_value === "object" && !Array.isArray(pm_value) && pm_value !== null)
          return <div>{JSON.stringify(pm_value)}</div>
        return <div>{pm_value}</div>
    }
  }
  //-------------------------------------------------------------------------
  // [UI]
  return (
    <PageFrameFooter titleKey={TEAMNEW} handler={{ saveHandler: saveHandler, cancelHandler: cancelHandler }}>
      <div className={styles.container}>
        <ObjectDescription
          descInfo={TeamNewDesc.descA}
          descDetails={TeamNewDescDetail}
          data={teamDataA}
          render={teamRender}
        ></ObjectDescription>
        <Divider></Divider>
        <>
          <div className={styles.new_team_descB_title}>
            <h3>배송지 정보</h3>
            <BasicButton onClick={addAddress}>배송지 추가</BasicButton>
          </div>
          <TableDescription
            descInfo={TeamNewDesc.descB}
            descDetails={TeamNewDescDetail}
            data={[...editTeamAddress, ...instanceTeamAddresses]}
            render={teamRender}
          ></TableDescription>
        </>
        <Divider></Divider>
      </div>
    </PageFrameFooter>
  )
}

export default NewTeamPage
