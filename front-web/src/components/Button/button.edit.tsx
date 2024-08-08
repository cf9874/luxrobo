import Image from "next/image"
import { imgAsset } from "@assets/image"

export const EditBtn = (props: { onClick: () => Promise<void>; style?: React.CSSProperties | undefined }) => {
  return (
    <Image
      style={{
        marginBottom: "2px",
        cursor: "pointer",
        ...props.style,
      }}
      width={30}
      height={30}
      src={imgAsset.editImg}
      alt={"수정버튼"}
      onClick={props.onClick}
    />
  )
}
