import { FeatureBlockOptionDto, FeatureOptionDto, IFeatureOption } from "apis/dto"
import styles from "../Modal/modal.block.detail.module.scss"
import { Col, ConfigProvider, Radio, Row } from "antd"
import Image from "next/image"
import { Dispatch, SetStateAction, useState } from "react"
import { FeaturePopover } from "components/Popover"
import { QuestionCircleOutlined } from "@ant-design/icons"
import { Placement } from "type"
import { useInputs } from "hooks"
import { BasicInput } from "components/Input"
import { FeatureUtil } from "utils"

export const FeatureOption = ({
  option,
  key,
  onChoice,
  changeOption,
  currentOptionState,
}: {
  option: Omit<FeatureOptionDto, "toJson">
  key: number
  optionInfo: FeatureBlockOptionDto | undefined
  onChoice: (option: Omit<FeatureOptionDto, "toJson">, choiceIndex: number) => void
  changeOption: ({ title, option }: { title: string; option: string }) => Promise<boolean>
  currentOptionState: IFeatureOption
  setCurrentOptionState: Dispatch<SetStateAction<IFeatureOption>>
}) => {
  const currentOption = Object.entries(currentOptionState)
  const optionValue = (currentOption.find(e => e.includes(FeatureUtil.optionTitle(option.title))) ?? [])![1] ?? ""

  const choice = option.choices.find(e => e.includes(optionValue))
  const defaultImg = (choice?.length ?? 0) > 1 ? choice?.find(e => e.includes("http")) : ""

  const [descImg, setDescImg] = useState(defaultImg ?? "")
  return (
    <div className={styles.feature_product_type_header_wrapper}>
      <Row>
        <div className={styles.nav_title}>{option.title}</div>
        <FeaturePopover
          text={
            <div className={styles.popover_wrapper}>
              <div className={styles.popover_title}>{option.title}</div>
              <div className={styles.popover_image_wrapper}>
                {descImg !== "" ? (
                  <Image unoptimized={true} src={descImg ?? ""} width={60} height={60} alt="desc" />
                ) : null}
              </div>
              {option.desc}
            </div>
          }
          width={330}
          placement={Placement.left}
          showClose
        >
          <QuestionCircleOutlined className={styles.information_mark} />
        </FeaturePopover>
      </Row>

      <div
        className={styles.feature_product_type_wrapper}
        style={{ display: "flex", flexDirection: "row", gap: "10px" }}
      >
        {option.user_input ? (
          <UserInput
            key={key}
            changeOption={changeOption}
            title={option.title}
            currentOptionState={currentOptionState}
          />
        ) : null}
        {option.choices.map((choice, index) => {
          if (choice.length > 1) {
            return (
              <ImgSwitch
                key={key}
                option={option}
                choice={choice}
                title={option.title}
                index={index}
                onChoice={onChoice}
                changeOption={changeOption}
                currentOptionState={currentOptionState}
                setDescImg={setDescImg}
              ></ImgSwitch>
            )
          } else {
            return (
              <div key={key}>
                {choice
                  // .filter(v => !v.match(/^https?:\/\//))
                  .map((v, j) => {
                    return (
                      <TextSwitch
                        key={j}
                        option={option}
                        choice={v}
                        title={option.title}
                        index={index}
                        onChoice={onChoice}
                        changeOption={changeOption}
                        currentOptionState={currentOptionState}
                      ></TextSwitch>
                    )
                  })}
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}

export const ImgSwitch = ({
  option,
  choice,
  index,
  title,
  onChoice,
  changeOption,
  currentOptionState,
  setDescImg,
}: {
  option: Omit<FeatureOptionDto, "toJson">
  choice: string[]
  index: number
  title: string
  onChoice: (option: Omit<FeatureOptionDto, "toJson">, choiceIndex: number) => void
  changeOption: ({ title, option }: { title: string; option: string }) => Promise<boolean>
  currentOptionState: IFeatureOption
  setDescImg: Dispatch<SetStateAction<string>>
}) => {
  const imgPath = choice.find(c => c.includes("http"))
  const string = choice.find(c => !c.includes("http"))
  const [selectoption, setSelectOption] = useState<string[]>([])
  const value = currentOptionState[FeatureUtil.optionTitle(title)]

  return (
    <div>
      <Col
        className={string === value ? styles.feature_product_type_box_selected : styles.feature_product_type_box}
        onClick={async () => {
          console.log(143143)
          const response = await changeOption({
            title: FeatureUtil.optionTitle(title),
            option: selectoption.find(o => !o.includes("http")) ?? "",
          })
          if (response) {
            onChoice(option, index)
            setDescImg(imgPath ?? "")
          }
        }}
      >
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#45d6df",
            },
          }}
        >
          <Radio
            className={styles.type_select_button}
            checked={string === value}
            value={choice}
            onChange={async e => {
              setSelectOption(e.target.value as string[])
              const response = await changeOption({
                title: FeatureUtil.optionTitle(title),
                option: e.target.value.find((v: string[]) => !v.includes("https")) ?? "",
              })
              if (response) onChoice(option, index)
            }}
          />
        </ConfigProvider>
        <Col className="">
          <Col className={styles.feature_product_type_image}>
            <Image unoptimized={true} src={imgPath ?? ""} width={40} height={40} alt={""} />
          </Col>
          <Col className={styles.feature_product_type_title}>{string}</Col>
        </Col>
      </Col>
    </div>
  )
}

export const TextSwitch = ({
  option,
  choice,
  title,
  index,
  onChoice,
  changeOption,
  currentOptionState,
}: {
  option: Omit<FeatureOptionDto, "toJson">
  choice: string
  title: string
  index: number
  onChoice: (option: Omit<FeatureOptionDto, "toJson">, choiceIndex: number) => void
  changeOption: ({ title, option }: { title: string; option: string }) => Promise<boolean>
  currentOptionState: IFeatureOption
}) => {
  const value = currentOptionState[FeatureUtil.optionTitle(title)]
  return (
    <div
      onClick={() => {
        onChoice(option, index)
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#45d6df",
          },
        }}
      >
        <Radio
          checked={choice === value}
          value={choice}
          onChange={async e => {
            console.log(495495, e)
            await changeOption({ title: FeatureUtil.optionTitle(title), option: e.target.value ?? "" })
          }}
        >
          {choice}
        </Radio>
      </ConfigProvider>
    </div>
  )
}

export const UserInput = ({
  title,
  currentOptionState,
  changeOption,
}: {
  title: string
  currentOptionState: IFeatureOption
  changeOption: ({ title, option }: { title: string; option: string }) => Promise<boolean>
}) => {
  const value = currentOptionState[FeatureUtil.optionTitle(title)]
  const optionInput = useInputs({ value: value })

  return (
    <>
      <BasicInput
        value={optionInput.value}
        onChange={async e => {
          optionInput.onChange(e)
          await changeOption({ title: FeatureUtil.optionTitle(title), option: e.target.value })
        }}
        suffix={null}
      />
    </>
  )
}

export const UserInput1 = ({
  defaultOption,
  options, // recommendError,// setApplyOption, // setPrevOptionState,
}: {
  defaultOption:
    | {
        [key: string]: string | undefined
      }
    | undefined
  options: FeatureOptionDto
  // recommendError: string
  // setApplyOption: Dispatch<
  //   SetStateAction<
  //     | {
  //         [key: string]: string | undefined
  //       }
  //     | undefined
  //   >
  // >
  // setPrevOptionState: Dispatch<
  //   SetStateAction<
  //     | {
  //         [key: string]: string | undefined
  //       }
  //     | undefined
  //   >
  // >
}) => {
  const defaultValue = defaultOption![FeatureUtil.optionTitle(options.title)]
  const optionInput = useInputs({ value: defaultValue })

  return (
    <Col>
      <Row className={styles.feature_product_type_header_wrapper}>
        <Row>
          <Col className={styles.nav_title}>{options.title}</Col>
          <FeaturePopover
            text={
              <div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: `1px solid red`,
                  }}
                >
                  asd
                </div>
                asdas
              </div>
            }
            width={200}
            placement={Placement.left}
          >
            <QuestionCircleOutlined className={styles.information_mark} />
          </FeaturePopover>
        </Row>
      </Row>
      <Row>
        <BasicInput
          value={optionInput.value}
          onChange={e => {
            // setApplyOption(option => {
            //   // setPrevOptionState(option)

            //   return {
            //     ...defaultOption,
            //     ...option,
            //     [options.title.replaceAll(" ", "").replaceAll("of", "Of")]: optionInput.value,
            //   }
            // })
            optionInput.onChange(e)
          }}
          suffix={null}
        />
      </Row>
    </Col>
  )
}
