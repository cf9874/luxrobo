import type { NextPage } from "next"
import styles from "../styles/scss/Home.module.scss"
import { useAsyncEffect } from "../hooks"
import PageFrame from "@/components/layout/pageFrame"
import { HOME } from "@/const"

const AdminHome: NextPage = () => {
  useAsyncEffect(async () => {}, [])

  return (
    <>
      <PageFrame titleKey={HOME}>
        <div className={styles.container}></div>
      </PageFrame>
    </>
  )
}

export default AdminHome
