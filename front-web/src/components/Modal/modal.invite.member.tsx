import { NotificationType, useInputs, useRedux, useToast } from "hooks"
import { BasicModal } from "./modal.basic"
import modalStyles from "./modal.module.scss"
import styles from "./modal.invite.member.module.scss"
import { setModal } from "redux/reducers/config"
import { Col, Row } from "antd"
import { BasicButton } from "components/Button"
import { CloseOutlined } from "@ant-design/icons"
import { apiManager, apiUtil } from "apis"
import { UserSearchDto } from "apis/dto"
import { useState } from "react"
import { plainToInstance } from "class-transformer"
import { useRouter } from "next/router"
import { NoticeType } from "antd/es/message/interface"

export const InviteMemberModal = ({ teamId }: { teamId: number }) => {
  const router = useRouter()
  const modalDispatch = useRedux(setModal)
  const inviteToast = useToast()
  const searchInput = useInputs({ value: "" })

  const [searchList, setSearchList] = useState<UserSearchDto[]>([])
  const [selectList, setSelectList] = useState<UserSearchDto[]>([])
  const [openList, setOpenList] = useState(false)

  const onSelect = (user: UserSearchDto) => {
    setSelectList(list => [...list, user])
    setOpenList(false)
  }
  return (
    <BasicModal
      header="Invite Member"
      footer={
        <Row className={modalStyles.modal_button_wrapper}>
          <BasicButton onClick={() => modalDispatch({ open: false })}>Cancel</BasicButton>
          <BasicButton
            onClick={async () => {
              console.log(3636, selectList)

              const response = await apiManager.teamApi.inviteMemberEmail({
                teamId,
                members: selectList.map(member => member.accountID),
              })
              if (apiUtil.isErrorResponse(response)) {
                alert(response.message)
                return
              }
              const alreadyInvited = response.data.invitings
                .filter(e => e.result !== "success")
                .map(e => {
                  return e.account_id
                })
              const message: {
                type: NotificationType
                content: string
              } = {
                type: alreadyInvited.length === selectList.length ? "error" : "success",
                content:
                  alreadyInvited.length === selectList.length
                    ? "이미 가입된 유저입니다."
                    : "초대 메일이 발송되었습니다.",
              }
              inviteToast.onMessage(message)
              modalDispatch({ open: false })
            }}
          >
            Apply
          </BasicButton>
        </Row>
      }
    >
      <Col className={modalStyles.basic_modal_container}>
        <>{inviteToast.contextHolder}</>
        <Row className={modalStyles.modal_input_wrapper}>
          <input
            placeholder="Add members here"
            value={searchInput.value}
            onChange={async e => {
              searchInput.onChange(e)

              console.log(e.target.value)
              const response = await apiManager.searchApi.search(e.target.value)
              if (apiUtil.isErrorResponse(response)) {
                alert(response.message)
                return
              }
              setOpenList(true)
              setSearchList(selectList.length ? response.filter(v => !selectList.includes(v)) : response)
            }}
          />
        </Row>
        <Row className={styles.search_list_wrapper}>
          {openList
            ? searchList.slice(0, 27).map(u => {
                const user = plainToInstance(UserSearchDto, u).toJson<UserSearchDto>()
                return (
                  <Col key={u.userID} className={styles.search_list} onClick={() => onSelect(user)}>
                    {u.accountID}
                  </Col>
                )
              })
            : null}
        </Row>
        {/* <div className={styles.search_list_wrapper}>asd</div> */}
        <Row className={styles.invite_member_wrapper}>
          {selectList.map(member => (
            <Col key={member.userID} className={styles.invite_member_box}>
              <Col className={styles.invite_member}>{member.accountID}</Col>
              <CloseOutlined
                className={styles.delete_button}
                onClick={() => {
                  console.log("cancel invite")
                  setSelectList(members =>
                    members.filter(v => v.userID !== member.userID).filter(v => selectList.includes(v)),
                  )
                }}
              />
            </Col>
          ))}
        </Row>
      </Col>
    </BasicModal>
  )
}
