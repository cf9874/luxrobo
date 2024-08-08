import {
  ACCOUNT,
  COMPANY,
  COMPANYDETAIL,
  COMPANYNEW,
  CONTACT,
  CONTACTDETAIL,
  CUSTOM,
  CUSTOMDETAIL,
  CUSTOMNEW,
  HOME,
  PROJECT,
  PROJECTDETAIL,
  ORDER,
  ORDERDETAIL,
  SHIP,
  SHIPDETAIL,
  TEAM,
  TEAMDETAIL,
  TEAMNEW,
  PART,
  PARTDETAIL,
  PARTNEW,
  USER,
  USERDETAIL,
  USERNEW,
  VALID,
} from "./const.PageKey"

export const titleKeys = [
  HOME,
  VALID,
  ACCOUNT,
  USER,
  USERDETAIL,
  USERNEW,
  TEAM,
  TEAMDETAIL,
  TEAMNEW,
  PROJECT,
  PROJECTDETAIL,
  CUSTOM,
  CUSTOMDETAIL,
  CUSTOMNEW,
  PART,
  PARTDETAIL,
  PARTNEW,
  COMPANY,
  COMPANYDETAIL,
  COMPANYNEW,
  ORDER,
  ORDERDETAIL,
  SHIP,
  SHIPDETAIL,
  CONTACT,
  CONTACTDETAIL,
] as const

export type titleKey = (typeof titleKeys)[number]

export const pageTitle = {
  home: (
    <>
      <span>홈</span>
    </>
  ),
  valid: (
    <>
      <span>계정 관리&nbsp;</span>
      <span>&gt;&nbsp;계정 권한</span>
    </>
  ),
  account: (
    <>
      <span>계정 관리&nbsp;</span>
      <span>&gt;&nbsp;계정 정보</span>
    </>
  ),
  user: (
    <>
      <span>사용자 관리&nbsp;</span>
      <span>&gt;&nbsp;사용자 정보</span>
    </>
  ),
  userDetail: (
    <>
      <span>사용자 관리&nbsp;</span>
      <span>&gt;&nbsp;사용자 정보</span>
      <span>&gt;&nbsp;사용자 상세 정보</span>
    </>
  ),
  userNew: (
    <>
      <span>사용자 관리&nbsp;</span>
      <span>&gt;&nbsp;사용자 정보&nbsp;</span>
      <span>&gt;&nbsp;사용자 신규 등록</span>
    </>
  ),
  team: (
    <>
      <span>팀 관리&nbsp;</span>
      <span>&gt;&nbsp;팀 정보</span>
    </>
  ),
  teamDetail: (
    <>
      <span>팀 관리&nbsp;</span>
      <span>&gt;&nbsp;팀 정보&nbsp;</span>
      <span>&gt;&nbsp;팀 상세 정보</span>
    </>
  ),
  teamNew: (
    <>
      <span>팀 관리&nbsp;</span>
      <span>&gt;&nbsp;팀 정보&nbsp;</span>
      <span>&gt;&nbsp;팀 신규 등록</span>
    </>
  ),
  project: (
    <>
      <span>프로젝트 관리&nbsp;</span>
      <span>&gt;&nbsp;프로젝트 정보</span>
    </>
  ),
  projectDetail: (
    <>
      <span>프로젝트 관리&nbsp;</span>
      <span>&gt;&nbsp;프로젝트 정보&nbsp;</span>
      <span>&gt;&nbsp;프로젝트 상세 정보</span>
    </>
  ),
  custom: (
    <>
      <span>커스텀 블록 관리&nbsp;</span>
      <span>&gt;&nbsp;커스텀 블록 정보</span>
    </>
  ),
  customDetail: (
    <>
      <span>커스텀 블록 관리&nbsp;</span>
      <span>&gt;&nbsp;커스텀 블록 정보&nbsp;</span>
      <span>&gt;&nbsp;커스텀 블록 상세 정보</span>
    </>
  ),
  customNew: (
    <>
      <span>커스텀 블록 관리&nbsp;</span>
      <span>&gt;&nbsp;커스텀 블록 정보&nbsp;</span>
      <span>&gt;&nbsp;커스텀 블록 신규 등록</span>
    </>
  ),
  part: (
    <>
      <span>부품 관리&nbsp;</span>
      <span>&gt;&nbsp;부품 정보</span>
    </>
  ),
  partDetail: (
    <>
      <span>부품 관리&nbsp;</span>
      <span>&gt;&nbsp;부품 정보&nbsp;</span>
      <span>&gt;&nbsp;부품 상세 정보</span>
    </>
  ),
  partNew: (
    <>
      <span>부품 관리&nbsp;</span>
      <span>&gt;&nbsp;부품 정보&nbsp;</span>
      <span>&gt;&nbsp;부품 신규 등록</span>
    </>
  ),
  company: (
    <>
      <span>발주처 관리&nbsp;</span>
      <span>&gt;&nbsp;발주처 정보</span>
    </>
  ),
  companyDetail: (
    <>
      <span>발주처 관리&nbsp;</span>
      <span>&gt;&nbsp;발주처 정보&nbsp;</span>
      <span>&gt;&nbsp;발주처 상세 정보</span>
    </>
  ),
  companyNew: (
    <>
      <span>발주처 관리&nbsp;</span>
      <span>&gt;&nbsp;발주처 정보&nbsp;</span>
      <span>&gt;&nbsp;발주처 신규 등록</span>
    </>
  ),
  order: (
    <>
      <span>주문 관리&nbsp;</span>
      <span>&gt;&nbsp;주문 정보</span>
    </>
  ),
  orderDetail: (
    <>
      <span>주문 관리&nbsp;</span>
      <span>&gt;&nbsp;주문 정보&nbsp;</span>
      <span>&gt;&nbsp;주문 상세 정보</span>
    </>
  ),
  ship: (
    <>
      <span>배송 관리&nbsp;</span>
      <span>&gt;&nbsp;배송 정보</span>
    </>
  ),
  shipDetail: (
    <>
      <span>배송 관리&nbsp;</span>
      <span>&gt;&nbsp;배송 정보&nbsp;</span>
      <span>&gt;&nbsp;배송 상세 정보</span>
    </>
  ),
  contact: (
    <>
      <span>문의 관리&nbsp;</span>
      <span>&gt;&nbsp;문의 정보</span>
    </>
  ),
  contactDetail: (
    <>
      <span>문의 관리&nbsp;</span>
      <span>&gt;&nbsp;문의 정보&nbsp;</span>
      <span>&gt;&nbsp;문의 상세 정보</span>
    </>
  ),
}
