import styles from "components/Dropdown/dropdown.module.scss"
import { CATEGORY_COLOR } from "@const/block.const"
import { Row, SelectProps } from "antd"
import Image from "next/image"

export const colorOptions: SelectProps["options"] = [
  {
    value: CATEGORY_COLOR.MCU,
    label: <div className={styles.options_wrapper} style={{ backgroundColor: CATEGORY_COLOR.MCU }} />,
  },
  {
    value: CATEGORY_COLOR.Input,
    label: <div className={styles.options_wrapper} style={{ backgroundColor: CATEGORY_COLOR.Input }} />,
  },
  {
    value: CATEGORY_COLOR.Output,
    label: <div className={styles.options_wrapper} style={{ backgroundColor: CATEGORY_COLOR.Output }} />,
  },
  {
    value: CATEGORY_COLOR.Comm,
    label: <div className={styles.options_wrapper} style={{ backgroundColor: CATEGORY_COLOR.Comm }} />,
  },
  {
    value: CATEGORY_COLOR.Battery,
    label: <div className={styles.options_wrapper} style={{ backgroundColor: CATEGORY_COLOR.Battery }} />,
  },
  {
    value: CATEGORY_COLOR.PowerIn,
    label: <div className={styles.options_wrapper} style={{ backgroundColor: CATEGORY_COLOR.PowerIn }} />,
  },
  {
    value: CATEGORY_COLOR.PowerOut,
    label: <div className={styles.options_wrapper} style={{ backgroundColor: CATEGORY_COLOR.PowerOut }} />,
  },
]

export const textIcOptions: SelectProps["options"] = [
  {
    value: "MCU",
    label: (
      <Row align={"middle"}>
        <Image
          unoptimized={true}
          src={process.env.NEXT_PUBLIC_S3_URL + "/icons/mcu.svg"}
          width={20}
          height={20}
          alt="MCU"
        />
        <span className={styles.option_title}>MCU</span>
      </Row>
    ),
  },
  {
    value: "LED",
    label: (
      <Row align={"middle"}>
        <Image
          unoptimized={true}
          src={process.env.NEXT_PUBLIC_S3_URL + "/icons/led.svg"}
          width={20}
          height={20}
          alt="LED"
        />
        <span className={styles.option_title}>LED</span>
      </Row>
    ),
  },
  {
    value: "Switch",
    label: (
      <Row align={"middle"}>
        <Image
          unoptimized={true}
          src={process.env.NEXT_PUBLIC_S3_URL + "/icons/switch.svg"}
          width={20}
          height={20}
          alt="Switch"
        />
        <span className={styles.option_title}>Switch</span>
      </Row>
    ),
  },
  {
    value: "Camera",
    label: (
      <Row align={"middle"}>
        <Image
          unoptimized={true}
          src={process.env.NEXT_PUBLIC_S3_URL + "/icons/camera.svg"}
          width={20}
          height={20}
          alt="Camera"
        />
        <span className={styles.option_title}>Camera</span>
      </Row>
    ),
  },
  {
    value: "GPS",
    label: (
      <Row align={"middle"}>
        <Image
          unoptimized={true}
          src={process.env.NEXT_PUBLIC_S3_URL + "/icons/gps.svg"}
          width={20}
          height={20}
          alt="GPS"
        />
        <span className={styles.option_title}>GPS</span>
      </Row>
    ),
  },
  {
    value: "Current",
    label: (
      <Row align={"middle"}>
        <Image
          unoptimized={true}
          src={process.env.NEXT_PUBLIC_S3_URL + "/icons/current.svg"}
          width={20}
          height={20}
          alt="Current"
        />
        <span className={styles.option_title}>Current</span>
      </Row>
    ),
  },
  {
    value: "TOF",
    label: (
      <Row align={"middle"}>
        <Image
          unoptimized={true}
          src={process.env.NEXT_PUBLIC_S3_URL + "/icons/tof.svg"}
          width={20}
          height={20}
          alt="TOF"
        />
        <span className={styles.option_title}>TOF Sensor</span>
      </Row>
    ),
  },
]

export const IOTypeOption: SelectProps["options"] = [
  {
    value: "VDD",
    label: "VDD",
  },
  {
    value: "GND",
    label: "GND",
  },
  {
    value: "GPIO",
    label: "GPIO",
  },
  {
    value: "ADC",
    label: "ADC",
  },
  {
    value: "PWM",
    label: "PWM",
  },
  {
    value: "UART",
    label: "UART",
  },
  {
    value: "I2C",
    label: "I2C",
  },
  {
    value: "I2S",
    label: "I2S",
  },
  {
    value: "SPI",
    label: "SPI",
  },
  {
    value: "USB",
    label: "USB",
  },
  {
    value: "CAN",
    label: "CAN",
  },
  {
    value: "ETC",
    label: "ETC",
  },
]
export const pinTypeOption: {
  [key: string]: SelectProps["options"]
} = {
  VDD: [
    {
      value: "IN",
      label: "IN",
    },
    {
      value: "OUT",
      label: "OUT",
    },
  ],
  UART: [
    {
      value: "RX",
      label: "RX",
    },
    {
      value: "TX",
      label: "TX",
    },
  ],
  USB: [
    {
      value: "Dp",
      label: "Dp",
    },
    {
      value: "Dm",
      label: "Dm",
    },
  ],
  I2C: [
    {
      value: "SDA",
      label: "SDA",
    },
    {
      value: "SCL",
      label: "SCL",
    },
  ],
  SPI: [
    {
      value: "SDO",
      label: "SDO",
    },
    {
      value: "SDI",
      label: "SDI",
    },
    {
      value: "SCK",
      label: "SCK",
    },
    {
      value: "nCS",
      label: "nCS",
    },
  ],
  CAN: [
    {
      value: "CanH",
      label: "CanH",
    },
    {
      value: "CanL",
      label: "CanL",
    },
  ],
  I2S: [
    {
      value: "SDATA",
      label: "SDATA",
    },
    {
      value: "SCLK",
      label: "SCLK",
    },
    {
      value: "LRCLK",
      label: "LRCLK",
    },
    {
      value: "MCLK",
      label: "MCLK",
    },
  ],
}

export const converterOptions: SelectProps["options"] = [
  {
    value: "LDO",
    label: "LDO (Linear Regulator)",
  },
  {
    value: "Buck",
    label: "Buck (Linear Regulator)",
  },
]
