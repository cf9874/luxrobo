import { useAsyncEffect } from "@/hooks"
import { PageFrame } from "@/components/layout"
import { Divider, Pagination, SelectProps } from "antd"
import React, { useState } from "react"
import styles from "@/pages/account/account.module.scss"
import { ACCOUNT, paginationSize } from "@/const"
import { BasicTable } from "@/components/Table"
import {
  AccountIndex,
  AccountIndexDetail,
  AccountIndexType,
  AccountNewIndexType,
} from "@/components/pages/account/indexDesc"
import { NextPage } from "next"
import { apiManager } from "@/apis"
import { BasicSelect } from "@/components/Select"
import { BasicButton } from "@/components/Button"
import { apiUtil } from "@/apis/api.util"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import { API_ERROR_MSG } from "@/const/api.error.const"
const AccountNewModal = dynamic(() => import("@/components/modal/account.new.modal"))

const AccountPage: NextPage = () => {
  const router = useRouter()
  //------------------------------------------------------------------------------------------------------
  // [Data]
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])

  const [editAccountDatas, setEditAccountDatas] = useState<AccountIndexType[]>([])
  const [newAccountDatas, setNewAccountDatas] = useState<AccountNewIndexType[]>([])

  const [deleteAccountIDs, setDeleteAccountIDs] = useState<number[]>([])

  const [CL_pagination, setCLPagination] = useState({
    current: 1,
    defaultPageSize: paginationSize,
    total: 1,
  })

  const [masterAuths, setMasterAuth] = useState<string[]>([])

  const [authOptions, setAuthOptions] = useState<SelectProps["options"]>([{ value: "none", label: "(none)" }])

  //------------------------------------------------------------------------------------------------------
  // 초기화
  useAsyncEffect(async () => {
    const accountResponse = await apiManager.authApi.getAccountList()
    if (apiUtil.isErrorResponse(accountResponse)) {
      if (apiUtil.signChecker(accountResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(accountResponse.message)
      return
    }

    const modifiedAccountDatas = await accountResponse.map((item, index) => {
      return {
        key: item.adminID,
        ...item,
      }
    })

    setEditAccountDatas(modifiedAccountDatas)

    //
    const adminResponse = await apiManager.authApi.getAuthList()
    if (apiUtil.isErrorResponse(adminResponse)) {
      if (apiUtil.signChecker(adminResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(adminResponse.message)
      return
    }

    setMasterAuth(adminResponse.filter(item => item.auth_admin).map(item => item.auth_name))

    const newAuthOptions = adminResponse
      .filter(item => item.auth_admin !== true)
      .map(item => ({ value: item.auth_name, label: item.auth_name }))
    setAuthOptions([...newAuthOptions, { value: "none", label: "(none)" }])
  }, [])

  // tableData 변경시 -> pagination 정보 변경
  useAsyncEffect(async () => {
    const totalLength = editAccountDatas.length + newAccountDatas.length
    setCLPagination({
      ...CL_pagination,
      current: (() => {
        if (CL_pagination.current > Math.ceil(totalLength / CL_pagination.defaultPageSize))
          return CL_pagination.current - 1 < 1 ? 1 : CL_pagination.current - 1
        return CL_pagination.current
      })(),
      total: totalLength,
    })
  }, [editAccountDatas.length, newAccountDatas.length])

  //------------------------------------------------------------------------------------------------------
  // [Function]
  const deleteHandler = async () => {
    setDeleteAccountIDs([...deleteAccountIDs, ...selectedRowKeys.filter(item => item > 0)].sort())

    setEditAccountDatas(editAccountDatas.filter(item => !selectedRowKeys.includes(item.adminID)))
    setNewAccountDatas(newAccountDatas.filter(item => !selectedRowKeys.includes(item.adminID)))

    setSelectedRowKeys([])
  }

  const saveHandler = async () => {
    console.log("Save: Account")
    // -1. 삭제
    console.log(deleteAccountIDs)
    const accountDeleteRes = await apiManager.authApi.deleteAccount(deleteAccountIDs)

    if (apiUtil.isErrorResponse(accountDeleteRes)) {
      if (apiUtil.signChecker(accountDeleteRes)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(accountDeleteRes.message)
      return
    }

    // -2. 수정 (권한 변경)
    for (const item of editAccountDatas.filter(item => !masterAuths.includes(item.auth_name))) {
      console.log(item.adminID, item.auth_name)
      const accountEditRes = await apiManager.authApi.setAuth({ adminID: item.adminID, auth_name: item.auth_name })
      if (apiUtil.isErrorResponse(accountEditRes)) {
        if (apiUtil.signChecker(accountEditRes)) {
          alert(API_ERROR_MSG.NEEDLOGIN)
          apiUtil.removeUserData()
          void router.push("/signin")
          return
        }
        alert(accountEditRes.message)
        return
      }
    }

    // -3. 추가
    for (const item of newAccountDatas) {
      const authNew = {
        accountID: item.accountID,
        password: item.password,
        user_name: item.user_name,
      }
      const auth_name = item.auth_name

      console.log(authNew)
      const accountNewRes = await apiManager.authApi.createAccount(authNew)
      if (apiUtil.isErrorResponse(accountNewRes)) {
        if (apiUtil.signChecker(accountNewRes)) {
          alert(API_ERROR_MSG.NEEDLOGIN)
          apiUtil.removeUserData()
          void router.push("/signin")
          return
        }
        alert(accountNewRes.message)
        return
      }

      const adminID = accountNewRes.adminID
      console.log(adminID, auth_name)
      const accountNewEditRes = await apiManager.authApi.setAuth({
        adminID: adminID,
        auth_name: auth_name,
      })
      if (apiUtil.isErrorResponse(accountNewEditRes)) {
        if (apiUtil.signChecker(accountNewEditRes)) {
          alert(API_ERROR_MSG.NEEDLOGIN)
          apiUtil.removeUserData()
          void router.push("/signin")
          return
        }
        alert(accountNewEditRes.message)
        return
      }
    }

    void router.reload()
  }

  const renderSetAccount = (index, key, change) => {
    const editLength = editAccountDatas.length

    if (index < editLength) {
      setEditAccountDatas(
        (() => {
          const newEditAdminDatas = editAccountDatas.map((item, idx) => {
            if (index === idx) {
              return {
                ...item,
                [key]: change,
              }
            }
            return item
          })

          return newEditAdminDatas
        })(),
      )
    } else {
      const newIndex = index - editLength
      setNewAccountDatas(
        (() => {
          const newNewAccountDatas = newAccountDatas.map((item, idx) => {
            if (newIndex === idx) {
              return {
                ...item,
                [key]: change,
              }
            }
            return item
          })

          return newNewAccountDatas
        })(),
      )
    }
  }

  const accountIndexRender = ({ index, key, pm_value, record }) => {
    switch (key) {
      case "auth_name":
        return (
          <div>
            <BasicSelect
              disabled={masterAuths.includes(pm_value)}
              value={pm_value}
              options={authOptions}
              onChange={change => renderSetAccount(index, key, change)}
            ></BasicSelect>
          </div>
        )
      default:
        if (typeof pm_value === "object" && !Array.isArray(pm_value) && pm_value !== null)
          return <div>{JSON.stringify(pm_value)}</div>
        return <div>{pm_value}</div>
    }
  }

  return (
    <PageFrame titleKey={ACCOUNT}>
      <div className={styles.container}>
        <div className={styles.tableHeader}>
          <h1>관리자 계정 설정</h1>
        </div>
        <Divider />
        <div className={styles.tableTopButton}>
          <BasicButton onClick={deleteHandler}>선택 삭제</BasicButton>
        </div>
        <BasicTable
          option={"indexTable"}
          tableInfo={AccountIndex}
          tableDetails={AccountIndexDetail}
          dataSource={[...editAccountDatas, ...newAccountDatas]}
          render={accountIndexRender}
          rowSelection={{
            selectedRowKeys,
            getCheckboxProps: record => ({
              disabled: masterAuths.includes(record.auth_name),
            }),
            onChange: (newSelectedRowKeys: number[]) => {
              console.log("selectedRowKeys changed: ", newSelectedRowKeys)
              setSelectedRowKeys(newSelectedRowKeys)
            },
          }}
          pagination={{
            ...CL_pagination,
            className: styles.tablePagination,
          }}
        />
        <div className={styles.tableBottomButton}>
          <div className={styles.bottomButton}>
            <AccountNewModal
              id={-newAccountDatas.length - 1}
              accountList={newAccountDatas}
              setAccountList={setNewAccountDatas}
            ></AccountNewModal>
            <BasicButton className={styles.saveBtn} onClick={saveHandler}>
              저장
            </BasicButton>
          </div>
          <Pagination
            {...CL_pagination}
            className={styles.pagination_global}
            onChange={(page, pageSize) => {
              setCLPagination({
                ...CL_pagination,
                current: page,
              })
            }}
          ></Pagination>
        </div>
      </div>
    </PageFrame>
  )
}

export default AccountPage
