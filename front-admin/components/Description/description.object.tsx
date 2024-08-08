import { ConfigProvider, Descriptions } from "antd"
import { IObjectDescriptionProps, defaultDescriptionInfo } from "./description.type"

export const ObjectDescription = (props: IObjectDescriptionProps) => {
  const { theme, descInfo, descDetails, data, render, renderIndex, ...newProps } = props

  if (data) {
    return (
      <ConfigProvider theme={{ token: { ...theme } }}>
        {(() => {
          if (typeof descInfo.title === "string") return <h3>{descInfo.title}</h3>
          return descInfo.title
        })()}
        <Descriptions column={descInfo.column} bordered {...newProps}>
          {descInfo.keys.map((item, index) => {
            if (Array.isArray(item)) {
              return (
                <Descriptions.Item
                  key={index}
                  span={descInfo.column}
                  labelStyle={{ display: "none" }}
                  contentStyle={{ width: "100%", padding: 0 }}
                >
                  <ObjectDescription
                    descInfo={
                      {
                        column: descInfo.column,
                        keys: item,
                        attribute: descInfo.attribute,
                      } as defaultDescriptionInfo
                    }
                    descDetails={descDetails}
                    data={data}
                    render={render}
                  ></ObjectDescription>
                </Descriptions.Item>
              )
            }
            return (
              <Descriptions.Item key={index} {...descDetails[item]}>
                <>
                  {(() => {
                    if (render) {
                      if (renderIndex) {
                        return render({
                          index: renderIndex,
                          key: item,
                          pm_value: data[item],
                        })
                      }

                      return render({
                        key: item,
                        pm_value: data[item],
                      })
                    }
                    if (typeof data[item] === "object" && !Array.isArray(data[item]) && data[item] !== null)
                      return <div>{JSON.stringify(data[item])}</div>
                    return <div>{data[item]}</div>
                  })()}
                </>
              </Descriptions.Item>
            )
          })}
        </Descriptions>
      </ConfigProvider>
    )
  }
  // [No Data]
  return (
    <ConfigProvider theme={{ token: { ...theme } }}>
      {(() => {
        if (typeof descInfo.title === "string") return <h3>{descInfo.title}</h3>
        return descInfo.title
      })()}
      <Descriptions column={descInfo.column} bordered>
        {descInfo.keys.map((item, index) => {
          if (Array.isArray(item)) {
            return (
              <>
                <Descriptions.Item
                  key={index}
                  span={descInfo.column}
                  labelStyle={{ display: "none" }}
                  contentStyle={{ width: "100%", padding: 0 }}
                >
                  <ObjectDescription
                    descInfo={
                      {
                        column: descInfo.column,
                        keys: item,
                        attribute: descInfo.attribute,
                      } as defaultDescriptionInfo
                    }
                    descDetails={descDetails}
                  ></ObjectDescription>
                </Descriptions.Item>
              </>
            )
          }
          return (
            <Descriptions.Item key={index} {...descDetails[item]}>
              <></>
            </Descriptions.Item>
          )
        })}
      </Descriptions>
    </ConfigProvider>
  )
}
