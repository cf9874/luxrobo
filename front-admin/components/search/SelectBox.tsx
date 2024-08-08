import { NextPage } from "next"
import { Select } from "antd"
import {
  CUSTOM_OPTIONS,
  MODAL_OPTIONS,
  ORDER_OPTIONS,
  PROJECT_OPTIONS,
  PURCHASE_OPTIONS,
  QUESTION_OPTIONS,
  SHIPMENT_OPTIONS,
  TEAM_OPTIONS,
  TOOL_OPTIONS,
  USER_OPTIONS,
  WORD_OPTIONS,
} from "../../const/searchConst"
import styles from "./selectBox.module.scss"
import { useRouter } from "next/router"

interface SelectBoxProps {
  setSelectedDataOption: (option: string) => void
  setSelectedWordOption: (option: string) => void
}

const SelectBox: NextPage<SelectBoxProps> = ({ setSelectedDataOption, setSelectedWordOption }) => {
  const { Option } = Select
  const { pathname } = useRouter()

  const handleDataOptionChange = (option: string) => {
    setSelectedDataOption(option)
  }

  const handleWordOptionChange = (option: string) => {
    setSelectedWordOption(option)
  }

  const dataOptionHandler = () => {
    if (pathname === "/user") {
      return USER_OPTIONS
    }
    if (pathname === "/team") {
      return TEAM_OPTIONS
    }
    if (pathname === "/project") {
      return PROJECT_OPTIONS
    }
    if (pathname === "/custom") {
      return CUSTOM_OPTIONS
    }
    if (pathname === "/tool") {
      return TOOL_OPTIONS
    }
    if (pathname === "/order") {
      return ORDER_OPTIONS
    }
    if (pathname === "/purchase") {
      return PURCHASE_OPTIONS
    }
    if (pathname === "/shipment") {
      return SHIPMENT_OPTIONS
    }
    if (pathname === "/question") {
      return QUESTION_OPTIONS
    } else {
      return MODAL_OPTIONS
    }
  }

  const data = dataOptionHandler()

  return (
    <div className={styles.container}>
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
  )
}

export default SelectBox
