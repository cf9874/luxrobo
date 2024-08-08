import { NextPage } from "next"
import styles from "./searchBar.module.scss"
import { Button, Input, Select, Space } from "antd"
import { WORD_OPTIONS } from "@/const/searchConst"
import dataOptionHandler from "@/utils/searchOption"
import getSearch from "@/utils/getSearch"
import { useState } from "react"
import { ReloadOutlined } from "@ant-design/icons"

interface SerachBarProps {
  Data: any[]
  setSearchResult: React.Dispatch<React.SetStateAction<any[]>>
}

export const SearchBar: NextPage<SerachBarProps> = ({ Data, setSearchResult }) => {
  const { Option } = Select

  const [selectedDataOption, setSelectedDataOption] = useState("all")
  const [selectedWordOption, setSelectedWordOption] = useState("포함")
  const [isSearch, setIsSearch] = useState<string>("")
  const [isSpin, setIsSpin] = useState<boolean>(false)

  const handleDataOptionChange = (option: string) => {
    setSelectedDataOption(option)
  }

  const handleWordOptionChange = (option: string) => {
    setSelectedWordOption(option)
  }

  const searchInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSearch(event.target.value)
  }

  const searchButtonHandler = e => {
    if (isSearch.length > 0) {
      const data = getSearch(Data, selectedDataOption, selectedWordOption, isSearch)

      setSearchResult(data)
    } else {
      alert("검색어를 입력해주세요")
    }
  }

  const reLoadHandler = async () => {
    setIsSpin(true)

    // 1초 후에 spin 멈춤
    setTimeout(() => {
      setIsSpin(false)
    }, 1000)

    setSearchResult(Data)
    setIsSearch("")
  }

  const data = dataOptionHandler()

  return (
    <div className={styles.searchBar_container}>
      <div className={styles.selectBox}>
        <Select className={`${styles.button} ${styles.category}`} defaultValue="all" onChange={handleDataOptionChange}>
          {data?.map(item => (
            <Option key={item.key} value={item.key}>
              <div className={styles.itemText}>{item.label}</div>
            </Option>
          ))}
        </Select>
        <Select className={`${styles.button} ${styles.include}`} defaultValue="포함" onChange={handleWordOptionChange}>
          {WORD_OPTIONS.map(item => (
            <Option key={item.key} value={item.label}>
              <div className={styles.itemText}>{item.label}</div>
            </Option>
          ))}
        </Select>
      </div>
      <div className={styles.serachInputBtn}>
        <Space.Compact block={true}>
          <Input
            className={styles.input}
            value={isSearch}
            onChange={searchInputHandler}
            onKeyDown={e => {
              if (e.key === "Enter") {
                searchButtonHandler(e)
              }
            }}
          />
          <Button className={styles.searchBtn} onClick={searchButtonHandler}>
            검색
          </Button>
        </Space.Compact>
      </div>
      <ReloadOutlined spin={isSpin} style={{ fontSize: "20px", marginLeft: "1%" }} onClick={reLoadHandler} />
    </div>
  )
}

export default SearchBar
