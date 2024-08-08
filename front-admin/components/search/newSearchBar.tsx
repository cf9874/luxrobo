import { Col, Descriptions, Row } from "antd"
import { SearchMatchingSelection, SearchRangeSelection } from "../Select"
import { ReloadOutlined } from "@ant-design/icons"
import { BasicInput } from "../Input"
import { BasicButton } from "../Button"
import { BasicProps } from "antd/es/layout/layout"
import { useState } from "react"
import { useAsyncEffect } from "@/hooks"
import styles from "./newSearchBar.module.scss"

interface ISearchBarProps extends BasicProps {
  pageKey: string
  keyword: {
    value: string
    onChange: any
  }
  is_match: {
    value: boolean
    onChange: any
  }
  range: {
    value: number
    onChange: any
  }
  searchHandler: any
  resetHandler: any
}

export const NewSearchBar = (props: ISearchBarProps) => {
  //--------------------------------------------------------------------
  const [isSpin, setIsSpin] = useState<boolean>(false)

  const reLoadHandler = async e => {
    setIsSpin(true)
    setTimeout(() => {
      setIsSpin(false)
    }, 1000)

    // 초기화
    props.resetHandler()
  }
  //--------------------------------------------------------------------
  //[UI]
  return (
    <Row justify="start" align="middle" className={props.className}>
      <Col span={4}>
        <SearchRangeSelection option={props.pageKey} {...props.range}></SearchRangeSelection>
      </Col>
      <Col span={4}>
        <SearchMatchingSelection {...props.is_match}></SearchMatchingSelection>
      </Col>
      <Col span={12}>
        <BasicInput
          {...props.keyword}
          onKeyDown={e => {
            if (e.key === "Enter") props.searchHandler(e)
          }}
        ></BasicInput>
      </Col>
      <Col span={4}>
        <div className={styles.searchButtonContainer}>
          <BasicButton onClick={props.searchHandler}>검색</BasicButton>
          <ReloadOutlined spin={isSpin} className={styles.reloadBtn} onClick={reLoadHandler} />
        </div>
      </Col>
    </Row>
  )
}

export default NewSearchBar
