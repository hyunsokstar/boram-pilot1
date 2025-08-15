"use client";

import React from 'react';
import { MemberView } from './member';
import { PaymentView } from './payment';
import { makeScaffoldView } from './scaffold';

// href 경로 일부를 키로 사용해 간단 매핑
// Scaffolded views for routes without dedicated components yet
const OrganizationView = makeScaffoldView('조직/인사 관리', '조직 구조와 인사 관리를 위한 화면입니다.');
const HrView = makeScaffoldView('인사관리', '인사 관련 기능 화면입니다.');
const SalesView = makeScaffoldView('영업 관리', '영업 활동과 실적 관리를 위한 화면입니다.');
const PurchaseView = makeScaffoldView('구매/재고', '구매 및 재고 관리를 위한 화면입니다.');
const CRMView = makeScaffoldView('CRM 관리', '고객 관계 관리를 위한 화면입니다.');
const EventView = makeScaffoldView('행사 관리', '행사 관련 기능 화면입니다.');

// System subgroup scaffolds
const SystemCommonCodeView = makeScaffoldView('시스템 > 공통코드관리');
const SystemFinanceCodeView = makeScaffoldView('시스템 > 금융코드관리');
const SystemRegionCodeView = makeScaffoldView('시스템 > 권역코드관리');
const SystemProgramView = makeScaffoldView('시스템 > 프로그램관리');
const SystemMenuView = makeScaffoldView('시스템 > 메뉴관리');
const SystemBizPartnerView = makeScaffoldView('시스템 > 거래처관리');
const SystemCompanyConfigView = makeScaffoldView('시스템 > 회사기준설정관리');
const SystemMessageTemplateView = makeScaffoldView('시스템 > 메세지템플릿관리');
const SystemUserView = makeScaffoldView('시스템 > 사용자관리');
const SystemUserPermissionView = makeScaffoldView('시스템 > 권한별사용자관리');

const viewMap: Array<{ match: RegExp; Comp: React.ComponentType }> = [
    { match: /\/dashboard\/member$/i, Comp: MemberView },
    { match: /\/dashboard\/payment$/i, Comp: PaymentView },
    { match: /\/dashboard\/organization$/i, Comp: OrganizationView },
    { match: /\/dashboard\/hr$/i, Comp: HrView },
    { match: /\/dashboard\/sales$/i, Comp: SalesView },
    { match: /\/dashboard\/purchase$/i, Comp: PurchaseView },
    { match: /\/dashboard\/crm$/i, Comp: CRMView },
    { match: /\/dashboard\/event$/i, Comp: EventView },
    // system
    { match: /\/dashboard\/system\/common-code$/i, Comp: SystemCommonCodeView },
    { match: /\/dashboard\/system\/finance-code$/i, Comp: SystemFinanceCodeView },
    { match: /\/dashboard\/system\/region-code$/i, Comp: SystemRegionCodeView },
    { match: /\/dashboard\/system\/program$/i, Comp: SystemProgramView },
    { match: /\/dashboard\/system\/menu$/i, Comp: SystemMenuView },
    { match: /\/dashboard\/system\/business-partner$/i, Comp: SystemBizPartnerView },
    { match: /\/dashboard\/system\/company-config$/i, Comp: SystemCompanyConfigView },
    { match: /\/dashboard\/system\/message-template$/i, Comp: SystemMessageTemplateView },
    { match: /\/dashboard\/system\/user$/i, Comp: SystemUserView },
    { match: /\/dashboard\/system\/user-permission$/i, Comp: SystemUserPermissionView },
];

export function resolveViewByHref(href?: string): React.ComponentType | null {
    if (!href) return null;
    const found = viewMap.find(v => v.match.test(href));
    return found ? found.Comp : null;
}
