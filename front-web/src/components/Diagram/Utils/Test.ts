import { LayoutBoardDto, LogicCustomInitDto, LogicLinkDto, LogicPowerNetDto } from "apis/dto"

const blocks = [
  {
    block_id: "1",
    index: "1",

    category: "Input",
    color: "0xff0000",
    name: "none",
    description: "desc",
    footprint_image: "none",
    icon: "/icons/switch.svg",
    option_names: {
      additionalProp1: "empty",
      additionalProp2: "empty",
      additionalProp3: "empty",
    },
    part_id: "random",
    part_image: "none",
    part_name: "Part Name",
    specification: "spec",
    symbol_image: "none",
    type: "Switch",
  },
  {
    block_id: "2",
    index: "1",

    category: "Input",
    color: "0xff0000",
    name: "none",
    description: "desc",
    footprint_image: "none",
    icon: "/icons/gps.svg",
    option_names: {
      additionalProp1: "empty",
      additionalProp2: "empty",
      additionalProp3: "empty",
    },
    part_id: "random",
    part_image: "none",
    part_name: "Part Name",
    specification: "spec",
    symbol_image: "none",
    type: "GPS/GNSS",
  },
  {
    block_id: "3",
    index: "1",

    category: "Input",
    color: "0xff0000",
    name: "none",
    description: "desc",
    footprint_image: "none",
    icon: "/icons/inertial.svg",
    option_names: {
      additionalProp1: "empty",
      additionalProp2: "empty",
      additionalProp3: "empty",
    },
    part_id: "random",
    part_image: "none",
    part_name: "Part Name",
    specification: "spec",
    symbol_image: "none",
    type: "Inertial Sensor",
  },
  {
    block_id: "4",
    index: "1",

    category: "Comm",
    color: "0xff0000",
    name: "none",
    description: "desc",
    footprint_image: "none",
    icon: "/icons/lte.svg",
    option_names: {
      additionalProp1: "empty",
      additionalProp2: "empty",
      additionalProp3: "empty",
    },
    part_id: "random",
    part_image: "none",
    part_name: "Part Name",
    specification: "spec",
    symbol_image: "none",
    type: "LTE",
  },
  {
    block_id: "5",
    index: "1",

    category: "MCU",
    color: "0xff0000",
    name: "none",
    description: "desc",
    footprint_image: "none",
    icon: "/icons/mcu.svg",
    option_names: {
      additionalProp1: "empty",
      additionalProp2: "empty",
      additionalProp3: "empty",
    },
    part_id: "random",
    part_image: "none",
    part_name: "Part Name",
    specification: "spec",
    symbol_image: "none",
    type: "MCU 0",
  },
  {
    block_id: "6",
    index: "1",

    category: "Output",
    color: "0xff0000",
    name: "none",
    description: "desc",
    footprint_image: "none",
    icon: "/icons/led.svg",
    option_names: {
      additionalProp1: "empty",
      additionalProp2: "empty",
      additionalProp3: "empty",
    },
    part_id: "random",
    part_image: "none",
    part_name: "Part Name",
    specification: "spec",
    symbol_image: "none",
    type: "LED",
  },
  {
    block_id: "7",
    index: "1",

    category: "PowerIn",
    color: "0xff0000",
    name: "none",
    description: "desc",
    footprint_image: "none",
    icon: "/icons/cigarjack.svg",
    option_names: {
      additionalProp1: "empty",
      additionalProp2: "empty",
      additionalProp3: "empty",
    },
    part_id: "random",
    part_image: "none",
    part_name: "Part Name",
    specification: "spec",
    symbol_image: "none",
    type: "Cigar Jack",
  },
  {
    block_id: "8",
    index: "1",

    category: "Subpart",
    color: "0xff0000",
    name: "none",
    description: "desc",
    footprint_image: "none",
    icon: "/icons/power.svg",
    option_names: {
      additionalProp1: "empty",
      additionalProp2: "empty",
      additionalProp3: "empty",
    },
    part_id: "random",
    part_image: "none",
    part_name: "Part Name",
    specification: "spec",
    symbol_image: "none",
    type: "Power",
  },
  {
    block_id: "9",
    index: "1",

    category: "PowerOut",
    color: "0xff0000",
    name: "none",
    description: "desc",
    footprint_image: "none",
    icon: "/icons/usb.svg",
    option_names: {
      additionalProp1: "empty",
      additionalProp2: "empty",
      additionalProp3: "empty",
    },
    part_id: "random",
    part_image: "none",
    part_name: "Part Name",
    specification: "spec",
    symbol_image: "none",
    type: "USB",
  },
  {
    block_id: "10",
    index: "1",

    category: "Battery",
    color: "0xff0000",
    name: "none",
    description: "desc",
    footprint_image: "none",
    icon: "/icons/spc.svg",
    option_names: {
      additionalProp1: "empty",
      additionalProp2: "empty",
      additionalProp3: "empty",
    },
    part_id: "random",
    part_image: "none",
    part_name: "Part Name",
    specification: "spec",
    symbol_image: "none",
    type: "Super Capacitor",
  },
  {
    block_id: "11",
    index: "1",

    category: "Custom",
    color: "0x8b00ff",
    name: "Custom",
    description: "desc",
    footprint_image: "none",
    icon: "/icons/touch.svg",
    option_names: {
      additionalProp1: "empty",
      additionalProp2: "empty",
      additionalProp3: "empty",
    },
    part_id: "random",
    part_image: "none",
    part_name: "Part Name",
    specification: "spec",
    symbol_image: "none",
    type: "none",
  },
]

