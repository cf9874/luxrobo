import {
  BankOutlined,
  HomeOutlined,
  ProjectOutlined,
  QuestionCircleFilled,
  SettingOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
  LoadingOutlined,
  RobotOutlined,
} from "@ant-design/icons"

export function getIcon(keyword: string) {
  switch (keyword) {
    case "home":
      return <HomeOutlined />
    case "manageUser":
      return <UserOutlined />
    case "manageTeam":
      return <TeamOutlined />
    case "manageProject":
      return <ProjectOutlined />
    case "manageCustom":
      return <SettingOutlined />
    case "manageTool":
      return <ToolOutlined />
    case "manageOrder":
      return <BankOutlined />
    case "managePurchase":
      return <ShoppingCartOutlined />
    case "manageQuestion":
      return <QuestionCircleFilled />
    case "manageAccount":
      return <RobotOutlined />
    case "no-avatar":
      return <UserOutlined />
    default:
      return <LoadingOutlined />
  }
}
