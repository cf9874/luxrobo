import { imgAsset } from "@assets/image"
import Image from "next/image"
import { ReactNode } from "react"

export const ALERT_ICON: { [key: string]: ReactNode } = {
  success: <Image src={imgAsset.alertSuccess} alt="icon" width={45} height={40} />,
  warning: <Image src={imgAsset.alertWarning} alt="icon" width={45} height={40} />,
  info: <Image src={imgAsset.alertInfo} alt="icon" width={45} height={40} />,
  error: <Image src={imgAsset.alertError} alt="icon" width={45} height={40} />,
}
export const TITLE_COLOR: { [key: string]: string } = {
  success: "#3cc800",
  warning: "#ff9100",
  info: "#0078ff",
  error: "#e60000",
}
export const PROJECT_ALARM: {
  [key: number]: {
    kor: string
    eng: string
  }
} = {
  1: {
    kor: "해당 프로젝트의 부품 자동 배치가 완료 되었습니다.",
    eng: "Auto placement for the project has been completed.",
  },
  2: {
    kor: "해당 프로젝트의 회로 생성이 완료 되었습니다.",
    eng: "Auto Routing for the project has been completed.",
  },
  3: {
    kor: "해당 프로젝트의 주문이 접수되었습니다.",
    eng: "Your order for this project has been received.",
  },
  4: {
    kor: "해당 프로젝트의 부품이 모두 준비되었습니다.",
    eng: "All parts of the project are ready.",
  },
  5: {
    kor: "해당 프로젝트의 회로가 모두 제작되었습니다.",
    eng: "All circuits for the project have been built.",
  },
  6: {
    kor: "해당 프로젝트의 배송이 완료되었습니다.",
    eng: "The delivery of the project has completed.",
  },
}
export const PROJECT_ALERT: {
  [key: string]: {
    kor: string
    eng: string
  }
} = {
  S001: {
    kor: "성공적으로 복사되었습니다!",
    eng: "Successfully Copied!",
  },
  S002: {
    kor: "성공적으로 복제되었습니다!",
    eng: "Successfully Cloned!",
  },
  S003: {
    kor: "성공적으로 삭제되었습니다!",
    eng: "Successfully Deleted!",
  },
  S004: {
    kor: "성공적으로 추가되었습니다!",
    eng: "Successfully Added!",
  },
  S005: {
    kor: "성공적으로 변경되었습니다!",
    eng: "Successfully Changed!",
  },
  S006: {
    kor: "성공적으로 생성되었습니다!!",
    eng: "Successfully Created!",
  },
  S007: {
    kor: "부품 자동 배치가 완료되었습니다.",
    eng: "Auto-placement is completed.",
  },
  S008: {
    kor: "오토라우팅이 완료되었습니다.",
    eng: "Auto-Routing is completed.",
  },
  S009: {
    kor: "PCB 제작이 완료되었습니다.",
    eng: "PCB creation has been completed.",
  },
  S010: {
    kor: "저장되었습니다.",
    eng: "Save Success!",
  },
  S011: {
    kor: "부품이 변경되었습니다.",
    eng: "Part has been changed!",
  },
  I001: {
    kor: "현재 단일 MCU로 ESP32만 지원합니다.",
    eng: "Currnetly, Only ESP32 is supported with single MCU.",
  },
  I002: {
    kor: "MCU가 업그레이드 되었습니다.",
    eng: "Current MCU has been upgraded!",
  },
  I003: {
    kor: "MODI EDA가 부품을 추천합니다.",
    eng: "Part has been recommended by MODI EDA",
  },
  I004: {
    kor: "미배치 블록은 MODI EDA에서 자동으로 남은 영역에 배치합니다.",
    eng: "Unplaced blocks are automatically placed in the remaining areas by the MODI EDA.",
  },
  W001: {
    kor: "시스템 제공 블록을 임의로 변경한 경우, 예상치 못한 문제가 발생할 수 있습니다.",
    eng: "If you change system-provided blocks, unexpected issues may occur.",
  },
  E001: {
    kor: "MCU 핀이 부족하여 할당할 수 없습니다.",
    eng: "There are not enough MCU pins to assign.",
  },
  E002: {
    kor: "부품 간 충돌이 존재하여 배치를 완료할 수 없습니다!",
    eng: "A conflict between parts exists and the placement cannot be completed!",
  },
  E003: {
    kor: "보드를 벗어난 부품이 존재하여 배치를 완료할 수 없습니다!",
    eng: "Deployment cannot be completed because a part that is out of the board exists!",
  },
  E004: {
    kor: "남은 부품 자동 배치를 위한 보드의 남은 공간이 충분하지 않습니다!",
    eng: "There is not enough space left on the board for automatic placement of remaining parts!",
  },
}