const logicJson = {
  blocks,
  links: [
    {
      block_id: "1",
      target_blocks: [
        {
          link_status: true,
          target_block_id: "5",
        },
      ],
      type: "...",
    },
    {
      block_id: "2",
      target_blocks: [
        {
          link_status: true,
          target_block_id: "5",
        },
      ],
      type: "...",
    },
    {
      block_id: "3",
      target_blocks: [
        {
          link_status: true,
          target_block_id: "5",
        },
      ],
      type: "...",
    },
    {
      block_id: "4",
      target_blocks: [
        {
          link_status: true,
          target_block_id: "5",
        },
      ],
      type: "...",
    },
    {
      block_id: "5",
      target_blocks: [
        {
          link_status: true,
          target_block_id: "1",
        },
        {
          link_status: true,
          target_block_id: "2",
        },
        {
          link_status: true,
          target_block_id: "3",
        },
        {
          link_status: true,
          target_block_id: "4",
        },
        {
          link_status: true,
          target_block_id: "6",
        },
        {
          link_status: true,
          target_block_id: "8",
        },
        {
          link_status: true,
          target_block_id: "Power",
        },
      ],
      type: "...",
    },
    {
      block_id: "6",
      target_blocks: [
        {
          link_status: true,
          target_block_id: "9",
        },
      ],
      type: "...",
    },
    {
      block_id: "7",
      target_blocks: [
        {
          link_status: true,
          target_block_id: "Power",
        },
      ],
      type: "...",
    },
    {
      block_id: "9",
      target_blocks: [
        {
          link_status: true,
          target_block_id: "Power",
        },
      ],
      type: "...",
    },
    {
      block_id: "10",
      target_blocks: [
        {
          link_status: true,
          target_block_id: "Power",
        },
      ],
      type: "...",
    },
    {
      block_id: "11",
      target_blocks: [
        {
          link_status: true,
          target_block_id: "5",
        },
      ],
      type: "...",
    },
  ],
}

