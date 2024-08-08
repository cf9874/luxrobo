import { Layout, Menu, MenuProps, SiderProps } from "antd"
const { Sider } = Layout
import { useState } from "react"
import { useRouter } from "next/router"
import styles from "./sidebar.module.scss"
import sidebarData from "../../data/sidemenuData.json"
import { defaultValue } from "../../const/enum"
import {
  ACCOUNT,
  CUSTOM,
  CUSTOMDETAIL,
  CUSTOMNEW,
  HOME,
  COMPANY,
  COMPANYDETAIL,
  COMPANYNEW,
  PROJECT,
  PROJECTDETAIL,
  ORDER,
  ORDERDETAIL,
  CONTACT,
  CONTACTDETAIL,
  SHIP,
  SHIPDETAIL,
  TEAM,
  TEAMDETAIL,
  TEAMNEW,
  PART,
  PARTDETAIL,
  PARTNEW,
  USER,
  USERDETAIL,
  USERNEW,
  VALID,
  titleKey,
} from "@/const"
import { useAppSelector } from "@/hooks"
import { shallowEqual } from "react-redux"

//-----------------------------------------------------------------------------------------------------------
interface ISideBarProps extends SiderProps {
  titleKey?: titleKey
}

const getDefaultSelected = (titleKey?: titleKey) => {
  switch (titleKey) {
    case HOME:
      return ["home"]
    case VALID:
      return ["admin"]
    case ACCOUNT:
      return ["account"]
    case USER:
    case USERDETAIL:
    case USERNEW:
      return ["user"]
    case TEAM:
    case TEAMDETAIL:
    case TEAMNEW:
      return ["team"]
    case PROJECT:
    case PROJECTDETAIL:
      return ["project"]
    case CUSTOM:
    case CUSTOMDETAIL:
    case CUSTOMNEW:
      return ["custom"]
    case PART:
    case PARTDETAIL:
    case PARTNEW:
      return ["part"]
    case COMPANY:
    case COMPANYDETAIL:
    case COMPANYNEW:
      return ["company"]
    case ORDER:
    case ORDERDETAIL:
      return ["purchase"]
    case SHIP:
    case SHIPDETAIL:
      return ["shipment"]
    case CONTACT:
    case CONTACTDETAIL:
      return ["contact"]
    default:
      return []
  }
}

//-----------------------------------------------------------------------------------------------------------
const FrameSideBar = (props: ISideBarProps) => {
  const router = useRouter()
  //-----------------------------------------------------------------------------------------------------------
  // [datas]
  const { profile } = useAppSelector(state => state.profileReducer, shallowEqual)
  // console.log(profile)

  const profile_auth = Object.keys(profile).filter(key => profile[key] === true)
  // console.log(profile_auth)

  const { titleKey, className, ...newProps } = props

  //-----------------------------------------------------------------------------------------------------------
  // [sideMenuData.json]
  const data = sidebarData.menuItems
  // const root = sidebarData.rootKeys

  //-----------------------------------------------------------------------------------------------------------
  // [권한이 있는 key 설정]
  const AuthKeys = [...["home"], ...profile_auth]

  //-----------------------------------------------------------------------------------------------------------
  // [권한이 있는 sidebar 설정]
  const AuthSiderDatas = data.filter(item => AuthKeys.includes(item.key))

  //-----------------------------------------------------------------------------------------------------------
  // [Drop 영역별로 하나씩만 열리게]
  const [openKeys, setOpenKeys] = useState([])

  const onOpenChange: MenuProps["onOpenChange"] = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1)
    if (latestOpenKey && AuthKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  //-----------------------------------------------------------------------------------------------------------
  // [SideBar 출력]
  return (
    <Sider className={`${styles.sidebar_global} ${className}`} {...newProps}>
      <Menu
        mode={defaultValue.inline}
        className={styles.sidebar_menu_global}
        defaultSelectedKeys={getDefaultSelected(props.titleKey)}
        items={AuthSiderDatas}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onClick={e => {
          router.push(`/${e.key}`)
        }}
      />
    </Sider>
  )
}

export default FrameSideBar
