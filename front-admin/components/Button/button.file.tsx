import { Input } from "antd"
import { BasicButton } from "./button.basic"
import { IFileButtonProps } from "./button.type"
import { useRef } from "react"

// const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files[0]

//   return file
// }

// const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const files = e.target.files

//   return files
// }

export const FileButton = (props: IFileButtonProps) => {
  const { option, children, handleFile, handleFiles, ...newProps } = props
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const onClickUploadHandler = () => {
    fileInputRef.current?.click()
  }

  switch (option) {
    case "files":
      return (
        <div>
          <input type="file" onChange={e => handleFiles(e)} ref={fileInputRef} style={{ display: "none" }} />
          <BasicButton onClick={onClickUploadHandler} {...newProps}>
            {children}
          </BasicButton>
        </div>
      )
    case "image":
      return (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={e => handleFile(e)}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <BasicButton onClick={onClickUploadHandler} {...newProps}>
            {children}
          </BasicButton>
        </div>
      )
    default:
      return (
        <div>
          <input type="file" onChange={e => handleFile(e)} ref={fileInputRef} style={{ display: "none" }} />
          <BasicButton onClick={onClickUploadHandler} {...newProps}>
            {children}
          </BasicButton>
        </div>
      )
  }
}
