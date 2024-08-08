import { IDiagVec2 } from "../Utils/Common"
import { DiagGeoUtil } from "../Utils/Geo";

interface IBlockBackImg {
  block: string
  line: string
  lineOffset: number
}

export enum EDiagCollisionDetectType {

  None,
  Block,
  Board
}

export interface IDiagCollisionDetectResult {

  type: EDiagCollisionDetectType;
  blockId1?: string;
  blockId2?: string;
}

export interface IDiagBlockInfoScheme {
  block_id: string
  index: string

  category: string
  name: string
  color: string
  description: string
  footprint_image: string
  icon: string
  option_names: {
    additionalProp1: string
    additionalProp2: string
    additionalProp3: string
  }
  part_id: string
  part_image: string
  part_name: string
  specification: string
  symbol_image: string
  type: string

  is_updated: boolean
}

interface IDiagTargetLinkInfoScheme {
  link_status: boolean
  target_block_id: string
}

export interface IDiagLinkInfoScheme {
  block_id: string
  target_blocks: IDiagTargetLinkInfoScheme[]
  type: string
}

export interface IDiagBlock {
  block_id: string
  index: string
  category: string
  name: string
  color: string
  part_id: string
  part_name: string
  icon: string
  type: string

  is_updated: boolean
}

interface IDiagPowerNetOutputInfoScheme {
  regulator_id: string
  target_net_name: string
  type: string
}

export interface IDiagPowerNetInfoScheme {
  group: string[]
  net_name: string
  outputs: IDiagPowerNetOutputInfoScheme[]
  ref_voltage: number
}

export interface ILayoutDiagPos extends IDiagVec2 {
  r: number
}

interface ILayoutDiagArea extends IDiagVec2 {
  width: number
  height: number
}

export interface ILayoutDiagHoleScheme {
  diameter: number
  pos: ILayoutDiagPos
}

export interface ILayoutDiagImageScheme {
  image_str: string
  is_top: boolean
  pos: ILayoutDiagPos
  width: number
  height: number
}

export interface ILayoutDiagBlockScheme {
  block_id: string
  is_auto: boolean
  is_conflict?: boolean
  is_escape?: boolean
  is_placed: boolean
  is_top: boolean
  out_shape_b: ILayoutDiagPos[]
  out_shape_t: ILayoutDiagPos[]
  pos: ILayoutDiagPos
}

export interface ILayoutDiagTextScheme {
  font_size: number
  is_top: boolean
  pos: ILayoutDiagPos
  string: string
  stroke_width: number
}

export interface IDiagLayoutInfoScheme {
  hole_blocks: ILayoutDiagHoleScheme[]
  image_blocks: ILayoutDiagImageScheme[]
  layout_blocks: ILayoutDiagBlockScheme[]
  shape: ILayoutDiagPos[]
  text_blocks: ILayoutDiagTextScheme[]
}

export interface IDiagLayoutBlock extends IDiagBlock {
  layoutInfo: ILayoutDiagBlockScheme
}

export enum DiagBlockCategory {
  Custom,
  Subpart,
  Input,
  Output,
  Battery,
  Comm,
  MCU,
  PowerIn,
  PowerOut,
  Power,
}

interface ICDInfo {

  id: string,
  isTop: boolean,
  doubleSided: boolean,
  points: IDiagVec2[] | undefined,
  backPoints: IDiagVec2[] | undefined
};

export class DiagBlockConst {
  static readonly remoteAssetPath = "https://dev-edaapi.luxrobo.com"

  static category(e: DiagBlockCategory): string {
    return DiagBlockCategory[e]
  }

  static lineColor(model: IDiagBlock): string | number {
    switch (model.category) {
      case DiagBlockConst.category(DiagBlockCategory.Custom):
        return model.color

      case DiagBlockConst.category(DiagBlockCategory.Subpart):
        return 0x45d6df

      case DiagBlockConst.category(DiagBlockCategory.Input):
        return 0x1aa7ff

      case DiagBlockConst.category(DiagBlockCategory.Output):
        return 0xff785c

      case DiagBlockConst.category(DiagBlockCategory.Battery):
        return 0x5ff053

      case DiagBlockConst.category(DiagBlockCategory.Comm):
        return 0xffc620

      case DiagBlockConst.category(DiagBlockCategory.MCU):
        return 0x1b3852

      case DiagBlockConst.category(DiagBlockCategory.PowerIn):
        return 0x595bfb

      case DiagBlockConst.category(DiagBlockCategory.PowerOut):
        return 0xf24463

      case DiagBlockConst.category(DiagBlockCategory.Power):
        return 0x45d6df
    }

    throw new Error(`Invalid block's category`)
  }

