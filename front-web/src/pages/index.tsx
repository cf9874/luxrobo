import { useRouter } from "next/router"
import { useEffect } from "react"

const IndexPage = () => {
  const router = useRouter()
  useEffect(() => {
    void router.push("/member/signin")
  }, [router])

  return <></>
}

export default IndexPage
