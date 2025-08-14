export interface SideMenuItem {
  menuNo: string;
  menuNm: string;
  upperMenuNo: string;
  menuLevelCd: string;
  menuSeCd: string;
  menuIconUrl: string;
  menuHref: string;
  subMenu: SideMenuItem[];
}

// Header에서 사용할 타입
export interface HeaderMenuItem {
  id: string;
  label: string;
  href: string;      // 최상위가 '펼침만'이면 빈 문자열
  menuNo: string;
  iconUrl?: string;  // ← 아이콘 경로 복구용
}

// 최상위 트리
export const sideMenus: SideMenuItem[] = [
  {
    menuNo: "MNU100",
    menuNm: "조직/사원",
    upperMenuNo: "MNU000",
    menuLevelCd: "1",
    menuSeCd: "M",
    menuIconUrl: "/header-menu/MNU100.svg",
    menuHref: "",
    subMenu: [
      {
        menuNo: "MNU110",
        menuNm: "조직관리",
        upperMenuNo: "MNU100",
        menuLevelCd: "2",
        menuSeCd: "M",
        menuIconUrl: "",
        menuHref: "/dashboard/organization",
        subMenu: []
      },
      {
        menuNo: "MNU120",
        menuNm: "인사관리",
        upperMenuNo: "MNU100",
        menuLevelCd: "2",
        menuSeCd: "M",
        menuIconUrl: "",
        // FIX: 중복 경로 제거 - 회원/계약만 /dashboard/member 사용
        menuHref: "/dashboard/hr", // 별도 인사관리 페이지 경로로 변경
        subMenu: []
      }
    ]
  },
  {
    menuNo: "MNU200",
    menuNm: "회원/계약",
    upperMenuNo: "MNU000",
    menuLevelCd: "1",
    menuSeCd: "M",
    menuIconUrl: "/header-menu/MNU200.svg",
    menuHref: "/dashboard/member", // 회원/계약만 이 경로 사용
    subMenu: []
  },
  {
    menuNo: "MNU300",
    menuNm: "수납",
    upperMenuNo: "MNU000",
    menuLevelCd: "1",
    menuSeCd: "M",
    menuIconUrl: "/header-menu/MNU300.svg",
    menuHref: "/dashboard/payment",
    subMenu: []
  },
  {
    menuNo: "MNU400",
    menuNm: "영업관리",
    upperMenuNo: "MNU000",
    menuLevelCd: "1",
    menuSeCd: "M",
    menuIconUrl: "/header-menu/MNU400.svg",
    menuHref: "/dashboard/sales",
    subMenu: []
  },
  {
    menuNo: "MNU500",
    menuNm: "행사",
    upperMenuNo: "MNU000",
    menuLevelCd: "1",
    menuSeCd: "M",
    menuIconUrl: "/header-menu/MNU500.svg",
    menuHref: "/dashboard/event",
    subMenu: []
  },
  {
    menuNo: "MNU600",
    menuNm: "구매/재고",
    upperMenuNo: "MNU000",
    menuLevelCd: "1",
    menuSeCd: "M",
    menuIconUrl: "/header-menu/MNU600.svg",
    menuHref: "/dashboard/purchase",
    subMenu: []
  },
  {
    menuNo: "MNU700",
    menuNm: "CRM",
    upperMenuNo: "MNU000",
    menuLevelCd: "1",
    menuSeCd: "M",
    menuIconUrl: "/header-menu/MNU700.svg",
    menuHref: "/dashboard/crm",
    subMenu: []
  },
  {
    menuNo: "MNU900",
    menuNm: "시스템관리",
    upperMenuNo: "MNU000",
    menuLevelCd: "1",
    menuSeCd: "M",
    menuIconUrl: "/header-menu/MNU900.svg",
    // FIX: 페이지 아님 → 펼침만
    menuHref: "",
    subMenu: [
      {
        menuNo: "MNU910",
        menuNm: "기준정보",
        upperMenuNo: "MNU900",
        menuLevelCd: "2",
        menuSeCd: "M",
        menuIconUrl: "",
        menuHref: "",
        subMenu: [
          {
            menuNo: "MNU911",
            menuNm: "공통코드관리",
            upperMenuNo: "MNU910",
            menuLevelCd: "3",
            menuSeCd: "P",
            menuIconUrl: "",
            menuHref: "/dashboard/system/common-code",
            subMenu: []
          },
          {
            menuNo: "MNU912",
            menuNm: "금융코드관리",
            upperMenuNo: "MNU910",
            menuLevelCd: "3",
            menuSeCd: "P",
            menuIconUrl: "",
            menuHref: "/dashboard/system/finance-code",
            subMenu: []
          },
          {
            menuNo: "MNU913",
            menuNm: "권역코드관리",
            upperMenuNo: "MNU910",
            menuLevelCd: "3",
            menuSeCd: "P",
            menuIconUrl: "",
            menuHref: "/dashboard/system/region-code",
            subMenu: []
          }
        ]
      },
      {
        menuNo: "MNU920",
        menuNm: "운영관리",
        upperMenuNo: "MNU900",
        menuLevelCd: "2",
        menuSeCd: "M",
        menuIconUrl: "",
        menuHref: "",
        subMenu: [
          {
            menuNo: "MNU921",
            menuNm: "프로그램관리",
            upperMenuNo: "MNU920",
            menuLevelCd: "3",
            menuSeCd: "P",
            menuIconUrl: "",
            menuHref: "/dashboard/system/program",
            subMenu: []
          },
          {
            menuNo: "MNU922",
            menuNm: "메뉴관리",
            upperMenuNo: "MNU920",
            menuLevelCd: "3",
            menuSeCd: "P",
            menuIconUrl: "",
            menuHref: "/dashboard/system/menu",
            subMenu: []
          },
          {
            menuNo: "MNU923",
            menuNm: "거래처관리",
            upperMenuNo: "MNU920",
            menuLevelCd: "3",
            menuSeCd: "P",
            menuIconUrl: "",
            menuHref: "/dashboard/system/business-partner",
            subMenu: []
          },
          {
            menuNo: "MNU924",
            menuNm: "회사기준설정관리",
            upperMenuNo: "MNU920",
            menuLevelCd: "3",
            menuSeCd: "P",
            menuIconUrl: "",
            menuHref: "/dashboard/system/company-config",
            subMenu: []
          },
          {
            menuNo: "MNU925",
            menuNm: "메세지템플릿관리",
            upperMenuNo: "MNU920",
            menuLevelCd: "3",
            menuSeCd: "P",
            menuIconUrl: "",
            menuHref: "/dashboard/system/message-template",
            subMenu: []
          }
        ]
      },
      {
        menuNo: "MNU930",
        menuNm: "사용자및권한관리",
        upperMenuNo: "MNU900",
        menuLevelCd: "2",
        menuSeCd: "M",
        menuIconUrl: "",
        menuHref: "",
        subMenu: [
          {
            menuNo: "MNU931",
            menuNm: "사용자관리",
            upperMenuNo: "MNU930",
            menuLevelCd: "3",
            menuSeCd: "P",
            menuIconUrl: "",
            menuHref: "/dashboard/system/user",
            subMenu: []
          },
          {
            menuNo: "MNU932",
            menuNm: "권한별사용자관리",
            upperMenuNo: "MNU930",
            menuLevelCd: "3",
            menuSeCd: "P",
            menuIconUrl: "",
            menuHref: "/dashboard/system/user-permission",
            subMenu: []
          }
        ]
      }
    ]
  }
];

