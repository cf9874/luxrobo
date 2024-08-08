import { Col, ConfigProvider, Radio, Row, Space } from "antd"
import styles from "./tab.module.scss"
import { HomeOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { BasicButton } from "components/Button"
import { DeleteAddressModal } from "components/Modal"
import { useState } from "react"
import { setModal } from "redux/reducers/config"
import { useInputs, useRedux } from "hooks"
import produce from "immer"
import { AddressDto } from "apis/dto/common.dto"
import { apiManager, apiUtil } from "apis"
import { plainToInstance } from "class-transformer"
import { createFormData } from "utils"

export const PersonalAddressTab = ({
  addressList,
  createApi,
  editApi,
  removeApi,
}: {
  addressList: AddressDto[]
  createApi: typeof apiManager.userApi.createAddress
  editApi: typeof apiManager.userApi.editAddress
  removeApi: typeof apiManager.userApi.removeAddress
}) => {
  const modalDispatch = useRedux(setModal)

  const [openAddAddress, setOpenAddAddress] = useState(false)
  const [openEditAddress, setOpenEditAddress] = useState<{ [addressId in number]: boolean }>(
    addressList.reduce(
      (acc, address) => {
        acc[address.addressID] = false
        return acc
      },
      {} as { [addressId in number]: boolean },
    ),
  )

  const [addressListState, setaddressListState] = useState(addressList)

  const onRemove = async (id: number) => {
    const response = await removeApi(id)

    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      return
    }

    setaddressListState(list => list.filter(address => address.addressID !== id))
    modalDispatch({ open: false })
  }

  const onCreate = async (addressDto: Omit<AddressDto, "toJson">) => {
    const response = await createApi(createFormData(addressDto))

    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      return
    }

    setaddressListState(prev => [
      ...prev,
      plainToInstance(AddressDto, { ...addressDto, addressID: response.data.addressID }).toJson(),
    ])
  }
  const onEdit = async (addressDto: Omit<AddressDto, "toJson">) => {
    const response = await editApi(createFormData(addressDto))

    if (apiUtil.isErrorResponse(response)) {
      alert(response.message)
      return
    }

    setaddressListState(list => {
      return produce(list, draftList => {
        const index = draftList.findIndex(item => item.addressID === response.data.addressID)

        if (index !== -1) {
          draftList[index] = plainToInstance(AddressDto, { ...addressDto, addressID: response.data.addressID }).toJson()
        }
      })
    })
  }

  return (
    <Col>
      <Row className={styles.setting_title}>Shipping Address</Row>
      <Space direction="vertical" size={20} className={styles.address_list}>
        {addressListState.map((item, index) => {
          console.log(item)

          return openEditAddress[item.addressID] ? (
            <AddressInputBox
              setShow={(isShow: boolean) => setOpenEditAddress(prev => ({ ...prev, [item.addressID]: isShow }))}
              onSave={onEdit}
              addressID={item.addressID}
              defaultValue={item}
            />
          ) : (
            <Row key={index} className={styles.address_container}>
              <Space
                className={styles.address_item}
                style={{
                  justifyContent: "space-between",
                }}
              >
                <Space direction="vertical" size={0}>
                  <Row align={"middle"}>
                    <Col className={styles.address_username}>
                      <HomeOutlined className={styles.address_home_icon} />
                      {item.receiver} ({item.address_name})
                    </Col>
                    <Col className={styles.address_user_number}>{item.phone_number}</Col>
                  </Row>
                  <Row>
                    <Col className={styles.address_address}>
                      {item.address_json_string} ({item.postal_code})
                    </Col>
                  </Row>
                </Space>

                <Row className={styles.delete_icon} align={"top"}>
                  <BasicButton
                    onClick={() => {
                      setOpenEditAddress(prev => ({ ...prev, [item.addressID]: true }))
                    }}
                    className={styles.edit_button}
                    style={{ marginRight: "10px", marginTop: "10px" }}
                  >
                    <EditOutlined />
                    Edit
                  </BasicButton>
                  <DeleteOutlined
                    onClick={() =>
                      modalDispatch({
                        open: true,
                        children: (
                          <DeleteAddressModal
                            address={item}
                            onApply={async () => {
                              await onRemove(item.addressID)
                            }}
                          />
                        ),
                      })
                    }
                  />
                </Row>
              </Space>
            </Row>
          )
        })}
        {!openAddAddress ? (
          <BasicButton
            className={styles.add_address_button}
            onClick={() => {
              setOpenAddAddress(true)

              console.log("add address")
            }}
          >
            <PlusOutlined /> Add Address
          </BasicButton>
        ) : (
          <AddressInputBox setShow={setOpenAddAddress} onSave={onCreate} />
        )}
      </Space>
    </Col>
  )
}

