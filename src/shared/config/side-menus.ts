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

export interface SideMenuResponse {
    rtnCode: string;
    rtnMessage: string;
    listAvailableMenus: SideMenuItem[];
}

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
                menuHref: "/dashboard/member",
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
        menuHref: "/dashboard/member",
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
        menuHref: "/dashboard/system",
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

// 특정 메뉴를 찾는 유틸리티 함수
export const findMenuByNo = (menuNo: string, menus: SideMenuItem[] = sideMenus): SideMenuItem | null => {
    for (const menu of menus) {
        if (menu.menuNo === menuNo) {
            return menu;
        }
        if (menu.subMenu.length > 0) {
            const found = findMenuByNo(menuNo, menu.subMenu);
            if (found) return found;
        }
    }
    return null;
};

// 메뉴 레벨별로 필터링하는 함수
export const getMenusByLevel = (level: string, menus: SideMenuItem[] = sideMenus): SideMenuItem[] => {
    const result: SideMenuItem[] = [];
    
    const searchMenus = (menuList: SideMenuItem[]) => {
        menuList.forEach(menu => {
            if (menu.menuLevelCd === level) {
                result.push(menu);
            }
            if (menu.subMenu.length > 0) {
                searchMenus(menu.subMenu);
            }
        });
    };
    
    searchMenus(menus);
    return result;
};

// 현재 활성화된 메뉴의 경로를 반환하는 함수
export const getMenuBreadcrumb = (menuNo: string, menus: SideMenuItem[] = sideMenus): SideMenuItem[] => {
    const path: SideMenuItem[] = [];
    
    const findPath = (menuList: SideMenuItem[], targetMenuNo: string, currentPath: SideMenuItem[]): boolean => {
        for (const menu of menuList) {
            const newPath = [...currentPath, menu];
            
            if (menu.menuNo === targetMenuNo) {
                path.push(...newPath);
                return true;
            }
            
            if (menu.subMenu.length > 0) {
                if (findPath(menu.subMenu, targetMenuNo, newPath)) {
                    return true;
                }
            }
        }
        return false;
    };
    
    findPath(menus, menuNo, []);
    return path;
};
