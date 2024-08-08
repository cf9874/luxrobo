import { Col, List, Row, Space } from "antd"
import styles from "./order.module.scss"
import { LayoutMain } from "Layout"
import { useState } from "react"
import { BasicCheckBox } from "components/CheckBox"
import {
  CopyOutlined,
  GlobalOutlined,
  // HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons"
import { ColorCheckBox } from "components/CheckBox/checkbox.color"
import { LayoutBoardDto, OrderCompanyDto, PartBlockDto, ProjectDto } from "apis/dto"
// import { CompanyListDtoRes } from "apis/dto"
import { BasicDropdown } from "components/Dropdown"
import { BasicPopover } from "components/Popover"
import { Placement } from "type"
import { BasicButton, buttonStyle } from "components/Button"
// import { GetServerSideProps } from "next"
import { useAsyncEffect, useRedux } from "hooks"
import { setModal } from "redux/reducers/config"
import { CheckOrderModal } from "components/Modal"
import { apiManager, apiUtil } from "apis"
import Image from "next/image"
import { AddressDto } from "apis/dto/common.dto"
import { NumberUtil } from "utils"
import { mappingPartList } from "utils/calculatePartData.util"
import { useRouter } from "next/router"
import {
  fee,
  exchangeRate,
  deliveryPeriodValue,
  estimatedCommissionValue,
  orderAmountValue,
  deliveryAmountValue,
} from "@const/price.const"
import AuthHoc from "hoc/AuthHoc"
// import { BasicInput } from "components/Input"
// import { ColorCheckBox, ThemeCheckBox } from "@const/theme.const"

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   apiManager.updateContext(ctx)

//   const companyList = await apiManager.orderApi.getCompanyList()
//   const addressList = await apiManager.userApi.getAddress()
//   const layoutBoard = await apiManager.layoutApi.getBoard(Number(ctx.query.id))
//   const partList = await apiManager.partApi.init(Number(ctx.query.id))
//   const project = await apiManager.projectApi.getDetail(Number(ctx.query.id))

//   if (
//     apiUtil.isErrorResponse(companyList) ||
//     apiUtil.isErrorResponse(addressList) ||
//     apiUtil.isErrorResponse(layoutBoard) ||
//     apiUtil.isErrorResponse(partList) ||
//     apiUtil.isErrorResponse(project)
//   ) {
//     return {
//       props: {
//         companyList: [],
//         addressList: [],
//         layoutBoard: null,
//         partList: [],
//         errorMsg: "서버에서 오류가 발생했습니다.",
//       },
//     }
//   }

//   return {
//     props: { companyList, addressList, layoutBoard: layoutBoard, project, partList: partList, errorMsg: "" },
//   }
// }

// const OrderPage = ({ companyList }: { companyList: CompanyListDtoRes[] }) => {
const OrderPage = () =>
  //   {
  //   companyList,
  //   addressList,
  //   layoutBoard,
  //   partList,
  //   errorMsg,
  //   project,
  // }: {
  //   companyList: OrderCompanyDto[]
  //   addressList: AddressDto[]
  //   layoutBoard: LayoutBoardDto
  //   partList: PartBlockDto[]
  //   project: ProjectDto
  //   errorMsg: string
  // }
  {
    const { query } = useRouter()

    // console.log(id)

    const modalDispatch = useRedux(setModal)
    const [visibleBasicInfo, setVisibleBasicInfo] = useState(true)
    const [visibleDetailInfo, setVisibleDetailInfo] = useState(true)
    const [selectedAddressID, setSelectedAddressID] = useState<number>()

    const [count, setCount] = useState<number | "">(1)

    console.log(count)

    // check group (Basic information)
    const [boardType, setBoardType] = useState("Single pieces")
    const [thickness, setThickness] = useState("1.6")
    const [solderMask, setSolderMask] = useState("Green")
    const [silkscreen, setSilkscreen] = useState("White")

    // check group (PCB Parameters)
    const [surface, setSurface] = useState("HASL")
    const [processes, setProcesses] = useState("Tenting vias")
    const [finishedCopper, setFinishedCopper] = useState("1 oz")
    const [minHollSize, setMinHollSize] = useState("0.3mm↑")
    const [minTrackSpacing, setMinTrackSpacing] = useState("6/6mil↑")

    //order
    // const [orderInfo, setOrderInfo] = useState<CompanyListDtoRes>()
    const [orderInfo, setOrderInfo] = useState<OrderCompanyDto>()

    const [optionSMT, setOptionSMT] = useState(false)
    const [optionInspection, setOptionInspection] = useState(false)

    console.log(optionSMT, " : optionSMT", optionInspection, " : optionInspection")
    const [companyList, setCompanyList] = useState<OrderCompanyDto[]>([])
    const [addressList, setAddressList] = useState<AddressDto[]>([])
    const [layoutBoard, setLayoutBoard] = useState<LayoutBoardDto | null>(null)
    const [partList, setPartList] = useState<PartBlockDto[]>([])
    const [project, setProject] = useState<ProjectDto>()
    const [errorMsg, setErrorMsg] = useState("")

    useAsyncEffect(async () => {
      const id = query.id
      const companyList = await apiManager.orderApi.getCompanyList()
      const addressList = await apiManager.userApi.getAddress()
      const layoutBoard = await apiManager.layoutApi.getBoard(Number(id))
      const partList = await apiManager.partApi.init(Number(id))
      const project = await apiManager.projectApi.getDetail(Number(id))

      if (
        apiUtil.isErrorResponse(companyList) ||
        apiUtil.isErrorResponse(addressList) ||
        apiUtil.isErrorResponse(layoutBoard) ||
        apiUtil.isErrorResponse(partList) ||
        apiUtil.isErrorResponse(project)
      ) {
        setErrorMsg("서버에서 오류가 발생했습니다.")
        setCompanyList([])
        setAddressList([])
        setLayoutBoard(null)
        setPartList([])
        setProject(undefined)
        return
      } else {
        setCompanyList(companyList)
        setAddressList(addressList)
        setLayoutBoard(layoutBoard)
        setPartList(partList)
        setProject(project)
        setErrorMsg("")
      }
    }, [query.id])

    console.log({
      companyList,
      addressList,
      layoutBoard,
      partList,
      errorMsg,
      project,
    })
    const onCopy = async (msg = "") => {
      await window.navigator.clipboard.writeText(msg)
    }

    if (!layoutBoard?.shape) {
      return <></>
    }
    console.log(addressList)

    const address = addressList?.find(address =>
      selectedAddressID ? address.addressID === selectedAddressID : address.is_default,
    )

    // const partData = mappingPartList(partList)

    const totalPrice = NumberUtil.roundToDecimalPlaces(
      NumberUtil.roundToDecimalPlaces(mappingPartList(partList).totalPrice + fee, 3) * exchangeRate,
    )

    const { finalX, finalY } = NumberUtil.calculateLayoutXY(layoutBoard.shape)
    console.log(192192, finalX, finalY)
    const productionPrice = NumberUtil.roundToDecimalPlaces(
      NumberUtil.priceFormula(
        NumberUtil.getLayerFomular(count, orderInfo?.company_data?.price.four_layer),
        finalX,
        finalY,
        count,
      ),
    )

    const finalPrice = totalPrice + orderAmountValue + estimatedCommissionValue + deliveryAmountValue + productionPrice
    return (
      <LayoutMain>
        <Row justify={"space-evenly"}>
          <Col className={styles.main_container}>
            <Space className={styles.page_title_container} size={0}>
              <div
                style={{
                  marginTop: 9,
                }}
              >
                {/* <Image
                src={header.feature.header}
                className={styles.page_icon}
                width={40}
                height={40}
                alt="Part Select"
              /> */}
              </div>
              <h2 className={styles.title_text}>Order</h2>
            </Space>
            <Space className={styles.main_content} direction="vertical">
              <Col className={styles.order_parts_option_wrapper}>
                <Row justify={"space-between"}>
                  <Col className={styles.order_part_info_title}>Basic Information</Col>
                  <Col onClick={() => setVisibleBasicInfo(state => !state)} className={styles.collapse_button}>
                    {visibleBasicInfo ? "▲" : "▼"}
                  </Col>
                </Row>
                {visibleBasicInfo ? (
                  <Row>
                    <Space>
                      <Col className={styles.order_part_option_category_wrapper}>
                        <Row className={styles.order_part_option_category}>Board Type</Row>
                        <Row className={styles.order_part_option_category}>Thickness</Row>
                        <Row className={styles.order_part_option_category}>Solder Mask</Row>
                        <Row className={styles.order_part_option_category}>Silkscreen</Row>
                      </Col>
                      <Col>
                        <Row className={styles.order_part_option_lists}>
                          {optionBoardType.map(option => {
                            return (
                              <BasicCheckBox
                                key={option.value}
                                theme={{ controlInteractiveSize: 15, colorPrimary: "#45d6df", borderRadiusSM: 15 }}
                                onClick={() => setBoardType(option.value)}
                                checked={option.value === boardType}
                              >
                                {option.label}
                              </BasicCheckBox>
                            )
                          })}
                        </Row>
                        <Row className={styles.order_part_option_lists}>
                          {optionThickness.map(option => {
                            return (
                              <BasicCheckBox
                                key={option.value}
                                theme={{
                                  controlInteractiveSize: 15,
                                  colorPrimary: "#45d6df",
                                  borderRadiusSM: 15,
                                }}
                                onClick={() => setThickness(option.value)}
                                checked={option.value === thickness}
                              >
                                {option.label}
                              </BasicCheckBox>
                            )
                          })}
                        </Row>
                        <Row className={styles.order_part_option_lists}>
                          {optionSolderMask.map(option => {
                            return (
                              <ColorCheckBox
                                key={option.value}
                                theme={{
                                  controlInteractiveSize: 15,
                                  colorPrimary: "#45d6df",
                                  borderRadiusSM: 15,
                                }}
                                onClick={() => setSolderMask(option.value)}
                                checked={option.value === solderMask}
                                options={{ title: option.label, bgColor: option.bgColor }}
                              >
                                {option.label}
                              </ColorCheckBox>
                            )
                          })}
                        </Row>
                        <Row className={styles.order_part_option_lists}>
                          {optionSilkscreen.map(option => {
                            return (
                              <ColorCheckBox
                                key={option.value}
                                theme={{
                                  controlInteractiveSize: 15,
                                  colorPrimary: "#45d6df",
                                  borderRadiusSM: 15,
                                }}
                                onClick={() => setSilkscreen(option.value)}
                                checked={option.value === silkscreen}
                                options={{ title: option.label, bgColor: option.bgColor }}
                              >
                                {option.label}
                              </ColorCheckBox>
                            )
                          })}
                        </Row>
                      </Col>
                    </Space>
                  </Row>
                ) : null}
              </Col>
              <Col className={styles.order_parts_option_wrapper}>
                <Row justify={"space-between"}>
                  <Col className={styles.order_part_info_title}>PCB Parameters</Col>
                  <Col onClick={() => setVisibleDetailInfo(state => !state)} className={styles.collapse_button}>
                    {visibleDetailInfo ? "▲" : "▼"}
                  </Col>
                </Row>
                {visibleDetailInfo ? (
                  <Row>
                    <Space>
                      <Col className={styles.order_part_option_category_wrapper}>
                        <Row className={styles.order_part_option_category}>Surface Finish</Row>
                        <Row className={styles.order_part_option_category}>Via Process</Row>
                        <Row className={styles.order_part_option_category}>Finished copper</Row>
                        <Row className={styles.order_part_option_category}>Min Holl Size</Row>
                        <Row className={styles.order_part_option_category}>Min Track/Spacing</Row>
                      </Col>
                      <Col>
                        <Row className={styles.order_part_option_lists}>
                          {optionSurfaceFinish.map(option => {
                            return (
                              <BasicCheckBox
                                key={option.value}
                                theme={{
                                  controlInteractiveSize: 15,
                                  colorPrimary: "#45d6df",
                                  borderRadiusSM: 15,
                                }}
                                onClick={() => setSurface(option.value)}
                                checked={option.value === surface}
                              >
                                {option.label}
                              </BasicCheckBox>
                            )
                          })}
                        </Row>
                        <Row className={styles.order_part_option_lists}>
                          {optionProcess.map(option => {
                            return (
                              <BasicCheckBox
                                key={option.value}
                                theme={{
                                  controlInteractiveSize: 15,
                                  colorPrimary: "#45d6df",
                                  borderRadiusSM: 15,
                                }}
                                onClick={() => setProcesses(option.value)}
                                checked={option.value === processes}
                              >
                                {option.label}
                              </BasicCheckBox>
                            )
                          })}
                        </Row>
                        <Row className={styles.order_part_option_lists}>
                          {optionFinishedCopper.map(option => {
                            return (
                              <BasicCheckBox
                                key={option.value}
                                theme={{
                                  controlInteractiveSize: 15,
                                  colorPrimary: "#45d6df",
                                  borderRadiusSM: 15,
                                }}
                                onClick={() => setFinishedCopper(option.value)}
                                checked={option.value === finishedCopper}
                              >
                                {option.label}
                              </BasicCheckBox>
                            )
                          })}
                        </Row>
                        <Row className={styles.order_part_option_lists}>
                          {optionMinHollSize.map(option => {
                            return (
                              <BasicCheckBox
                                key={option.value}
                                theme={{
                                  controlInteractiveSize: 15,
                                  colorPrimary: "#45d6df",
                                  borderRadiusSM: 15,
                                }}
                                onClick={() => setMinHollSize(option.value)}
                                checked={option.value === minHollSize}
                              >
                                {option.label}
                              </BasicCheckBox>
                            )
                          })}
                        </Row>
                        <Row className={styles.order_part_option_lists}>
                          {optionMinTrackSpacing.map(option => {
                            return (
                              <BasicCheckBox
                                key={option.value}
                                theme={{
                                  controlInteractiveSize: 15,
                                  colorPrimary: "#45d6df",
                                  borderRadiusSM: 15,
                                }}
                                onClick={() => setMinTrackSpacing(option.value)}
                                checked={option.value === minTrackSpacing}
                              >
                                {option.label}
                              </BasicCheckBox>
                            )
                          })}
                        </Row>
                      </Col>
                    </Space>
                  </Row>
                ) : null}
              </Col>
              <Col>
                <List
                  dataSource={companyList}
                  className={styles.orders_list_container}
                  renderItem={company => (
                    <List.Item
                      className={orderInfo?.seq_no === company.seq_no ? styles.order_list_selected : styles.order_list}
                      onClick={() => {
                        console.log(company.company_data)

                        setOrderInfo(company)
                      }}
                    >
                      <Col className={styles.order_company}>
                        <Space className={styles.order_company_summary}>
                          <Col className={styles.order_nav_title}>발주처</Col>
                          <div style={{ marginLeft: "15px" }}>
                            <Image
                              unoptimized={true}
                              src={`${company.company_data?.image}`}
                              alt={`${company.seq_no}`}
                              width={120}
                              height={70}
                            />
                          </div>
                        </Space>
                        <Row className={styles.order_company_name}>{company.company_data?.name}</Row>
                      </Col>
                      <Col className={styles.order_company_info}>
                        <Row className={styles.order_nav_title}>발주처 정보</Row>
                        {/* <Row className={styles.order_company_info_wrapper}>
                        <Col className={styles.order_company_info_img}>＠</Col>
                        <Col className={styles.order_company_info_text}>{company.company_data.address}@</Col>
                      </Row> */}
                        <Row className={styles.order_company_info_wrapper}>
                          <Col className={styles.order_company_info_img}>＠</Col>
                          <Col className={styles.order_company_info_text}>{company.company_data?.number}</Col>
                        </Row>
                        <Row className={styles.order_company_info_wrapper}>
                          <Col className={styles.order_company_info_img}>＠</Col>
                          <Col className={styles.order_company_info_text}>{company.company_data?.["e-mail"]}</Col>
                        </Row>
                        <Row className={styles.order_company_info_wrapper}>
                          <Col className={styles.order_company_info_img}>＠</Col>
                          <Col className={styles.order_company_info_text}>{company.company_data?.webpage}</Col>
                        </Row>
                      </Col>
                      <Col className={styles.order_price}>
                        <Row className={styles.order_nav_title}>단가</Row>
                        {/* {company.price.map((item, index) => (
                        <Row key={index} className={styles.order_price_wrapper}>
                          <Col className={styles.order_price_count}>
                            {item.count}
                            {index === list.price.length - 1 ? "+" : null}
                          </Col>
                          <Col className={styles.order_price_text}>￦ {item.price.toLocaleString()}</Col>
                        </Row>
                      ))} */}
                        {company.company_data
                          ? Object.keys(company.company_data.price.four_layer).map((key, index, array) => {
                              const isLast = index === array.length - 1
                              return (
                                <Row key={index} className={styles.order_price_wrapper}>
                                  <Col className={styles.order_price_count}>
                                    {key.replace(/^over_/i, "")}
                                    {isLast ? "+" : null}
                                  </Col>
                                  <Col className={styles.order_price_text}>
                                    ￦{" "}
                                    {NumberUtil.roundToDecimalPlaces(
                                      NumberUtil.priceFormula(
                                        company.company_data?.price.four_layer[key],
                                        finalX,
                                        finalY,
                                        Number(isLast ? key.replace(/^over_/i, "") : key),
                                      ),
                                    ).toLocaleString()}
                                  </Col>
                                </Row>
                              )
                            })
                          : null}
                      </Col>
                      <Col className={styles.order_make_period}>
                        <Row className={styles.order_nav_title}>제작 기간</Row>
                        {company.company_data
                          ? Object.keys(company.company_data.date.four_layer).map((key, index, array) => {
                              const item = company.company_data?.date.four_layer[key]

                              return (
                                <Row key={index} className={styles.order_make_period_wrapper}>
                                  <Col className={styles.order_make_period_count}>
                                    {key.replace(/^over_/i, "")}
                                    {index === array.length - 1 ? "+" : null}
                                  </Col>
                                  <Col className={styles.order_make_period_text}>{item}일</Col>
                                </Row>
                              )
                            })
                          : null}
                      </Col>
                    </List.Item>
                  )}
                />
              </Col>
            </Space>
          </Col>
          <Col className={styles.order_info_container} span={5}>
            <Col className={styles.main}>
              <Row className={styles.order_info_title_container} align={"middle"}>
                <Space className={styles.order_part_info_title}>
                  {/* <Image
                  src={commonImage.cart}
                  width={32}
                  height={32}
                  style={{
                    // backgroundColor: "#1b3852",
                    padding: "5px",
                    borderRadius: 5,
                  }}
                  alt=""
                /> */}
                  <h2 className={styles.order_info_title}>주문 정보</h2>
                </Space>
              </Row>
              <Col className={styles.order_summary_content}>
                <Row className={styles.company_info} align={"middle"}>
                  <Col className={styles.company_title_wrapper}>
                    <Row justify={"space-between"} className={styles.company_title_box} align={"middle"}>
                      <Col className={styles.company_title}>발주처</Col>
                      <Col className={styles.company_title}>{orderInfo?.company_data?.name}</Col>
                    </Row>
                  </Col>
                  <Col className={styles.company_info_wrapper}>
                    {/* <Row
                    justify={"space-between"}
                    style={{
                      width: "100%",
                    }}
                  >
                    <Col>
                      <HomeOutlined />
                      <span className={styles.company_info_content}>{orderInfo?.companyInfo.adress}</span>
                    </Col>
                    <CopyOutlined onClick={() => onCopy(orderInfo?.company_data?.name)} />
                  </Row> */}
                    <Row
                      justify={"space-between"}
                      style={{
                        width: "100%",
                      }}
                    >
                      <Col>
                        <PhoneOutlined />

                        <span className={styles.company_info_content}>{orderInfo?.company_data?.number}</span>
                      </Col>
                      <CopyOutlined onClick={() => onCopy(orderInfo?.company_data?.number)} />
                    </Row>
                    <Row
                      justify={"space-between"}
                      style={{
                        width: "100%",
                      }}
                    >
                      <Col>
                        <MailOutlined />
                        <span className={styles.company_info_content}>{orderInfo?.company_data?.["e-mail"]}</span>
                      </Col>
                      <CopyOutlined onClick={() => onCopy(orderInfo?.company_data?.["e-mail"])} />
                    </Row>
                    <Row
                      justify={"space-between"}
                      style={{
                        width: "100%",
                      }}
                    >
                      <Col>
                        <GlobalOutlined />
                        <span className={styles.company_info_content}>{orderInfo?.company_data?.webpage}</span>
                      </Col>
                      <CopyOutlined onClick={() => onCopy(orderInfo?.company_data?.webpage)} />
                    </Row>
                  </Col>
                </Row>
                <Row className={styles.order_summary_count_info} justify={"space-between"} align={"middle"}>
                  <Col className={styles.order_summary_count}>수량</Col>
                  <Space className={styles.order_summary_count_control}>
                    <button
                      className={styles.order_summary_count_control_button}
                      onClick={() => setCount(c => (c ? Math.max(c - 1, 1) : 1))}
                    >
                      -
                    </button>
                    <input
                      className={styles.order_summary_count_control_input}
                      value={count}
                      onChange={e => (e.target.value ? setCount(Math.max(Number(e.target.value), 1)) : setCount(""))}
                      type="number"
                    />
                    <button
                      className={styles.order_summary_count_control_button}
                      onClick={() => setCount(c => (c ? c + 1 : 1))}
                    >
                      +
                    </button>
                  </Space>
                </Row>
                <Row className={styles.order_summary_additional_step}>
                  <Col>
                    <Row justify={"space-between"} align={"middle"}>
                      <Row>
                        <Col>SMT 여부</Col>
                        <Col
                          style={{
                            marginLeft: 10,
                          }}
                        >
                          <BasicPopover
                            width={264}
                            placement={Placement.left}
                            text="현재 금액은 최종 금액이 아니며, 회로도설계가 끝나면 최종금액이 정해집니다."
                          >
                            <QuestionCircleOutlined />
                          </BasicPopover>
                        </Col>
                      </Row>
                      <Col>
                        <BasicCheckBox onChange={() => setOptionSMT(state => !state)} className={styles.checkbox} />
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Row justify={"space-between"} align={"middle"}>
                      <Row>
                        <Col>동작 검사</Col>
                        <Col
                          style={{
                            marginLeft: 10,
                          }}
                        >
                          <BasicPopover
                            width={304}
                            placement={Placement.left}
                            text="수수료에는 회로 검수비용, 배송비가 포함됩니다."
                          >
                            <QuestionCircleOutlined />
                          </BasicPopover>
                        </Col>
                      </Row>
                      <BasicCheckBox
                        disabled={!optionSMT}
                        onChange={() => setOptionInspection(state => !state)}
                        className={styles.checkbox}
                      />
                    </Row>
                  </Col>
                </Row>
                <Row className={styles.order_summary_price}>
                  <Space direction="vertical" className={styles.order_summary_price_wrapper}>
                    <Row justify={"space-between"}>
                      <Col className={styles.order_summart_price_title}>제작 단가</Col>
                      <Col className={styles.order_summart_price_count}>{count}개</Col>
                      <Col className={styles.order_summart_price_detail}>￦ {productionPrice.toLocaleString()}</Col>
                    </Row>
                    <Row justify={"space-between"}>
                      <Col className={styles.order_summart_price_title}>제작 기간</Col>
                      <Col className={styles.order_summart_price_detail}>
                        {NumberUtil.getLayerFomular(count, orderInfo?.company_data?.date.four_layer)}일
                      </Col>
                    </Row>
                    <Row justify={"space-between"}>
                      <Col className={styles.order_summart_price_title}>배송 기간</Col>
                      <Col className={styles.order_summart_price_detail}>{deliveryPeriodValue}일</Col>
                    </Row>
                    <Row justify={"space-between"}>
                      <Col className={styles.order_summart_price_title}>부품 전체 금액(단가)</Col>
                      <Col className={styles.order_summart_price_detail}>{totalPrice.toLocaleString()}</Col>
                      {/* part단계 최종계산값 */}
                    </Row>
                    <Row justify={"space-between"}>
                      <Col className={styles.order_summart_price_title}>예상 수수료</Col>
                      <Col className={styles.order_summart_price_detail}>
                        ￦ {estimatedCommissionValue.toLocaleString()}
                      </Col>
                    </Row>
                    <Row justify={"space-between"}>
                      <Col className={styles.order_summart_price_title}>발주 금액</Col>
                      <Col className={styles.order_summart_price_detail}>￦ {orderAmountValue.toLocaleString()}</Col>
                    </Row>
                    <Row justify={"space-between"}>
                      <Col className={styles.order_summart_price_title}>배송 금액</Col>
                      <Col className={styles.order_summart_price_detail}>￦ {deliveryAmountValue.toLocaleString()}</Col>
                    </Row>

                    <div className={styles.divider} />
                    <Row justify={"space-between"}>
                      <Col className={styles.order_summart_price_title}>최종 금액</Col>
                      <Col className={styles.order_summart_price_result}>￦ {finalPrice.toLocaleString()}</Col>
                    </Row>
                  </Space>
                </Row>
                <Row className={styles.order_summary_address}>
                  <Space className={styles.order_summary_address_wrapper} direction="vertical">
                    <Row className={styles.order_summary_address_box} justify={"space-between"} align={"middle"}>
                      <Col className={styles.order_summary_address_name}>배송지</Col>

                      <BasicDropdown
                        // options={[{ label: "홍길동(우리집)", value: "홍길동(우리집)" }]}
                        options={addressList.map(address => ({
                          label: `${address.receiver}(${address.address_name})`,
                          value: address.addressID,
                        }))}
                        className={styles.order_summary_address_list_dropdown}
                        defaultValue={address?.addressID}
                        onChange={key => setSelectedAddressID(key as number)}
                      />
                    </Row>
                    <Row className={styles.order_summary_address_content_box}>
                      <Col className={styles.order_summary_address_content}>
                        {NumberUtil.formatPhoneNumber(address?.phone_number)}
                      </Col>
                      <Col className={styles.order_summary_address_content}>
                        {/* 서울특별시 구로구 이종무로 23 (영구동) 덱스투빌 3층 306호 (06265) */}
                        {address?.address_json_string}({address?.postal_code})
                      </Col>
                    </Row>
                  </Space>
                </Row>
                {/* <Row className={styles.order_summary_payment}>
                <Space className={styles.order_summary_payment_wrapper} direction="vertical">
                  <Row className={styles.order_summary_payment_box} justify={"space-between"} align={"middle"}>
                    <Col className={styles.order_summary_payment_name}>결제정보</Col>

                    <BasicDropdown
                      options={[{ label: "Team Card 1", value: "Team Card 1" }]}
                      className={styles.order_summary_payment_list_dropdown}
                      onChange={e => console.log(e)}
                    />
                  </Row>
                  <Row className={styles.order_summary_payment_content_box}>
                    <Col className={styles.order_summary_payment_content}>Master Card</Col>
                    <Col className={styles.order_summary_payment_content}>**** **** **** 1720 | 12/28</Col>
                  </Row>
                </Space>
              </Row> */}
                {/* <Row className={styles.order_summary_title_box}>
                <Col className={styles.order_summary_title}>발주처</Col>
                <Col className={styles.order_summary_title}>(주)한샘디지텍</Col>
              </Row>
            
              <Row className={styles.order_summary_count_info} align={"middle"} justify={"space-between"}>
                <Col className={styles.order_summary_count}>수량</Col>
                <Space className={styles.order_summary_count_control}>
                  <Button className={styles.order_summary_count_control_button}>-</Button>
                  <Input className={styles.order_summary_count_control_input} />
                  <Button className={styles.order_summary_count_control_button}>+</Button>
                </Space>
              </Row>
              <Row className={styles.order_summary_SMT} align={"middle"}>
                <Row justify={"space-between"} className={styles.order_summary_wrapper}>
                  <Space>
                    <Col className={styles.order_summary_SMT_title}>SMT 여부</Col>
                    <Col>
                      <QuestionCircleOutlined onClick={() => console.log(123)} />
                    </Col>
                  </Space>
                  <BasicCheckBox
                    theme={
                      //ThemeCheckBox
                      {
                        controlInteractiveSize: 20,
                        colorPrimary: "#45d6df",
                      }
                    }
                    style={{
                      border: "none",
                    }}
                  />
                </Row>
                <Row justify={"space-between"} className={styles.order_summary_wrapper}>
                  <Space>
                    <Col className={styles.order_summary_SMT_title}>동작검사</Col>
                    <Col>
                      <QuestionCircleOutlined onClick={() => console.log(123)} />
                    </Col>
                  </Space>
                  <BasicCheckBox
                    theme={
                      //ThemeCheckBox
                      {
                        controlInteractiveSize: 20,
                        colorPrimary: "#45d6df",
                      }
                    }
                    style={{
                      border: "none",
                    }}
                  />
                </Row>
              </Row>
              <Row>
                <Col className={styles.order_summay_make_detail}>
                  <Row justify={"space-between"}>
                    <Col className={styles.detail_text}>제작 단가</Col>
                    <Col className={styles.detail_text}>{"-"}개</Col>
                    <Col className={styles.detail_count}>￦ {0}</Col>
                  </Row>
                  <Row justify={"space-between"}>
                    <Col className={styles.detail_text}>제작 기간</Col>
                    <Col className={styles.detail_count}>{"-"}일</Col>
                  </Row>
                  <Row justify={"space-between"}>
                    <Col className={styles.detail_text}>배송 기간</Col>
                    <Col className={styles.detail_count}>{"-"}일</Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col className={styles.order_summay_part_detail}>
                  <Row justify={"space-between"}>
                    <Col className={styles.detail_text}> 부품 전체 금액(단가)</Col>
                    <Col className={styles.detail_count}>￦ 0</Col>
                  </Row>
                  <Row justify={"space-between"}>
                    <Col className={styles.detail_text}>예상 수수료</Col>
                    <Col className={styles.detail_count}>￦ 0</Col>
                  </Row>
                  <Row justify={"space-between"}>
                    <Col className={styles.detail_text}>발주 금액</Col>
                    <Col className={styles.detail_count}>￦ 0</Col>
                  </Row>
                  <Row justify={"space-between"}>
                    <Col className={styles.detail_text}>최종 금액</Col>
                    <Col className={styles.detail_count}>￦ 0</Col>
                  </Row>
                </Col>
              </Row> */}
              </Col>
            </Col>
            <Row className={styles.next_button}>
              <BasicButton
                className={buttonStyle.next_button}
                onClick={() => {
                  if (!address) {
                    alert("배송지를 선택해주세요.")
                    return
                  }

                  if (count === "") {
                    alert("수량을 재 확인 해주세요.")
                    return
                  } else if (!orderInfo) {
                    alert("발주처를 선택해주세요.")
                    return
                  }

                  const option = {
                    boardType,
                    thickness,
                    solderMask,
                    silkscreen,
                    surface,
                    processes,
                    finishedCopper,
                    minHollSize,
                    minTrackSpacing,
                  }

                  for (const key in option) {
                    if (
                      Object.prototype.hasOwnProperty.call(option, key) &&
                      option[key as keyof typeof option] === ""
                    ) {
                      alert("선택하지않은 옵션이 있습니다.")
                      return
                    }
                  }

                  modalDispatch({
                    open: true,
                    children: (
                      <CheckOrderModal
                        address={address}
                        productionPrice={productionPrice}
                        deliveryAmountValue={deliveryAmountValue}
                        estimatedCommissionValue={estimatedCommissionValue}
                        finalPrice={finalPrice}
                        orderAmountValue={orderAmountValue}
                        partPrice={totalPrice}
                        projectId={Number(query.id)}
                        companyId={orderInfo.company_id}
                        optionInspection={optionInspection}
                        optionSmt={optionSMT}
                        amount={count}
                        projectTitle={project?.title ?? ""}
                        option={option}
                      />
                    ),
                  })
                }}
              >
                Order
              </BasicButton>
            </Row>
          </Col>
        </Row>
      </LayoutMain>
    )
  }

export default AuthHoc(OrderPage)

const optionBoardType = [
  {
    label: "Single pieces",
    value: "Single pieces",
  },
  {
    label: "Panel by Customer",
    value: "Panel by Customer",
  },
  {
    label: "Panel by ***",
    value: "Panel by ***",
  },
]

const optionThickness = [
  { label: "0.6", value: "0.6" },
  { label: "0.8", value: "0.8" },
  { label: "1.0", value: "1.0" },
  { label: "1.6", value: "1.6" },
  { label: "2.0", value: "2.0" },
  { label: "2.4", value: "2.4" },
  { label: "3.0", value: "3.0" },
]

const optionSolderMask = [
  { label: "Green", value: "Green", bgColor: "#00ca13" },
  { label: "Red", value: "Red", bgColor: "#e00e00" },
  { label: "Yellow", value: "Yellow", bgColor: "#ffc700" },
  { label: "BLue", value: "BLue", bgColor: "#0038ff" },
  { label: "White", value: "White", bgColor: "#ffffff" },
  { label: "Black", value: "Black", bgColor: "#000000" },
  { label: "Matt Black", value: "MattBlack", bgColor: "#222222" },
]

const optionSilkscreen = [
  { label: "White", value: "White", bgColor: "#ffffff" },
  { label: "Black", value: "Black", bgColor: "#000000" },
]

const optionSurfaceFinish = [
  { label: "HASL", value: "HASL" },
  { label: "Lead free HASL", value: "Lead free HASL" },
  { label: "ENIG", value: "ENIG" },
  { label: "OSP", value: "OSP" },
]

const optionProcess = [
  { label: "Tenting vias", value: "Tenting vias" },
  { label: "Vias not covered", value: "Vias not covered" },
  { label: "Plugged vias with solder mask", value: "Plugged vias with solder mask" },
  { label: "Plugged vias with resin", value: "Plugged vias with resin" },
]

const optionFinishedCopper = [
  { label: "1 oz", value: "1 oz" },
  { label: "2 oz", value: "2 oz" },
]

const optionMinHollSize = [
  { label: "0.15mm", value: "0.15mm" },
  { label: "0.2mm", value: "0.2mm" },
  { label: "0.25mm", value: "0.25mm" },
  { label: "0.3mm↑", value: "0.3mm↑" },
  { label: "0.8mm↑", value: "0.8mm↑" },
  { label: "1mm↑", value: "1mm↑" },
]

const optionMinTrackSpacing = [
  { label: "3/3mil", value: "3/3mil" },
  { label: "4/4mil", value: "4/4mil" },
  { label: "5/5mil", value: "5/5mil" },
  { label: "6/6mil↑", value: "6/6mil↑" },
  { label: "8/8mil↑", value: "8/8mil↑" },
  { label: "10/10mil↑", value: "10/10mil↑" },
]
