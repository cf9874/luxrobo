import { PageFrameFooter } from "@/components/layout"
import { USERNEW } from "@/const"
import { useState } from "react"
import { useRouter } from "next/router"
import {
  UserNewDesc,
  UserNewDescAType,
  UserNewDescBType,
  UserNewDescDetail,
  UserNewNUllDataA,
  UserNewNullDataB,
} from "@/components/pages/user/newDesc"
import { BasicInput } from "@/components/Input"
import { BasicButton, FileButton } from "@/components/Button"
import { BooleanRadioGroup } from "@/components/Radio"
import { Divider, Image, RadioChangeEvent } from "antd"
import styles from "./userNew.module.scss"
import { useAsyncEffect } from "@/hooks"
import { apiManager, apiUtil } from "@/apis"
import { ObjectDescription } from "@/components/Description/description.object"
import { TableDescription } from "@/components/Description/description.table"
import { API_ERROR_MSG } from "@/const/api.error.const"
import { NextPage } from "next"

//------------------------------------------------------------------------------------------------------
// [Main]
export const NewUserPage: NextPage = () => {
  const router = useRouter()
  //-------------------------------------------------------------------------
  // [Datas]
  // (A)
  const [userDataA, setUserDataA] = useState<UserNewDescAType>(UserNewNUllDataA)

  // (B)
  // DB 데이터 - detail 페이지에서 useState로 (신규 페이지에서는 [], logic만 구현)
  const editUserAddress = [] as UserNewDescBType[]
  // 추가 데이터
  const [instanceUserAddresses, setInstanceUserAddresses] = useState<UserNewDescBType[]>([] as UserNewDescBType[])

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
    setInstanceUserAddresses([...instanceUserAddresses, UserNewNullDataB])
  }

  const deleteAddress = index => {
    const editLength = editUserAddress.length
    //console.log(index < editLength)
    // true : edit(기존 Address), false : instance(임시 Address)

    if (index < editLength) {
      // 신규페이지 작동 x
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

  // footer handler
  const saveHandler = async () => {
    console.log("Save: UserNew")
    //-1. 추가
    const userNew = {
      accountID: userDataA.accountID,
      username: userDataA.username,
      nickname: userDataA.nickname,
      email: userDataA.email.value,
      password: userDataA.password,
      countrycode: userDataA.phone.code,
      phone_number: userDataA.phone.value,
      email_opt_in: userDataA.phone.opt_in,
      phone_opt_in: userDataA.email.opt_in,
      profile_image: profile,
    }
    console.log("userNew", userNew)

    const userNewRes = await apiManager.userApi.createNewUser(userNew)
    if (apiUtil.isErrorResponse(userNewRes)) {
      if (apiUtil.signChecker(userNewRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(userNewRes.message)
      return
    }

    const userID = userNewRes.userID
    console.log(userID)

    //-2. 주소 추가
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

    router.push("/user")
  }

  const cancelHandler = () => {
    console.log("Cancel: UserNew")
    router.push("/user")
  }

  //-------------------------------------------------------------------------
  // [Content Render]
  const renderSetDescB = (index, key, change) => {
    //-------------------------------------------------------------------------
    const editLength = editUserAddress.length
    if (index < editLength) {
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

  const userRender = ({ index, key, pm_value }) => {
    switch (key) {
      // A
      case "accountID":
      case "username":
      case "nickname":
      case "password":
        return (
          <BasicInput
            value={pm_value}
            onChange={e => setUserDataA({ ...userDataA, [key]: e.target.value })}
          ></BasicInput>
        )
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
      default:
        if (typeof pm_value === "object" && !Array.isArray(pm_value) && pm_value !== null)
          return <div>{JSON.stringify(pm_value)}</div>
        return <div>{pm_value}</div>
    }
  }

  //-------------------------------------------------------------------------
  // [UI 출력]
  return (
    <PageFrameFooter
      titleKey={USERNEW}
      handler={{
        saveHandler: saveHandler,
        cancelHandler: cancelHandler,
      }}
    >
      <div className={styles.container}>
        <>
          <ObjectDescription
            descInfo={UserNewDesc.descA}
            descDetails={UserNewDescDetail}
            data={userDataA}
            render={userRender}
          ></ObjectDescription>
        </>
        <Divider></Divider>
        <>
          <div className={styles.new_user_descB_title}>
            <h3>배송지 정보</h3>
            <BasicButton onClick={addAddress}>배송지 추가</BasicButton>
          </div>
          <TableDescription
            descInfo={UserNewDesc.descB}
            descDetails={UserNewDescDetail}
            data={[...editUserAddress, ...instanceUserAddresses]}
            render={userRender}
          ></TableDescription>
        </>
        <Divider></Divider>
      </div>
    </PageFrameFooter>
  )
}
export default NewUserPage