  static typeString(model: IDiagBlock): string {
    const type = model.type
    // const type = (model.category === DiagBlockConst.category(DiagBlockCategory.Custom)) ? (model.name) : (model.type);

    const sep = 12

    if (type.length < 12) {
      return type
    }

    const fields = type.split(" ")
    if (fields.length < 2) {
      console.warn(`Invalid block's type`)
      return type
    }

    let n = fields[1]
    if (fields.length > 2) {
      if (n.length < sep - 3) {
        n = `${n}...`
      } else {
        n = `${n.slice(0, n.length - 3)}...`
      }
    }

    return `${fields[0]}\n${n}`
  }

  static isDoubleSided(t: ILayoutDiagBlockScheme): boolean {
    return t.out_shape_b[2].x > 0
  }

  static defBackImg(): IBlockBackImg {
    return DiagBlockConst._backImg("active", -2)
  }

  static clickBackImg(): IBlockBackImg {
    return DiagBlockConst._backImg("click", -4)
  }

  private static _backImg(state: string, lineOffset: number): IBlockBackImg {
    return {
      block: `block_${state}`,
      line: `line_${state}`,
      lineOffset,
    }
  }

  static remoteImageUrl(name: string): string {
    return `${DiagBlockConst.remoteAssetPath}${name}`
    // return DiagUtil._imageUrl(DiagBlockConst.remoteAssetPath, name);
  }

  static calcArea(isFront: boolean, model: IDiagLayoutBlock): ILayoutDiagArea {
    return isFront || !DiagBlockConst.isDoubleSided(model.layoutInfo)
      ? {
          x:
            (model.layoutInfo.out_shape_t[2].x - model.layoutInfo.out_shape_t[0].x) / 2 +
            model.layoutInfo.out_shape_t[0].x,
          y:
            (model.layoutInfo.out_shape_t[2].y - model.layoutInfo.out_shape_t[0].y) / 2 +
            model.layoutInfo.out_shape_t[0].y,
          width: model.layoutInfo.out_shape_t[2].x - model.layoutInfo.out_shape_t[0].x,
          height: model.layoutInfo.out_shape_t[2].y - model.layoutInfo.out_shape_t[0].y,
        }
      : {
          x:
            (model.layoutInfo.out_shape_b[2].x - model.layoutInfo.out_shape_b[0].x) / 2 +
            model.layoutInfo.out_shape_b[0].x,
          y:
            (model.layoutInfo.out_shape_b[2].y - model.layoutInfo.out_shape_b[0].y) / 2 +
            model.layoutInfo.out_shape_b[0].y,
          width: model.layoutInfo.out_shape_b[2].x - model.layoutInfo.out_shape_b[0].x,
          height: model.layoutInfo.out_shape_b[2].y - model.layoutInfo.out_shape_b[0].y,
        }
  }

  static calcArea4CD(isFront: boolean, model: IDiagLayoutBlock): ILayoutDiagArea {

    return isFront || !DiagBlockConst.isDoubleSided(model.layoutInfo)
      ? {
          x: model.layoutInfo.out_shape_t[0].x,
          y: model.layoutInfo.out_shape_t[0].y,
          width: model.layoutInfo.out_shape_t[2].x - model.layoutInfo.out_shape_t[0].x,
          height: model.layoutInfo.out_shape_t[2].y - model.layoutInfo.out_shape_t[0].y,
        }
      : {
          x: model.layoutInfo.out_shape_b[0].x,
          y:  model.layoutInfo.out_shape_b[0].y,
          width: model.layoutInfo.out_shape_b[2].x - model.layoutInfo.out_shape_b[0].x,
          height: model.layoutInfo.out_shape_b[2].y - model.layoutInfo.out_shape_b[0].y,
        }

  };

