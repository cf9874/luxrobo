import { IOTypeOption, pinTypeOption } from "@const/dropdow.option.const"

export const NamingParamDropdown = () => {
  const pinType = pinTypeOption[0]
  const IOType = IOTypeOption![0]

  return (
    <select onChange={e => console.log(e.target.value)}>
      <option value="javascript">JavaScript</option>
      <option value="php">PHP</option>
      <option value="java">Java</option>
      <option value="golang">Golang</option>
      <option value="python">Python</option>
      <option value="c#">C#</option>
      <option value="C++">C++</option>
      <option value="erlang">Erlang</option>
    </select>
  )
}
