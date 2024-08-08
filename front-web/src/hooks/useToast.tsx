import { notification } from "antd"
import styles from "./toast.module.scss"
import { ALERT_ICON, TITLE_COLOR } from "@const/alarm.const"

export type NotificationType = "success" | "info" | "warning" | "error"

export const useToast = () => {
  const [api, contextHolder] = notification.useNotification()

  const onMessage = ({
    type,
    content,
    duration = 3,
  }: {
    type: NotificationType
    content: string
    duration?: number
  }) => {
    api[type]({
      type,
      message: "",
      description: (
        <div className={styles.alert_wrapper}>
          <div
            className={styles.alert_title}
            style={{
              color: TITLE_COLOR[type],
            }}
          >
            {type}
          </div>
          <div className={styles.alert_content}>{content}</div>
        </div>
      ),
      duration,
      className: styles.wrapper,
      style: {
        borderRadius: 5,
        boxShadow: " 0 8px 14px 0 rgba(0, 0, 0, 0.18)",
        minHeight: 66,
        padding: 0,
        paddingRight: 10,
        paddingBottom: 5,
      },
      icon: ALERT_ICON[type],
    })
  }

  return { onMessage, contextHolder }
}
