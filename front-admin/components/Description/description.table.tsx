import { ConfigProvider, Descriptions } from "antd"
import { ITableDescriptionProps, defaultDescriptionInfo } from "./description.type"
import { ObjectDescription } from "./description.object"

export const TableDescription = (props: ITableDescriptionProps) => {
  // console.log("props.data", props.data)
  if (props.data) {
    return (
      <ConfigProvider theme={{ token: { ...props.theme } }}>
        {(() => {
          if (typeof props.descInfo.title === "string") return <h3>{props.descInfo.title}</h3>
          return props.descInfo.title
        })()}
        {props.data.map((dataItem, idx) => {
          return (
            <Descriptions key={idx} column={props.descInfo.column} bordered {...props.descInfo.attribute}>
              {props.descInfo.keys.map((item, index) => {
                if (Array.isArray(item)) {
                  return (
                    <>
                      <Descriptions.Item
                        key={index}
                        span={props.descInfo.column}
                        labelStyle={{ display: "none" }}
                        contentStyle={{ width: "100%", padding: 0 }}
                      >
                        <ObjectDescription
                          descInfo={
                            {
                              column: props.descInfo.column,
                              keys: item,
                              attribute: props.descInfo.attribute,
                            } as defaultDescriptionInfo
                          }
                          descDetails={props.descDetails}
                          data={dataItem}
                          render={props.render}
                          renderIndex={idx}
                        ></ObjectDescription>
                      </Descriptions.Item>
                    </>
                  )
                }
                return (
                  <Descriptions.Item key={index} {...props.descDetails[item]}>
                    <>
                      {(() => {
                        if (props.render) {
                          return props.render({
                            index: idx,
                            key: item,
                            pm_value: dataItem[item],
                          })
                        }

                        //
                        if (
                          typeof dataItem[item] === "object" &&
                          !Array.isArray(dataItem[item]) &&
                          dataItem[item] !== null
                        )
                          return <div>{JSON.stringify(dataItem[item])}</div>
                        return <div>{dataItem[item]}</div>
                      })()}
                    </>
                  </Descriptions.Item>
                )
              })}
            </Descriptions>
          )
        })}
      </ConfigProvider>
    )
  }
  // [No Data]
  return (
    <ConfigProvider theme={{ token: { ...props.theme } }}>
      {(() => {
        if (typeof props.descInfo.title === "string") return <h3>{props.descInfo.title}</h3>
        return props.descInfo.title
      })()}
      <Descriptions column={props.descInfo.column} bordered>
        {props.descInfo.keys.map((item, index) => {
          if (Array.isArray(item)) {
            return (
              <>
                <Descriptions.Item
                  key={index}
                  span={props.descInfo.column}
                  labelStyle={{ display: "none" }}
                  contentStyle={{ width: "100%", padding: 0 }}
                >
                  <ObjectDescription
                    descInfo={
                      {
                        column: props.descInfo.column,
                        keys: item,
                        attribute: props.descInfo.attribute,
                      } as defaultDescriptionInfo
                    }
                    descDetails={props.descDetails}
                  ></ObjectDescription>
                </Descriptions.Item>
              </>
            )
          }
          return (
            <Descriptions.Item key={index} {...props.descDetails[item]}>
              <></>
            </Descriptions.Item>
          )
        })}
      </Descriptions>
    </ConfigProvider>
  )
}
