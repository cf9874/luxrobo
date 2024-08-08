import { CSVLink } from "react-csv"
import { IExcelButtonProps } from "./button.type"
import { useRef } from "react"
import { BasicButton } from "./button.basic"

const ExcelButton = (props: IExcelButtonProps) => {
  const { headers, value, filename, option, className, ...newProps } = props

  const csvLink = useRef<CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }>(null)

  switch (option) {
    default:
      return (
        <div>
          <BasicButton
            {...newProps}
            className={className}
            onClick={() => {
              csvLink.current.link.click()
            }}
          >
            액셀 다운로드
          </BasicButton>
          <CSVLink ref={csvLink} headers={headers} data={value} filename={filename}></CSVLink>
        </div>
      )
  }
}

export default ExcelButton
