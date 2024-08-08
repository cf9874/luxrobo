import { AliasToken } from "antd/es/theme/internal"
import { Image, ImageProps } from "antd"
import { useRouter } from "next/router"
import logo from "../../public/logo.png"

//-----------------------------------------------------------------------------------------------------------
interface ILogoProps extends ImageProps {
  theme?: Partial<AliasToken>
}

//-----------------------------------------------------------------------------------------------------------
const FrameLogo = (props: ILogoProps) => {
  const router = useRouter()

  return (
    <Image
      src={logo.src}
      alt="Logo"
      preview={false}
      onClick={() => {
        router.push("/home")
      }}
      {...props}
    />
  )
}

export default FrameLogo
