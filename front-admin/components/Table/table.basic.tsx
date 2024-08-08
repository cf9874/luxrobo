import React from "react"
import { ConfigProvider, Table } from "antd"
import { ITableProps } from "./table.type"
import { ColumnsType } from "antd/es/table"
import styles from "./table.module.scss"

//------------------------------------------------------------------------------------------------------
// object[] -> table 변환
export const BasicTable = (props: ITableProps) => {
  const { option, tableInfo, tableDetails, render, className, ...newProps } = props

  //------------------------------------------------------------------------------------------------------
  // [table key 설정 - priority : 지정 key > data object key]
  const tableKeys = (() => {
    if (tableInfo && tableInfo.keys) {
      //console.log("지정 Key")
      return tableInfo.keys
    }

    if (props.dataSource) {
      //console.log("Data Key")
      return Object.keys(props.dataSource[0])
    }

    return []
  })()
  //console.log("tableKeys", tableKeys)

  //------------------------------------------------------------------------------------------------------
  // [Column 설정 함수]
  const getColumn = (key, tableDetail, renderFunc) => {
    return {
      title: (() => {
        if (tableDetail && tableDetail.label) return tableDetail.label
        return key
      })(),
      showSorterTooltip: false,
      sorter: (() => {
        if (tableDetail && tableDetail.sorter)
          return {
            compare: (a, b) => {
              if (typeof a[key] === "number" || typeof b[key] === "number") {
                return b[key] - a[key]
              }
              return a[key]?.localeCompare(b[key])
            },
            multiple: 1,
          }
        return false
      })(),
      render: (() => {
        if (!renderFunc) {
          return text => {
            if (typeof text === "object" && !Array.isArray(text) && text !== null)
              return <div>{JSON.stringify(text)}</div>
            return <div>{text}</div>
          }
        }

        return (text, record, index) => {
          // index : tableData 배열 index, key : dataIndex, text : value
          return renderFunc({
            index: index,
            key: key,
            pm_value: text,
            record: record,
          })
        }
      })(),
    }
  }

  //------------------------------------------------------------------------------------------------------
  //[table Column 설정] => custom, default 통합
  const columns: ColumnsType<Object> = tableKeys.map((key, index) => {
    //------------------------------------------------------------------------------------------------------
    // detail 설정 o
    if (tableDetails) {
      // ColumnGroup (key 가 배열일 때) - ex) Custom/[id]/descE(IOPorts) - VoltRange
      if (Array.isArray(key)) {
        return {
          ...tableDetails[key[0]],
          title: (() => {
            if (tableDetails[key[0]] && tableDetails[key[0]].label) return tableDetails[key[0]].label
            return key[0]
          })(),
          children: [].concat(key.slice(1)).map(item => {
            //console.log(item)
            return {
              ...tableDetails[item],
              dataIndex: item,
              ...getColumn(item, tableDetails[item], render),
            }
          }),
        }
      }

      // 일반 Column
      return {
        ...tableDetails[key],
        dataIndex: key,
        ...getColumn(key, tableDetails[key], render),
      }
    }
    //------------------------------------------------------------------------------------------------------
    // detail 설정 x
    // ColumnGroup (key 가 배열일 때) - ex) Custom/[id]/descE(IOPorts) - VoltRange
    if (Array.isArray(key)) {
      return {
        title: key[0],
        children: [].concat(key.slice(1)).map(item => {
          //console.log(item)
          return {
            dataIndex: item,
            title: item,
            render: text => {
              if (typeof text === "object" && !Array.isArray(text) && text !== null)
                return <div>{JSON.stringify(text)}</div>
              return <div>{text}</div>
            },
          }
        }),
      }
    }

    // 일반 Column
    return {
      dataIndex: key,
      title: key,
      render: text => {
        if (typeof text === "object" && !Array.isArray(text) && text !== null) return <div>{JSON.stringify(text)}</div>
        return <div>{text}</div>
      },
    }
  })

  //------------------------------------------------------------------------------------------------------
  //[table 출력]
  switch (option) {
    case "indexTable":
      return (
        <>
          {(() => {
            if (typeof tableInfo?.title === "string") return <h3>{tableInfo.title}</h3>
            return tableInfo?.title
          })()}
          <Table {...newProps} className={`${styles.index_table} ${className}`} columns={columns}></Table>
        </>
      )
    default:
      return (
        <>
          {(() => {
            if (typeof tableInfo?.title === "string") return <h3>{tableInfo.title}</h3>
            return tableInfo?.title
          })()}
          <Table {...newProps} className={`${styles.table_global} ${className}`} columns={columns}></Table>
        </>
      )
  }
}

export default BasicTable
