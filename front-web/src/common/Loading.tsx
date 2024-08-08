import { useAppSelector } from "hooks"
import Image from "next/image"
import React from "react"
import { shallowEqual } from "react-redux"
import { imgAsset } from "@assets/image"
const Loading = () => {
  const { isLoading } = useAppSelector(state => state.configReducer, shallowEqual)

  return (
    <div className={`loading ${isLoading && `open`}`}>
      <div onClick={e => e.stopPropagation()}>
        <Image src={imgAsset.loadingImage} width={150} height={150} alt="loading" />
      </div>
    </div>
  )
}

export default Loading
