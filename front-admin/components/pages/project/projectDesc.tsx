import { defaultDescriptionInfo } from "@/components/Description"

//------------------------------------------------------------------------------------------------------
export const ProjectDesc = {
  descA: {
    column: 2,
    keys: ["title", "owner", "created_at", "updated_at", "workspace", "active_user"],
  } as defaultDescriptionInfo,
  descB: {
    title: "기능 / 부품 리스트",
    keys: ["index", "type", "part_name", "version", "cost", "part_id"],
  },
  descC: {
    title: "Files",
    column: 2,
    keys: [
      "project_file",
      "projectFileBtn",
      "schematics_file",
      "schematicFileBtn",
      "pcb_board_file",
      "PCBBoardFileBtn",
    ],
  } as defaultDescriptionInfo,
}

//------------------------------------------------------------------------------------------------------
export const ProjectDescDetail = {
  // A
  title: { label: "이름", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  owner: { label: "작성자", labelStyle: { width: "25%" }, contentStyle: { width: "25%" } },
  created_at: { label: "생성일" },
  updated_at: { label: "최종 수정일" },
  workspace: { label: "소속 작업 공간" },
  active_user: { label: "현재 접속자" },
  // B
  index: { label: "No.", align: "center" },
  type: { label: "기능 분류", align: "center" },
  part_name: { label: "부품명", align: "center" },
  version: { label: "부품 버전", align: "center" },
  cost: { label: "가격", align: "center" },
  part_id: { label: "부품 상세 정보 보기", align: "center" },
  // C
  project_file: { label: "Project File", labelStyle: { width: "25%" }, contentStyle: { width: "50%" } },
  schematics_file: { label: "Schematics File" },
  pcb_board_file: { label: "PCB Board File" },
  projectFileBtn: { labelStyle: { display: "none" }, contentStyle: { width: "25%", textAlign: "center" } },
  schematicFileBtn: { labelStyle: { display: "none" }, contentStyle: { width: "25%", textAlign: "center" } },
  PCBBoardFileBtn: { labelStyle: { display: "none" }, contentStyle: { width: "25%", textAlign: "center" } },
}