  static testCD(blocks: IDiagLayoutBlock[], board: IDiagVec2[]): IDiagCollisionDetectResult {

    const cp = (b: IDiagLayoutBlock, isFront: boolean = true) => {

      const area = DiagBlockConst.calcArea4CD(isFront, b);
      const center = { x: area.x + (area.width / 2), y: area.y + (area.height / 2) };
      return DiagBlockConst.convertPointsForWn(b.layoutInfo.pos, area).map((v) => (DiagGeoUtil.rotate(v, center, b.layoutInfo.pos.r)));
    }

    const blockPoints = blocks.map((v) => {

      const doubleSided = DiagBlockConst.isDoubleSided(v.layoutInfo);
      const points = (v.layoutInfo.is_top) ? (cp(v)) : ((doubleSided) ? (cp(v, false)) : (undefined));
      const backPoints = (!v.layoutInfo.is_top) ?  (cp(v)) : ((doubleSided) ? (cp(v, false)) : (undefined));

      return {
        id: v.block_id,
        isTop: v.layoutInfo.is_top,
        doubleSided,
        points,
        backPoints 
      }
    });

    // CAUTION: Outside 용도는 이걸 쓰면 안됨. (아래 isOutside 사용)
    const isInside = (v1: IDiagVec2[], v2: IDiagVec2[]) => {

      for (let i = 0; i < (v1.length - 1); ++i) {

        if (DiagGeoUtil.wnPnPoly(v1[i], v2) > 0) {
          
          return true;
        }
      }

      return false;
    }

    const isOutside = (v1: IDiagVec2[], v2: IDiagVec2[]) => {

      for (let i = 0; i < (v1.length - 1); ++i) {

        if (DiagGeoUtil.wnPnPoly(v1[i], v2) < 1) {
          
          return true;
        }
      }

      return false;
    }

    const test = (targets: ICDInfo[], getP: (t: ICDInfo) => (IDiagVec2[] | undefined)) => {

      for (const b of targets) {

        for (const t of targets) {

          if (b.id === t.id) {
            continue;
          }

          const v1 = getP(b);
          const v2 = getP(t);
          if ((!v1) || (!v2)) {
            throw new Error(`Invalid Proc!`);
          }
  
          if (isInside(v1, v2)) {

            console.log(v1, v2, b, t);
            return { a: b, b: t };
          }
        }
      }

      return undefined;
    }

    const top = blockPoints.filter((v) => (v.points));
    let rt = test(top, (t) => (t.points));
    if (rt) {
      return {
        type: EDiagCollisionDetectType.Block,
        blockId1: rt.a.id,
        blockId2: rt.b.id
      };
    }
    
    const bottom = blockPoints.filter((v) => (v.backPoints));
    rt = test(bottom, (t) => (t.backPoints));
    if (rt) {
      return {
        type: EDiagCollisionDetectType.Block,
        blockId1: rt.a.id,
        blockId2: rt.b.id
      };
    }

    const test2 = (targets: ICDInfo[], points: IDiagVec2[], getP: (t: ICDInfo) => (IDiagVec2[] | undefined)) => {

      for (const b of targets) {

        const c = getP(b);
        if (!c) {
          throw new Error(`Invalid Proc!!`);
        }

        if (isOutside(c, points)) {
          console.log(c, points);
          return b;
        }
      }

      return undefined;
    };

    const cb = [...board, board[0]];
    let rt2 = test2(top, cb, (t) => (t.points));
    if (rt2) {
      return {
        type: EDiagCollisionDetectType.Board,
        blockId1: rt2.id,
        blockId2: undefined
      };
    }

    rt2 = test2(bottom, cb, (t) => (t.backPoints));
    if (rt2) {
      return {
        type: EDiagCollisionDetectType.Board,
        blockId1: rt2.id,
        blockId2: undefined
      };
    }

    return {
      type: EDiagCollisionDetectType.None
    }
  }

  static getCellOffset(pos: IDiagVec2, interval: number) {
    const x = -(pos.x % interval)
    const y = -(pos.y % interval)

    return { x, y }
  }

  private static convertPoints(v: IDiagVec2, area: ILayoutDiagArea): IDiagVec2[] {

    const x = v.x + area.x;
    const y = v.y + area.y;

    return [
      { x, y },
      { x: x + area.width, y },
      { x: x + area.width, y: y + area.height },
      { x, y: y + area.height }
    ];
  }

  private static convertPointsForWn(v: IDiagVec2, area: ILayoutDiagArea): IDiagVec2[] {

    const p = DiagBlockConst.convertPoints(v, area);
    return [...p, p[0]];
  }
}
