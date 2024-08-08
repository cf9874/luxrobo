import { NextPage } from "next"
import { PageFrame } from "@/components/layout"
import styles from "./custom.module.scss"
import { Divider, Pagination } from "antd"
import { useRouter } from "next/router"
import { CustomIndexType, CustomIndex, CustomIndexDetail } from "@/components/pages/custom/indexDesc"
import { useState } from "react"
import { useAsyncEffect, useChanges, useInputs } from "@/hooks"
import { CUSTOM, paginationSize } from "@/const"
import { BasicButton } from "@/components/Button"
import { BasicTable } from "@/components/Table"
import { apiManager, apiUtil } from "@/apis"
import { API_ERROR_MSG } from "@/const/api.error.const"
import { NewSearchBar } from "@/components/search"
import ExcelButton from "@/components/Button/button.excel"

//------------------------------------------------------------------------------------------------------
// [Main]
export const CustomPage: NextPage = () => {
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
  const [CL_tableData, setCLTableData] = useState<CustomIndexType[]>([] as CustomIndexType[])

  // (pagination)
  const [CL_pagination, setCLPagination] = useState({
    current: 1,
    defaultPageSize: paginationSize,
    total: 1,
  })

  // (Excel)
  const excelHeader = CustomIndex.keys
    .filter(key => key !== "manage")
    .map(key => {
      return {
        label: CustomIndexDetail[key].label,
        key: key,
      }
    })

  const [excelData, setExcelData] = useState([])
  //------------------------------------------------------------------------------------------------------
  // 초기화
  useAsyncEffect(async () => {
    const customBlockResponse = await apiManager.customblockApi.searchCustomBlocks("", { is_match: true, range: 1 })
    if (apiUtil.isErrorResponse(customBlockResponse)) {
      if (apiUtil.signChecker(customBlockResponse)) {
        alert(API_ERROR_MSG.NEEDLOGIN)
        apiUtil.removeUserData()
        void router.push("/signin")
      }
      alert(customBlockResponse.message)
      return
    }

    const modifiedCustomblockDatas = customBlockResponse.map((item, index) => {
      return {
        index: index + 1,
        key: item.customblockID,
        manage: item.customblockID,
        ...item,
      }
    })
    setCLTableData(modifiedCustomblockDatas)
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

          CustomIndex.keys
            .filter(key => key !== "manage")
            .forEach(key => {
              excelItem[key as string] = item[key]
            })

          return excelItem
        }),
      )
    }
  }, [CL_tableData])

  //------------------------------------------------------------------------------------------------------
  // [function]
  const searchHandler = async () => {
    console.log(searchKeywordInput.value)
    console.log(searchIsMatch.value)
    console.log(searchRange.value)

    const res = await apiManager.customblockApi.searchCustomBlocks(searchKeywordInput.value, {
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

    setCLTableData(
      res.map((item, index) => ({ index: index + 1, key: item.customblockID, manage: item.customblockID, ...item })),
    )

    setCLPagination({ ...CL_pagination, current: 1, total: res.length })
    setSelectedRowKeys(selectedRowKeys.filter(item => res.map(item => item.customblockID).includes(item)))
  }

  const resetHandler = async () => {
    searchKeywordInput.onClear()
    searchIsMatch.onClear()
    searchRange.onClear()

    const res = await apiManager.customblockApi.searchCustomBlocks("", {
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
        key: item.customblockID,
        manage: item.customblockID,
      })),
    )

    setCLPagination({ ...CL_pagination, current: 1, total: res.length })
    setSelectedRowKeys([])
  }

  const deleteHandler = async () => {
    const res = await apiManager.customblockApi.removeCustomblocks(selectedRowKeys)
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
  const customIndexRender = ({ index, key, pm_value }) => {
    switch (key) {
      case "manage":
        return (
          <BasicButton
            onClick={() => {
              router.push(`/custom/${pm_value}`)
            }}
          >
            수정
          </BasicButton>
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
    <PageFrame titleKey={CUSTOM}>
      <div className={styles.container}>
        <div className={styles.tableHeader}>
          <h1>검색</h1>
          <div className={styles.searchBar}>
            <NewSearchBar
              className={styles.index_searchBar_global}
              pageKey={CUSTOM}
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
          <ExcelButton headers={excelHeader} value={excelData} filename="CustomblockList" />
        </div>
        <BasicTable
          option={"indexTable"}
          tableInfo={CustomIndex}
          tableDetails={CustomIndexDetail}
          render={customIndexRender}
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

export default CustomPage
