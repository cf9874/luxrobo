import { useState } from "react"
import { Avatar, Dropdown } from "antd"
import type { AvatarProps, MenuProps } from "antd"
import { getIcon } from "../../types/icon"
import { useAsyncEffect } from "../../hooks"
import { AliasToken } from "antd/es/theme/internal"
import { apiUtil } from "@/apis"
import { useRouter } from "next/router"

//-----------------------------------------------------------------------------------------------------------
// [Type]
interface IProfileProps extends AvatarProps {
  theme?: Partial<AliasToken>
  option?: React.Key
}

//-----------------------------------------------------------------------------------------------------------
// [Main]
export default function FrameProfile(props: IProfileProps) {
  //-----------------------------------------------------------------------------------------------------------
  // [Profile Image]
  // 관리자 이미지 설정 여부에 따라 제거
  const router = useRouter()
  const [image, setImage] = useState("")

  //-----------------------------------------------------------------------------------------------------------
  // [Profile DropDown]
  // 로그인 구현 후 로그아웃 기능 추가
  const profileDropDown: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            console.log("Logout!")
            apiUtil.removeUserData()
            void router.push("/signin")
          }}
        >
          Logout
        </div>
      ),
    },
  ]
  useAsyncEffect(async () => {
    setImage("")
  })

  //-----------------------------------------------------------------------------------------------------------
  // 이미지 url 검사후 valid 하면 image avatar
  // if (!image || image === "" || image === "undefined") {
  //   return (
  //     <Dropdown menu={{ items: profileDropDown }} placement="bottomCenter" arrow={{ pointAtCenter: true }}>
  //       <Avatar src={image} alt={"avatar"} {...props} />
  //     </Dropdown>
  //   )
  // }
  return (
    <>
      <Dropdown menu={{ items: profileDropDown }} placement="bottom" arrow={{ pointAtCenter: true }}>
        <Avatar icon={getIcon("no-avatar")} {...props} />
      </Dropdown>
    </>
  )
}
