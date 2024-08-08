import { useInputs } from "@/hooks"
import { Modal } from "antd"
import { useState } from "react"
import styles from "./accountModal.module.scss"
import { BasicButton } from "../Button"
import { BasicInput, PasswordInput } from "../Input"
import { AccountNewIndexType } from "../pages/account/indexDesc"

const InputField = ({ label, name, value, onChange, option }) => (
  <div className={styles.inputField}>
    <span className={styles.inputLabel}>{label}: </span>
    {option === "password" ? (
      <PasswordInput className={styles.input} name={name} onChange={onChange} value={value} />
    ) : (
      <BasicInput className={styles.input} name={name} onChange={onChange} value={value} />
    )}
  </div>
)

export const AccountNewModal = ({
  id,
  accountList,
  setAccountList,
}: {
  id: number
  accountList: AccountNewIndexType[]
  setAccountList: React.Dispatch<React.SetStateAction<AccountNewIndexType[]>>
}) => {
  //
  const [isModalOpen, setIsModalOpen] = useState(false)

  //
  const newKey = id
  const newAccountID = useInputs({ value: "" })
  const newUserName = useInputs({ value: "" })
  const newPassword = useInputs({ value: "" })
  const newConfirmPassword = useInputs({ value: "" })

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    newAccountID.onClear()
    newUserName.onClear()
    newPassword.onClear()
    newConfirmPassword.onClear()
    setIsModalOpen(false)
  }

  const saveHandler = async () => {
    if (newPassword.value !== newConfirmPassword.value) {
      alert("Password와 ConfirmPassword가 일치하지 않습니다.")
      return
    }

    const newAccountItem = {
      key: newKey,
      adminID: newKey,
      accountID: newAccountID.value,
      user_name: newUserName.value,
      password: newPassword.value,
      authID: null,
      auth_name: "none",
    } as AccountNewIndexType

    console.log("newAccountItem", newAccountItem)
    setAccountList([...accountList, newAccountItem])

    newAccountID.onClear()
    newUserName.onClear()
    newPassword.onClear()
    newConfirmPassword.onClear()
    setIsModalOpen(false)
  }

  return (
    <>
      <BasicButton className={styles.openBtn} onClick={showModal}>
        신규 계정 추가
      </BasicButton>
      <Modal
        open={isModalOpen}
        title={<h3 className={styles.modalTitle}>신규 계정 추가</h3>}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={_ => (
          <>
            <div className={styles.modalContainer}>
              <div className={styles.inputContainer}>
                <InputField
                  label="ID"
                  name="accountID"
                  value={newAccountID.value}
                  onChange={newAccountID.onChange}
                  option={""}
                />
                <InputField
                  label="Username"
                  name="user_name"
                  value={newUserName.value}
                  onChange={newUserName.onChange}
                  option={""}
                />
                <InputField
                  label="Password"
                  name="password"
                  value={newPassword.value}
                  onChange={newPassword.onChange}
                  option={"password"}
                />
                <InputField
                  label="Confirm Password"
                  name="confirm_password"
                  value={newConfirmPassword.value}
                  onChange={newConfirmPassword.onChange}
                  option={"password"}
                />
              </div>

              <div className={styles.buttonContainer}>
                <BasicButton className={styles.button_cancel} onClick={handleCancel}>
                  cancel
                </BasicButton>
                <BasicButton className={styles.button_save} onClick={saveHandler}>
                  Apply
                </BasicButton>
              </div>
            </div>
          </>
        )}
      ></Modal>
    </>
  )
}

export default AccountNewModal
