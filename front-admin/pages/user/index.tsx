import { useAsyncEffect, useChanges, useInputs } from "@/hooks"
import React, { useState } from "react"
import { Divider, Pagination } from "antd"
import { useRouter } from "next/router"
import { UserIndex, UserIndexDetail, UserIndexType } from "@/components/pages/user/indexDesc"
import styles from "./user.module.scss"
import { USER, paginationSize } from "@/const"
import { BasicButton } from "@/components/Button"
import { BasicTable } from "@/components/Table"
import { PageFrame } from "@/components/layout"
import { apiManager, apiUtil } from "@/apis"
import ExcelButton from "@/components/Button/button.excel"
import { NewSearchBar } from "@/components/search"
import { NextPage } from "next"
import { API_ERROR_MSG } from "@/const/api.error.const"

//------------------------------------------------------------------------------------------------------
const getDateText = (timestamp: number) => {
  const date = new Date(timestamp * 1000)

  return `${date.getFullYear() % 100 < 10 ? `0${date.getFullYear() % 100}` : date.getFullYear() % 100}.${
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }.${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} ${
    date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  }:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`
}
//------------------------------------------------------------------------------------------------------
// [Main]
const UserPage: NextPage = () => {
  const router = useRouter()
  //------------------------------------------------------------------------------------------------------
  // [Data]
  // (Searching Data)
  const searchIsMatch = useChanges({ value: true })
  const searchRange = useChanges({ value: 1 })
  const searchKeywordInput = useInputs({ value: "" })

  // (row Select)
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])

  // (TableData)
  const [CL_tableData, setCLTableData] = useState<UserIndexType[]>([] as UserIndexType[])

  // (pagination)
  const [CL_pagination, setCLPagination] = useState({
    current: 1,
    defaultPageSize: paginationSize,
    total: 1,
  })

  // (Excel)
  const excelHeader = UserIndex.keys
    .filter(key => key !== "manage")
    .map(key => {
      return {
        label: UserIndexDetail[key].label,
        key: key,
      }
    })

  const [excelData, setExcelData] = useState([])
  //------------------------------------------------------------------------------------------------------
  // 초기화
  useAsyncEffect(async () => {
    const userResponse = await apiManager.userApi.searchUsers("", { is_match: true, range: 1 })
    if (apiUtil.isErrorResponse(userResponse)) {
      if (apiUtil.signChecker(userResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
      }
      alert(userResponse.message)
      return
    }

    const modifiedUserDatas = userResponse.map((item, index) => {
      return {
        index: index + 1,
        key: item.userID,
        manage: item.userID,
        ...item,
      }
    })
    setCLTableData(modifiedUserDatas)
  }, [])

  // tableData 변화시 -> pagination, excelData 초기화
  useAsyncEffect(async () => {
    if (!CL_tableData || CL_tableData.length === 0) {
      setCLPagination({
        current: 1,
        defaultPageSize: CL_pagination.defaultPageSize,
        total: 1,
      })
      setExcelData([])
    } else {
      setCLPagination({
        ...CL_pagination,
        current: (() => {
          if (CL_pagination.current > Math.ceil(CL_tableData.length / CL_pagination.defaultPageSize))
            return CL_pagination.current - 1 < 1 ? 1 : CL_pagination.current - 1
          return CL_pagination.current
        })(),
        total: CL_tableData.length,
      })

      setExcelData(
        CL_tableData.map(item => {
          const excelItem: Record<string, any> = {}

          UserIndex.keys
            .filter(key => key !== "manage")
            .forEach(key => {
              if (key === "last_login_at") {
                excelItem[key as string] = getDateText(item[key])
              } else excelItem[key as string] = item[key]
            })

          return excelItem
        }),
      )
    }
  }, [CL_tableData])

  //------------------------------------------------------------------------------------------------------
  // [function]
  const searchHandler = async () => {
    // console.log(searchKeywordInput.value)
    // console.log(searchIsMatch.value)
    // console.log(searchRange.value)

    const res = await apiManager.userApi.searchUsers(searchKeywordInput.value, {
      is_match: searchIsMatch.value,
      range: searchRange.value,
    })
    if (apiUtil.isErrorResponse(res)) {
      if (apiUtil.signChecker(res)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(res.message)
      return
    }

    setCLTableData(res.map((item, index) => ({ index: index + 1, key: item.userID, manage: item.userID, ...item })))

    setCLPagination({ ...CL_pagination, current: 1, total: res.length })
    setSelectedRowKeys(selectedRowKeys.filter(item => res.map(item => item.userID).includes(item)))
  }

  const resetHandler = async () => {
    searchKeywordInput.onClear()
    searchIsMatch.onClear()
    searchRange.onClear()

    const res = await apiManager.userApi.searchUsers("", {
      is_match: true,
      range: 1,
    })
    if (apiUtil.isErrorResponse(res)) {
      if (apiUtil.signChecker(res)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(res.message)
      return
    }

    setCLTableData(
      res.map((item, index) => ({
        ...item,
        index: index + 1,
        key: item.userID,
        manage: item.userID,
      })),
    )

    setCLPagination({ ...CL_pagination, current: 1, total: res.length })
    setSelectedRowKeys([])
  }

  const deleteHandler = async () => {
    const res = await apiManager.userApi.removeUserAccounts(selectedRowKeys)
    if (apiUtil.isErrorResponse(res)) {
      if (apiUtil.signChecker(res)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
        return
      }
      alert(res.message)
      return
    }

    setCLTableData(
      CL_tableData.filter(item => !selectedRowKeys.includes(item.key)).map((item, index) => ({
        ...item,
        index: index + 1,
      })),
    )

    setSelectedRowKeys([])
  }

  //------------------------------------------------------------------------------------------------------
  // [Render]
  const UserIndexRender = ({ index, key, pm_value }) => {
    switch (key) {
      case "email":
        return (
          <div>
            <a href={`mailto:${pm_value}`} className={styles.user_index_link}>
              {pm_value}
            </a>
          </div>
        )
      case "last_login_at":
        return <div>{getDateText(pm_value)}</div>
      case "manage":
        return (
          <div>
            <BasicButton
              onClick={() => {
                router.push(`/user/${pm_value}`)
              }}
            >
              수정
            </BasicButton>
          </div>
        )
      default:
        if (typeof pm_value === "object" && !Array.isArray(pm_value) && pm_value !== null)
          return <div>{JSON.stringify(pm_value)}</div>
        return <div>{pm_value}</div>
    }
  }
  //------------------------------------------------------------------------------------------------------
  // [UI]
  return (
    <PageFrame titleKey={USER}>
      <div className={styles.container}>
        <div className={styles.tableHeader}>
          <h1>검색</h1>
          <div className={styles.searchBar}>
            <NewSearchBar
              className={styles.index_searchBar_global}
              pageKey={USER}
              keyword={{ value: searchKeywordInput.value, onChange: searchKeywordInput.onChange }}
              is_match={{
                value: searchIsMatch.value,
                onChange: change => {
                  searchIsMatch.onChange(change)
                },
              }}
              range={{
                value: searchRange.value,
                onChange: change => {
                  searchRange.onChange(change)
                },
              }}
              searchHandler={searchHandler}
              resetHandler={resetHandler}
            ></NewSearchBar>
          </div>
        </div>
        <Divider />
        <div className={styles.tableTopButton}>
          <BasicButton onClick={deleteHandler}>선택 삭제</BasicButton>
          <ExcelButton headers={excelHeader} value={excelData} filename="UserList" />
        </div>
        <>
          <BasicTable
            option={"indexTable"}
            tableInfo={UserIndex}
            tableDetails={UserIndexDetail}
            render={UserIndexRender}
            dataSource={CL_tableData}
            rowSelection={{
              selectedRowKeys,
              onChange: (newSelectedRowKeys: number[]) => {
                console.log("selectedRowKeys changed: ", newSelectedRowKeys)
                setSelectedRowKeys(newSelectedRowKeys)
              },
            }}
            pagination={{
              ...CL_pagination,
              className: styles.tablePagination,
            }}
          ></BasicTable>
        </>
        <div className={styles.tableBottomButton}>
          <div className={styles.bottomButton}>
            <BasicButton onClick={() => router.push(router.route + `/new`)}>신규 등록</BasicButton>
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

export default UserPage
