import { useAsyncEffect } from "@/hooks"
import { useState } from "react"
import { BasicButton } from "../Button"
import { Modal } from "antd"
import styles from "./orderReceiptModal.module.scss"

export const OrderReceiptModal = ({ url }: { url: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useAsyncEffect(async () => {}, [])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <BasicButton onClick={showModal}>영수증 발행</BasicButton>
      <Modal
        width={600}
        open={isModalOpen}
        title={<h3 className={styles.modalTitle}>주문 영수증 발행</h3>}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={_ => <></>}
      >
        <iframe src={url} className={styles.receipt_wrapper}></iframe>
      </Modal>
    </>
  )
}

export default OrderReceiptModal
