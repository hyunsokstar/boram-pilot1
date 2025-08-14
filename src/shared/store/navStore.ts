import { create } from "zustand";
import { sideMenus, type SideMenuItem } from "@/shared/config/common-nav-menus";

type NavState = {
  expanded: Set<string>;
  activeTopNo: string | null;
  activeLeafNo: string | null;
  filteredTopNo: string | null; // 헤더에서 선택된 최상위 메뉴
  toggle: (menuNo: string) => void;
  openTop: (menuNo: string) => void;
  setFromPath: (path: string) => void;
  setFilteredTop: (menuNo: string | null) => void; // 필터링 설정
};

function findBestMatchByPath(path: string) {
  let bestMatch: { menu: SideMenuItem | null; depth: number; pathLength: number } = {
    menu: null,
    depth: 0,
    pathLength: 0,
  };
  let expandChain: SideMenuItem[] = [];

  const dfs = (node: SideMenuItem, chain: SideMenuItem[], depth: number) => {
    const nextChain = [...chain, node];
    const href = node.menuHref?.trim() || "";

    // 경로가 정확히 매칭되는 경우만 처리
    if (href && path === href) {
      // 정확한 매칭이 가장 우선
      bestMatch = { menu: node, depth, pathLength: href.length };
      expandChain = nextChain;
    } else if (href && path.startsWith(href) && href.length > bestMatch.pathLength) {
      // startsWith 매칭은 더 긴 경로가 우선
      bestMatch = { menu: node, depth, pathLength: href.length };
      expandChain = nextChain;
    }

    if (node.subMenu) {
      node.subMenu.forEach((child) => dfs(child, nextChain, depth + 1));
    }
  };

  sideMenus.forEach((top) => dfs(top, [], 0));

  return { activeMenu: bestMatch.menu, chain: expandChain };
}

export const useNavStore = create<NavState>((set) => ({
  expanded: new Set<string>(["MNU100"]),
  activeTopNo: null,
  activeLeafNo: null,
  filteredTopNo: null,

  toggle: (menuNo) =>
    set((s) => {
      const next = new Set(s.expanded);
      if (next.has(menuNo)) {
        next.delete(menuNo);
      } else {
        next.add(menuNo);
      }
      return { expanded: next };
    }),

  openTop: (menuNo) =>
    set((s) => {
      const next = new Set(s.expanded);
      next.add(menuNo);
      return { expanded: next, activeTopNo: menuNo };
    }),

  setFilteredTop: (menuNo) =>
    set(() => ({
      filteredTopNo: menuNo,
    })),

  setFromPath: (path: string) =>
    set((s) => {
      const { activeMenu, chain } = findBestMatchByPath(path);
      const next = new Set(s.expanded);

      // 체인의 모든 상위 메뉴 확장
      chain.forEach((menu) => next.add(menu.menuNo));

      const topNo = chain.length > 0 ? chain[0].menuNo : null;
      const leafNo = activeMenu?.menuNo || null;

      return {
        expanded: next,
        activeTopNo: topNo,
        activeLeafNo: leafNo,
      };
    }),
}));