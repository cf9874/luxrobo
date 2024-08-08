import type { NextPage } from "next"
import styles from "../styles/scss/Home.module.scss"
import { useAsyncEffect } from "../hooks"
import { HOME } from "@/const"

/*
 */

const Home: NextPage = () => {
  useAsyncEffect(async () => {}, [])

  return <div></div>
}

export default Home