// 펼침만 하는 최상위
export const openOnlyTopMenuNos = new Set<string>(["MNU900"]);

// 최초 이동 경로
export const firstLeafHref = (menu: SideMenuItem): string => {
  const q: SideMenuItem[] = [menu];
  while (q.length) {
    const cur = q.shift()!;
    if (cur.menuHref && cur.menuHref.trim() !== "") return cur.menuHref;
    if (cur.subMenu?.length) q.unshift(...cur.subMenu);
  }
  return "";
};

// 현재 경로가 속한 최상위
export const findTopByPath = (path: string): SideMenuItem | undefined => {
  const contains = (n: SideMenuItem): boolean =>
    (!!n.menuHref && path.startsWith(n.menuHref)) || (n.subMenu?.some(contains) ?? false);
  return sideMenus.find(contains);
};

// 헤더 메뉴(아이콘 포함)
export const headerMenus: HeaderMenuItem[] = sideMenus
  .filter(m => m.menuLevelCd === "1")
  .map(m => ({
    id: m.menuNo,
    label: m.menuNm,
    href: openOnlyTopMenuNos.has(m.menuNo) ? "" : (m.menuHref?.trim() || firstLeafHref(m)),
    menuNo: m.menuNo,
    iconUrl: m.menuIconUrl || undefined
  }));

export const NAV_OPEN_TOP_EVENT = "nav:open-top";
export type NavOpenTopDetail = { menuNo: string };