const powerJson = {
  blocks,
  powernets: [
    {
      group: ["7"],
      net_name: "VIN",
      outputs: [
        {
          regulator_id: "101",
          target_net_name: "5.0V",
          type: "BUCK",
        }
      ],
      ref_voltage: 12,
    },
    {
      group: ["9"],
      net_name: "VIN2",
      outputs: [
        {
          regulator_id: "100",
          target_net_name: "VIN",
          type: "BUCK",
        }],
      ref_voltage: 12,
    },
    {
      group: ["6"],
      net_name: "5.0V",
      outputs: [
        {
          regulator_id: "102",
          target_net_name: "3.5V",
          type: "LDO",
        },
        {
          regulator_id: "103",
          target_net_name: "3.0V",
          type: "LDO",
        },
        {
          regulator_id: "104",
          target_net_name: "1.8V",
          type: "LDO",
        },
        {
          regulator_id: "105",
          target_net_name: "MCU0",
          type: "LDO",
        },
      ],
      ref_voltage: 5,
    },
    {
      group: ["4"],
      net_name: "3.5V",
      outputs: [],
      ref_voltage: 3.5,
    },
    {
      group: ["10"],
      net_name: "3.0V",
      outputs: [
        {
          regulator_id: "106",
          target_net_name: "5.0V",
          type: "Boost",
        },
      ],
      ref_voltage: 3,
    },
    {
      group: ["2"],
      net_name: "1.8V",
      outputs: [],
      ref_voltage: 1.8,
    },
    {
      group: ["3", "5"],
      net_name: "MCU0",
      outputs: [],
      ref_voltage: 1.8,
    },
    {
      group: ["1", "11"],
      net_name: "Sub_MCU0",
      outputs: [],
      ref_voltage: 1.8,
    },
  ],
}

