import { NextPage } from "next"
import { Divider } from "antd"
import { apiManager, apiUtil } from "@/apis"
import { PageFrameFooter } from "@/components/layout"
import styles from "./shippingDetail.module.scss"
import { ShippingDescDetail, ShippingDesc, ShippingConditionInfoType } from "@/components/pages/shipping/shippingDesc"
import { ObjectDescription } from "@/components/Description"
import { SHIPDETAIL, shippingConditionInfoValues } from "@/const"
import { useRouter } from "next/router"
import { useAsyncEffect } from "@/hooks"
import { BasicButton, FileButton } from "@/components/Button"
import { useState } from "react"
import { BasicInput } from "@/components/Input"
import {
  ShippingStepSelection,
  ShippingPartProgressSelection,
  ShippingCircuitProgressSelection,
  ShippingMotionProgressSelection,
  ShippingShipProgressSelection,
  ShippingOrderStepSelection,
} from "@/components/Select"
import { API_ERROR_MSG } from "@/const/api.error.const"
import { ShippingInfoDto } from "@/apis/dto/order.dto"

//------------------------------------------------------------------------------------------------------
// [Main]
// const ShipDetail = ({
const ShipDetail: NextPage = () => {
  const router = useRouter()
  //-------------------------------------------------------------------------
  // [Datas]
  const [shippingID, setShippingID] = useState<number>(undefined)

  const [shippingInfo, setShippingInfo] = useState<ShippingInfoDto>(undefined)

  const [shippingConditionInfo, setShippingConditionInfo] = useState<ShippingConditionInfoType>(undefined)

  const [BOMFile, setBOMFile] = useState<File>(null)
  const [BOMFileURL, setBOMFileURL] = useState<string>(null)
  const [GerberFile, setGerberFile] = useState<File>(null)
  const [GerberFileURL, setGerberFileURL] = useState<string>(null)

  //-------------------------------------------------------------------------
  // [초기화]
  useAsyncEffect(async () => {
    if (!router.query.id) return

    //[set ShippingID]
    setShippingID(Number(router.query.id))

    // [set ShippingInfo]
    const shippingResponse = await apiManager.orderApi.getShippingInfo(Number(router.query.id).toString())
    if (apiUtil.isErrorResponse(shippingResponse)) {
      if (apiUtil.signChecker(shippingResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(shippingResponse.message)
      return
    }

    setShippingInfo(shippingResponse)

    setShippingConditionInfo({
      ...shippingConditionInfoValues[shippingResponse.order_step],
      part_company: shippingResponse.part_company,
      part_number: shippingResponse.part_number,
      shipping_company: shippingResponse.shipiing_company,
      shipping_number: shippingResponse.shipping_number,
    })
  }, [router.query.id])

  //-------------------------------------------------------------------------
  // [Handler]
  const handleBomFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]

    if (file) {
      setBOMFile(file)
      setBOMFileURL(URL.createObjectURL(file))
    }
  }

  const handleGerberFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]

    if (file) {
      setGerberFile(file)
      setGerberFileURL(URL.createObjectURL(file))
    }
  }

  // [footer Handler]
  const saveHandler = async () => {
    console.log("Save: Shipment")

    const shippingEdit = {
      bom_file: BOMFile,
      gerber_file: GerberFile,
      order_step: shippingInfo.order_step,
      part_number: shippingConditionInfo.part_number,
      part_company: shippingConditionInfo.part_company,
      shipping_number: shippingConditionInfo.shipping_number,
      shipping_company: shippingConditionInfo.shipping_company,
    }

    console.log("shippingEdit", shippingEdit)
    const shippingEditRes = await apiManager.orderApi.editShippingInfo(shippingID, shippingEdit)
    if (apiUtil.isErrorResponse(shippingEditRes)) {
      if (apiUtil.signChecker(shippingEditRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(shippingEditRes.message)
      return
    }

    router.push("/shipping")
  }

  const cancelHandler = () => {
    console.log("cancel: Shipment")
    router.push("/shipping")
  }
  //-------------------------------------------------------------------------
  // [Content Render]
  const ShipmentRender = ({ index, key, pm_value }) => {
    switch (key) {
      // desc A
      case "user_seq":
        return (
          <div className={styles.desc_move_button_wrapper}>
            <p>{shippingInfo.user_name}</p>
            <BasicButton
              className={styles.desc_move_button}
              onClick={() => {
                router.push(`/user/${pm_value}`)
              }}
            >
              이동
            </BasicButton>
          </div>
        )
      case "project_seq":
        return (
          <div className={styles.desc_move_button_wrapper}>
            <p>{shippingInfo.project_name}</p>
            <BasicButton
              className={styles.desc_move_button}
              onClick={() => {
                router.push(`/project/${pm_value}`)
              }}
            >
              이동
            </BasicButton>
          </div>
        )
      case "seq_no":
        return (
          <div className={styles.desc_move_button_wrapper}>
            <BasicButton
              className={styles.desc_move_button_full}
              onClick={() => {
                router.push(`/order/${pm_value}`)
              }}
            >
              주문 정보로 이동
            </BasicButton>
          </div>
        )
      // desc B
      case "bom_file":
        return (
          <div>
            {BOMFile ? (
              <a href={BOMFileURL} download={BOMFile.name}>
                {BOMFile.name}
              </a>
            ) : (
              <a href={pm_value} download>
                {pm_value.split("/").at(-1)}
              </a>
            )}
          </div>
        )
      case "BOMFile":
        return (
          <div>
            <FileButton handleFile={handleBomFile} className={styles.shipping_desc_file_btn}>
              파일 찾기
            </FileButton>
          </div>
        )
      case "gerber_file":
        return (
          <div>
            {GerberFile ? (
              <a href={GerberFileURL} download={GerberFile.name}>
                {GerberFile.name}
              </a>
            ) : (
              <a href={pm_value} download>
                {pm_value.split("/").at(-1)}
              </a>
            )}
          </div>
        )
      case "GerberFile":
        return (
          <div>
            <FileButton handleFile={handleGerberFile} className={styles.shipping_desc_file_btn}>
              파일 찾기
            </FileButton>
          </div>
        )
      // desc C
      case "partStep":
      case "circuitStep":
      case "motionStep":
      case "shippingStep":
        return (
          <div>
            <ShippingStepSelection disabled={true} value={pm_value}></ShippingStepSelection>
          </div>
        )
      case "partProgress":
        return (
          <div>
            <ShippingPartProgressSelection disabled={true} value={pm_value}></ShippingPartProgressSelection>
          </div>
        )
      case "circuitProgress":
        return (
          <div>
            <ShippingCircuitProgressSelection disabled={true} value={pm_value}></ShippingCircuitProgressSelection>
          </div>
        )

      case "motionProgress":
        return (
          <div>
            <ShippingMotionProgressSelection disabled={true} value={pm_value}></ShippingMotionProgressSelection>
          </div>
        )
      case "shippingProgress":
        return (
          <div>
            <ShippingShipProgressSelection disabled={true} value={pm_value}></ShippingShipProgressSelection>
          </div>
        )
      case "part_company":
        return (
          <div>
            <BasicInput
              disabled={shippingInfo.order_step < 2 || shippingInfo.order_step >= 5}
              placeholder="택배사"
              value={pm_value}
              className={styles.shipping_parcel_input}
              onChange={e => setShippingConditionInfo({ ...shippingConditionInfo, [key]: e.target.value })}
            ></BasicInput>
            <BasicInput
              disabled={shippingInfo.order_step < 2 || shippingInfo.order_step >= 5}
              placeholder="송장 번호"
              value={shippingConditionInfo.part_number}
              className={styles.shipping_parcel_input}
              onChange={e => setShippingConditionInfo({ ...shippingConditionInfo, part_number: e.target.value })}
            ></BasicInput>
          </div>
        )
      case "shipping_company":
        return (
          <div>
            <BasicInput
              disabled={shippingInfo.order_step < 11}
              placeholder="택배사"
              value={pm_value}
              className={styles.shipping_parcel_input}
              onChange={e => setShippingConditionInfo({ ...shippingConditionInfo, [key]: e.target.value })}
            ></BasicInput>
            <BasicInput
              disabled={shippingInfo.order_step < 11}
              placeholder="송장 번호"
              value={shippingConditionInfo.shipping_number}
              className={styles.shipping_parcel_input}
              onChange={e => setShippingConditionInfo({ ...shippingConditionInfo, shipping_number: e.target.value })}
            ></BasicInput>
          </div>
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
      titleKey={SHIPDETAIL}
      handler={{
        saveHandler: saveHandler,
        cancelHandler: cancelHandler,
      }}
    >
      <div className={styles.container}>
        <ObjectDescription
          descInfo={ShippingDesc.descA}
          descDetails={ShippingDescDetail}
          data={shippingInfo}
          render={ShipmentRender}
        ></ObjectDescription>
        <Divider></Divider>
        <ObjectDescription
          descInfo={ShippingDesc.descB}
          descDetails={ShippingDescDetail}
          data={shippingInfo}
          render={ShipmentRender}
        ></ObjectDescription>
        <Divider></Divider>
        <>
          <div className={styles.shipping_descC_title}>
            <h3>주문 및 배송 상태</h3>
            <ShippingOrderStepSelection
              value={shippingInfo ? shippingInfo.order_step : 0}
              onChange={change => {
                setShippingInfo({ ...shippingInfo, order_step: change })
                setShippingConditionInfo({ ...shippingConditionInfo, ...shippingConditionInfoValues[change] })
              }}
              className={styles.shipping_descC_title_orderStep}
            ></ShippingOrderStepSelection>
          </div>
          <>
            <ObjectDescription
              descInfo={ShippingDesc.descC_part}
              descDetails={ShippingDescDetail}
              data={shippingConditionInfo}
              render={ShipmentRender}
              className={styles.shipping_descC_descriptions}
            ></ObjectDescription>
            <ObjectDescription
              descInfo={ShippingDesc.descC_circuit}
              descDetails={ShippingDescDetail}
              data={shippingConditionInfo}
              render={ShipmentRender}
              className={styles.shipping_descC_descriptions}
            ></ObjectDescription>
            <ObjectDescription
              descInfo={ShippingDesc.descC_motion}
              descDetails={ShippingDescDetail}
              data={shippingConditionInfo}
              render={ShipmentRender}
              className={styles.shipping_descC_descriptions}
            ></ObjectDescription>
            <ObjectDescription
              descInfo={ShippingDesc.descC_shipping}
              descDetails={ShippingDescDetail}
              data={shippingConditionInfo}
              render={ShipmentRender}
              className={styles.shipping_descC_descriptions}
            ></ObjectDescription>
          </>
        </>
        <Divider></Divider>
      </div>
    </PageFrameFooter>
  )
}
//------------------------------------------------------------------------------------------------------

export default ShipDetail
