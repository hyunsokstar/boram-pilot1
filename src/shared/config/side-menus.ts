export type { SideMenuItem } from "./common-nav-menus";
export { sideMenus } from "./common-nav-menus";

// 기존 유틸은 sideMenus 재사용
import type { SideMenuItem as _Side } from "./common-nav-menus";
import { sideMenus as _menus } from "./common-nav-menus";

export interface SideMenuResponse {
    rtnCode: string;
    rtnMessage: string;
    listAvailableMenus: _Side[];
}

// 특정 메뉴를 찾는 유틸리티 함수
export const findMenuByNo = (menuNo: string, menus: _Side[] = _menus): _Side | null => {
    for (const menu of menus) {
        if (menu.menuNo === menuNo) return menu;
        if (menu.subMenu.length > 0) {
            const found = findMenuByNo(menuNo, menu.subMenu);
            if (found) return found;
        }
    }
    return null;
};

// 메뉴 레벨별로 필터링
export const getMenusByLevel = (level: string, menus: _Side[] = _menus): _Side[] => {
    const result: _Side[] = [];
    const searchMenus = (list: _Side[]) => {
        list.forEach(menu => {
            if (menu.menuLevelCd === level) result.push(menu);
            if (menu.subMenu.length > 0) searchMenus(menu.subMenu);
        });
    };
    searchMenus(menus);
    return result;
};

// 현재 활성화된 메뉴의 경로(빵크럼프)
export const getMenuBreadcrumb = (menuNo: string, menus: _Side[] = _menus): _Side[] => {
    const path: _Side[] = [];
    const findPath = (list: _Side[], target: string, current: _Side[]): boolean => {
        for (const menu of list) {
            const newPath = [...current, menu];
            if (menu.menuNo === target) {
                path.push(...newPath);
                return true;
            }
            if (menu.subMenu.length > 0 && findPath(menu.subMenu, target, newPath)) {
                return true;
            }
        }
        return false;
    };
    findPath(menus, menuNo, []);
    return path;
};
