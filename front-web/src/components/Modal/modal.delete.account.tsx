import { Col, Row } from "antd"
import { BasicModal } from "./modal.basic"
import { BasicButton, buttonStyle } from "components/Button"
import modalStyles from "./modal.module.scss"
import { useInputs, useRedux } from "hooks"
import { setLoading, setModal } from "redux/reducers/config"
import { useRouter } from "next/router"
import { apiManager, apiUtil } from "apis"

export const DeleteAccountModal = () => {
  const router = useRouter()
  const modalDispatch = useRedux(setModal)
  const loadingDispatch = useRedux(setLoading)
  const passwordInput = useInputs({ value: "" })

  const deleteAccount = async () => {
    if (passwordInput.value === "") return
    loadingDispatch(true)
    const response = await apiManager.userApi.deleteAccount(passwordInput.value)
    if (apiUtil.isErrorResponse(response)) {
      loadingDispatch(false)
      alert(response.message)
      return
    }
    loadingDispatch(false)
    modalDispatch({ open: false })
    void router.push("/")
  }
  return (
    <BasicModal
      header="Delete Account"
      width={732}
      height={286}
      footer={
        <Row className={modalStyles.modal_button_wrapper}>
          <BasicButton onClick={() => modalDispatch({ open: false })}>Cancel</BasicButton>
          <BasicButton className={buttonStyle.delete_button} onClick={deleteAccount}>
            Delete
          </BasicButton>
        </Row>
      }
    >
      <Col className={modalStyles.basic_modal_container}>
        <Row className={modalStyles.modal_content_title}>Enter Your Password to confirm</Row>
        <Row className={modalStyles.modal_input_wrapper}>
          <input type="password" placeholder="" value={passwordInput.value} onChange={passwordInput.onChange} />
        </Row>
      </Col>
    </BasicModal>
  )
}