const layoutJson = {
  blocks,
  layout: {
    hole_blocks: [],
    image_blocks: [],
    layout_blocks: [
      {
        block_id: "1",
        is_auto: false,
        is_placed: false,
        is_top: false,
        out_shape_b: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
        ],
        out_shape_t: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 69,
            r: 0,
          },
          {
            x: 0,
            y: 69,
            r: 0,
          },
        ],
        pos: {
          x: 0,
          y: 0,
          r: 0,
        },
      },
      {
        block_id: "2",
        is_auto: false,
        is_placed: false,
        is_top: false,
        out_shape_b: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
        ],
        out_shape_t: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 69,
            r: 0,
          },
          {
            x: 0,
            y: 69,
            r: 0,
          },
        ],
        pos: {
          x: 0,
          y: 0,
          r: 0,
        },
      },
      {
        block_id: "3",
        is_auto: false,
        is_placed: false,
        is_top: false,
        out_shape_b: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
        ],
        out_shape_t: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 69,
            r: 0,
          },
          {
            x: 0,
            y: 69,
            r: 0,
          },
        ],
        pos: {
          x: 0,
          y: 0,
          r: 0,
        },
      },
      {
        block_id: "4",
        is_auto: false,
        is_placed: false,
        is_top: false,
        out_shape_b: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 609,
            r: 0,
          },
        ],
        out_shape_t: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 69,
            r: 0,
          },
          {
            x: 0,
            y: 69,
            r: 0,
          },
        ],
        pos: {
          x: 0,
          y: 0,
          r: 0,
        },
      },
      {
        block_id: "5",
        is_auto: false,
        is_placed: false,
        is_top: false,
        out_shape_b: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
        ],
        out_shape_t: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 69,
            r: 0,
          },
          {
            x: 0,
            y: 69,
            r: 0,
          },
        ],
        pos: {
          x: 0,
          y: 0,
          r: 0,
        },
      },
      {
        block_id: "6",
        is_auto: false,
        is_placed: false,
        is_top: false,
        out_shape_b: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
        ],
        out_shape_t: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 69,
            r: 0,
          },
          {
            x: 0,
            y: 69,
            r: 0,
          },
        ],
        pos: {
          x: 0,
          y: 0,
          r: 0,
        },
      },
      {
        block_id: "7",
        is_auto: false,
        is_placed: false,
        is_top: false,
        out_shape_b: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
        ],
        out_shape_t: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 69,
            r: 0,
          },
          {
            x: 0,
            y: 69,
            r: 0,
          },
        ],
        pos: {
          x: 0,
          y: 0,
          r: 0,
        },
      },
      {
        block_id: "8",
        is_auto: false,
        is_placed: false,
        is_top: false,
        out_shape_b: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
        ],
        out_shape_t: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 69,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
        ],
        pos: {
          x: 0,
          y: 0,
          r: 0,
        },
      },
      {
        block_id: "9",
        is_auto: false,
        is_placed: true,
        is_top: false,
        out_shape_b: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
        ],
        out_shape_t: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 69,
            r: 0,
          },
          {
            x: 0,
            y: 69,
            r: 0,
          },
        ],
        pos: {
          x: 500,
          y: 200,
          r: 0,
        },
      },
      {
        block_id: "10",
        is_auto: false,
        is_placed: true,
        is_top: false,
        "out_shape_t": [
          {
            "x": -191.73399999999674,
            "y": -116.07099999999718,
            "r": 0
          },
          {
            "x": 191.7340000000013,
            "y": -116.07099999999718,
            "r": 0
          },
          {
            "x": 191.7340000000013,
            "y": 196.55300000000352,
            "r": 0
          },
          {
            "x": -191.73399999999674,
            "y": 196.55300000000352,
            "r": 0
          }
        ],
        "out_shape_b": [
          {
            "x": -191.73350000000028,
            "y": -112.47850000000199,
            "r": 0
          },
          {
            "x": 191.73350000000482,
            "y": -112.47850000000199,
            "r": 0
          },
          {
            "x": 191.73350000000482,
            "y": 128.8630000000012,
            "r": 0
          },
          {
            "x": -191.73350000000028,
            "y": 128.8630000000012,
            "r": 0
          }
        ],
        pos: {
          x: 300,
          y: 400,
          r: 0,
        },
      },
      {
        block_id: "11",
        is_auto: false,
        is_placed: true,
        is_top: true,
        out_shape_b: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 0,
            y: 0,
            r: 0,
          },
        ],
        out_shape_t: [
          {
            x: 0,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 0,
            r: 0,
          },
          {
            x: 61,
            y: 69,
            r: 0,
          },
          {
            x: 0,
            y: 69,
            r: 0,
          },
        ],
        pos: {
          x: 100,
          y: 400,
          r: 0,
        },
      },
    ],
    shape: [
      {
        x: 0,
        y: 150,
        r: 0,
      },
      {
        x: 800,
        y: 150,
        r: 0,
      },
      {
        x: 1000,
        y: 0,
        r: 0,
      },
      {
        x: 1600,
        y: 0,
        r: 0,
      },
      {
        x: 1600,
        y: 700,
        r: 0,
      },
      {
        x: 1000,
        y: 700,
        r: 0,
      },
      {
        x: 800,
        y: 550,
        r: 0,
      },
      {
        x: 0,
        y: 550,
        r: 0,
      }
    ],
    text_blocks: [],
  },
}

export class DiagTestUtil {
  static logicJson(): string {
    return JSON.stringify(logicJson)
  }

  static powerJson(): string {
    return JSON.stringify(powerJson)
  }

  static layoutJson(): string {
    return JSON.stringify(layoutJson)
  }
}
export class DiagUtil {
  static logicJson(json: { blocks: LogicCustomInitDto[]; links: LogicLinkDto[] }): string {
    return JSON.stringify(json)
  }

  //   static powerJson(powerJson: LogicPowerNetDto): string {
  static powerJson(json: { blocks: LogicCustomInitDto[]; powernets: LogicPowerNetDto[] }): string {
    return JSON.stringify(json)
  }

  static layoutJson(json: { blocks: LogicCustomInitDto[]; layout: LayoutBoardDto | undefined }): string {
    return JSON.stringify(json)
  }
}