const AddressInputBox = ({
  setShow,
  onSave,
  addressID,
  defaultValue,
}: {
  setShow: (isShow: boolean) => void
  onSave: (addressDto: Omit<AddressDto, "toJson">) => Promise<void>
  addressID?: number
  defaultValue?: AddressDto
}) => {
  const [defaultAddress, setDefaultAddress] = useState(Boolean(defaultValue?.is_default))

  const parts = defaultValue?.address_json_string.split(/\s|\(|\)/).filter(Boolean)

  const nameInput = useInputs({ value: defaultValue?.address_name ?? "" })
  const receiverInput = useInputs({ value: defaultValue?.receiver ?? "" })
  const phoneInput = useInputs({ value: defaultValue?.phone_number ?? "" })
  const adressInput = useInputs({ value: parts?.[1] ?? "" })
  const postalCodeInput = useInputs({ value: defaultValue?.postal_code ? `${defaultValue?.postal_code}` : "" })
  const adressDetailInput = useInputs({ value: parts?.[0] ?? "" })

  return (
    <Col className={styles.new_address}>
      <Row className={styles.address_title}>New Address</Row>
      <Space direction="vertical" className={styles.add_address_input_container} size={0}>
        <Col className={styles.add_address_input_wrapper}>
          <Col className={styles.add_address_input_label}>배송지명</Col>
          <input
            placeholder="예) 집,회사"
            className={styles.add_address_input}
            value={nameInput.value}
            onChange={nameInput.onChange}
          />
        </Col>
        <Col className={styles.add_address_input_wrapper}>
          <Col className={styles.add_address_input_label}>수령인</Col>
          <input
            placeholder="이름"
            className={styles.add_address_input}
            value={receiverInput.value}
            onChange={receiverInput.onChange}
          />
        </Col>
        <Col className={styles.add_address_input_wrapper}>
          <Col className={styles.add_address_input_label}>전화번호</Col>
          <input
            placeholder="연락처"
            className={styles.add_address_input}
            value={phoneInput.value}
            onChange={phoneInput.onChange}
          />
        </Col>
        <Col className={styles.add_address_input_wrapper}>
          <Col className={styles.add_address_input_label}>배송지</Col>
          <input
            placeholder="주소"
            className={styles.add_address_input}
            value={adressInput.value}
            onChange={adressInput.onChange}
          />
          <input
            placeholder="우편번호"
            className={styles.add_address_input}
            value={postalCodeInput.value}
            onChange={postalCodeInput.onChange}
          />
          <input
            placeholder="상세주소 입력"
            className={styles.add_address_input}
            value={adressDetailInput.value}
            onChange={adressDetailInput.onChange}
          />
        </Col>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#45d6df",
            },
          }}
        >
          <Radio
            checked={defaultAddress}
            onClick={() => {
              setDefaultAddress(state => !state)
            }}
          >
            기본 배송지로 설정
          </Radio>
        </ConfigProvider>
        {/* <input
                    type="radio"
                    checked={defaultAddress}
                    className={styles.set_default_address}
                    onClick={() => {
                      setDefaultAddress(state => !state)
                    }}
                  /> */}
      </Space>
      <Row className={styles.address_button_wrapper}>
        <BasicButton
          className={styles.add_address_cancel_button}
          onClick={() => {
            setShow(false)
          }}
        >
          Cancel
        </BasicButton>
        <BasicButton
          className={styles.add_address_save_button}
          onClick={async () => {
            await onSave({
              address_json_string: `${adressDetailInput.value} (${adressInput.value})`,
              address_name: nameInput.value,
              addressID: addressID ?? 0,
              is_default: defaultAddress,
              phone_number: phoneInput.value,
              postal_code: Number(postalCodeInput.value),
              receiver: receiverInput.value,
            })

            setShow(false)
          }}
        >
          Save
        </BasicButton>
      </Row>
    </Col>
  )
}
