import { Badge } from "antd"
import styles from "./block.module.scss"
import { IBlockProps } from "type"
import Image from "next/image"
import { useState } from "react"
export const FeatureBlock = (props: IBlockProps) => {
  const [isHover, setIsHover] = useState(false)

  return (
    <Badge
      count={props.count ? props.count : 0}
      showZero={false}
      offset={[-5, 5]}
      size="default"
      className={props.className}
      color={props.activeColor}
    >
      <div
        className={styles.block_container}
        onClick={props.onClick}
        onMouseEnter={() => setIsHover(state => !state)}
        onMouseLeave={() => setIsHover(state => !state)}
      >
        <div className={styles.image_container}>
          {props.count !== undefined ? (
            <span
              className={styles.feature_dot}
              style={{
                backgroundColor:
                  props.isCart || props.count
                    ? props.activeColor
                    : props.hoverAction
                      ? isHover
                        ? props.activeColor + "80"
                        : "#a1a1a1"
                      : "#a1a1a1",
              }}
            />
          ) : null}
          <div className={styles.block_img}>
            <Image
              src={props.src}
              unoptimized={true}
              width={40}
              height={40}
              alt={props.children?.toString()}
              style={{
                opacity: props.hoverAction && props.count ? (isHover ? 0.8 : 1) : 0.8,
              }}
            />
          </div>
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.block_outline}
          >
            <g fill="none" fillRule="evenodd">
              <path
                d="M80 0c11.046 0 20 8.954 20 20v60c0 11.046-8.954 20-20 20H20C8.954 100 0 91.046 0 80V20C0 8.954 8.954 0 20 0h60zm-4.142 6H20C12.28 6 6 12.28 6 20v60c0 7.72 6.28 14 14 14h60c7.72 0 14-6.28 14-14V24.143a3.979 3.979 0 0 0-1.171-2.83L78.686 7.172A3.971 3.971 0 0 0 75.858 6z"
                fill="#fff"
              />
              <rect width="16" height="16" rx="8" transform="translate(8 8)" />
            </g>
          </svg>

          <svg
            width="90"
            height="90"
            viewBox="0 0 92 92"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.block_line}
          >
            <path
              d="M90 76c0 7.72-6.28 14-14 14H16C8.28 90 2 83.72 2 76V16C2 8.28 8.28 2 16 2h55.858c1.068 0 2.073.416 2.828 1.172l14.143 14.141A3.979 3.979 0 0 1 90 20.143V76zm.243-60.101L76.101 1.758A5.961 5.961 0 0 0 71.858 0H16C7.178 0 0 7.178 0 16v60c0 8.822 7.178 16 16 16h60c8.822 0 16-7.178 16-16V20.143c0-1.603-.624-3.11-1.757-4.244z"
              fill={
                props.isCart || props.count
                  ? props.activeColor
                  : props.hoverAction
                    ? isHover
                      ? props.activeColor + "80"
                      : "#a1a1a1"
                    : "#a1a1a1"
              }
              fillRule="evenodd"
            />
          </svg>
        </div>
        <div
          className={styles.feature_name}
          style={{
            opacity: props.hoverAction && props.count ? (isHover ? 0.8 : 1) : 0.8,
          }}
        >
          {props.children}
        </div>
      </div>
    </Badge>
  )
}
