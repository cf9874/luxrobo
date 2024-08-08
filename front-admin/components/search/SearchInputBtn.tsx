import { Button, Input, Space } from "antd"
import { NextPage } from "next"
import { SetStateAction, useState } from "react"
import styles from "./searchInputBtn.module.scss"
import { useRouter } from "next/router"
import { UserIndexType } from "../pages/user/indexDesc"

export interface SearchInputBtnProps {
  selectedDataOption: string
  selectedWordOption: string
  setCLTableData: SetStateAction<UserIndexType[]>
}

const SearchInputBtn: NextPage<SearchInputBtnProps> = ({ selectedDataOption, selectedWordOption, setCLTableData }) => {
  const { pathname } = useRouter()

  const [isSearch, setIsSearch] = useState<string>("")

  const searchInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    //iseSearch 전무 대문자로 변경
    setIsSearch(event.target.value)
  }

  const searchButtonHandler = () => {
    if (isSearch.length > 0) {
      // const data = apiManager.jsonApi.getSearch(pathname, selectedDataOption, selectedWordOption, isSearch)

      setIsSearch("")
    } else {
      alert("검색어를 입력해주세요")
    }
  }

  return (
    <div className={styles.containter}>
      <Space.Compact block={true}>
        <Input className={styles.input} value={isSearch} onChange={searchInputHandler} />
        <Button className={styles.searchBtn} onClick={searchButtonHandler}>
          검색
        </Button>
      </Space.Compact>
    </div>
  )
}

export default SearchInputBtn
