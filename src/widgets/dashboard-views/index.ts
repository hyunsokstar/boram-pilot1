"use client";

import type { ComponentType } from "react";
import { MemberView } from "./member";
import { PaymentView } from "./payment";
import SystemDashboardView from "./system";
import { makeScaffoldView } from "./scaffold";

// 미구현 화면은 스캐폴드로 제공, 구현되면 해당 View로 교체
const OrganizationView = makeScaffoldView("조직/인사 관리", "조직 구조와 인사 관리를 위한 화면입니다.");
const HrView = makeScaffoldView("인사관리", "인사 관련 기능 화면입니다.");
const SalesView = makeScaffoldView("영업 관리", "영업 활동과 실적 관리를 위한 화면입니다.");
const PurchaseView = makeScaffoldView("구매/재고", "구매 및 재고 관리를 위한 화면입니다.");
const CRMView = makeScaffoldView("CRM 관리", "고객 관계 관리를 위한 화면입니다.");
const EventView = makeScaffoldView("행사 관리", "행사 관련 기능 화면입니다.");

// System subgroup
const SystemCommonCodeView = makeScaffoldView("시스템 > 공통코드관리");
const SystemFinanceCodeView = makeScaffoldView("시스템 > 금융코드관리");
const SystemRegionCodeView = makeScaffoldView("시스템 > 권역코드관리");
const SystemProgramView = makeScaffoldView("시스템 > 프로그램관리");
const SystemMenuView = makeScaffoldView("시스템 > 메뉴관리");
const SystemBizPartnerView = makeScaffoldView("시스템 > 거래처관리");
const SystemCompanyConfigView = makeScaffoldView("시스템 > 회사기준설정관리");
const SystemMessageTemplateView = makeScaffoldView("시스템 > 메세지템플릿관리");
const SystemUserView = makeScaffoldView("시스템 > 사용자관리");
const SystemUserPermissionView = makeScaffoldView("시스템 > 권한별사용자관리");

export type ViewMap = Record<string, ComponentType>;

// key는 "/dashboard/" 이후의 경로 (선행/후행 슬래시 제거)
export const views: ViewMap = {
  "member": MemberView,
  "payment": PaymentView,
  "organization": OrganizationView,
  "hr": HrView,
  "sales": SalesView,
  "purchase": PurchaseView,
  "crm": CRMView,
  "event": EventView,
  // system
  "system": SystemDashboardView,
  "system/common-code": SystemCommonCodeView,
  "system/finance-code": SystemFinanceCodeView,
  "system/region-code": SystemRegionCodeView,
  "system/program": SystemProgramView,
  "system/menu": SystemMenuView,
  "system/business-partner": SystemBizPartnerView,
  "system/company-config": SystemCompanyConfigView,
  "system/message-template": SystemMessageTemplateView,
  "system/user": SystemUserView,
  "system/user-permission": SystemUserPermissionView,
};
