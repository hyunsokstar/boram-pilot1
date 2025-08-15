import { create } from 'zustand';
import { DynamicTab, TabArea, TabAreas } from './types';

interface TabStore {
    // 영역별 탭 관리 (단순하게!)
    tabAreas: TabAreas;
    activeTabId: string | null;
    activeTabsByArea: Record<TabArea, string | null>;

    // 액션들
    addTab: (tab: DynamicTab, targetArea?: TabArea) => void;
    removeTab: (tabId: string) => void;
    moveTab: (tabId: string, fromArea: TabArea, toArea: TabArea, targetIndex?: number) => void;
    reorderTabsInArea: (area: TabArea, sourceIndex: number, destinationIndex: number) => void;
    setActiveTab: (tabId: string | null) => void;
    setActiveTabByArea: (area: TabArea, tabId: string | null) => void;
    clearAllTabs: () => void;
    
    // 헬퍼 함수들
    getTabsForArea: (area: TabArea) => DynamicTab[];
    getAllTabs: () => DynamicTab[];
    getAllActiveTabIds: () => string[];
    findTabById: (tabId: string) => { tab: DynamicTab; area: TabArea } | null;
}

export const useTabStore = create<TabStore>((set, get) => ({
    tabAreas: {
        left: [],
        center: [],
        right: []
    },
    activeTabId: null,
    activeTabsByArea: {
        left: null,
        center: null,
        right: null
    },

    // 탭 추가 (기본적으로 left 영역에)
    addTab: (tab, targetArea = 'left') => {
        // 중복 체크
        const existingTab = get().findTabById(tab.id);
        if (existingTab) {
            console.log('기존 탭 활성화:', tab.label);
            set({ activeTabId: tab.id });
            get().setActiveTabByArea(existingTab.area, tab.id);
            return;
        }

        // 메뉴 번호로 중복 체크
        const allTabs = get().getAllTabs();
        const duplicateTab = allTabs.find(t => t.menuNo === tab.menuNo);
        if (duplicateTab) {
            console.log('같은 메뉴 탭 활성화:', duplicateTab.label);
            const existing = get().findTabById(duplicateTab.id);
            if (existing) {
                set({ activeTabId: duplicateTab.id });
                get().setActiveTabByArea(existing.area, duplicateTab.id);
            }
            return;
        }

        // 새 탭을 해당 영역 끝에 추가
        set(state => ({
            tabAreas: {
                ...state.tabAreas,
                [targetArea]: [...state.tabAreas[targetArea], tab]
            },
            activeTabId: tab.id
        }));

        // 해당 영역의 활성 탭으로 설정
        get().setActiveTabByArea(targetArea, tab.id);
        
        console.log(`새 탭 추가: ${tab.label} → ${targetArea} 영역`);
    },

    // 탭 제거
    removeTab: (tabId) => {
        const tabInfo = get().findTabById(tabId);
        if (!tabInfo) return;

        const { area } = tabInfo;
        
        set(state => {
            const newTabAreas = { ...state.tabAreas };
            newTabAreas[area] = newTabAreas[area].filter(tab => tab.id !== tabId);
            
            const newActiveTabsByArea = { ...state.activeTabsByArea };
            if (newActiveTabsByArea[area] === tabId) {
                // 같은 영역의 첫 번째 탭으로 변경
                newActiveTabsByArea[area] = newTabAreas[area].length > 0 ? newTabAreas[area][0].id : null;
            }

            return {
                tabAreas: newTabAreas,
                activeTabsByArea: newActiveTabsByArea,
                activeTabId: state.activeTabId === tabId ? (newActiveTabsByArea[area] || null) : state.activeTabId
            };
        });

        console.log(`탭 제거: ${tabInfo.tab.label} from ${area}`);
    },

    // 탭 이동 (다른 영역으로)
    moveTab: (tabId, fromArea, toArea, targetIndex) => {
        const tabInfo = get().findTabById(tabId);
        if (!tabInfo || tabInfo.area !== fromArea) return;

        const { tab } = tabInfo;

        set(state => {
            const newTabAreas = { ...state.tabAreas };
            
            // 원본 영역에서 제거
            newTabAreas[fromArea] = newTabAreas[fromArea].filter(t => t.id !== tabId);
            
            // 목표 영역에 추가
            if (targetIndex !== undefined) {
                // 특정 위치에 삽입
                newTabAreas[toArea].splice(targetIndex, 0, tab);
            } else {
                // 끝에 추가
                newTabAreas[toArea].push(tab);
            }

            return { tabAreas: newTabAreas };
        });

        // 이동된 탭을 해당 영역의 활성 탭으로 설정
        get().setActiveTabByArea(toArea, tabId);
        
        console.log(`탭 이동: ${tab.label} ${fromArea} → ${toArea}`);
    },

    // 같은 영역 내 순서 변경
    reorderTabsInArea: (area, sourceIndex, destinationIndex) => {
        set(state => {
            const newTabAreas = { ...state.tabAreas };
            const areaTabs = [...newTabAreas[area]];
            
            // 배열 순서 변경
            const [movedTab] = areaTabs.splice(sourceIndex, 1);
            areaTabs.splice(destinationIndex, 0, movedTab);
            
            newTabAreas[area] = areaTabs;
            
            console.log(`${area} 영역 순서 변경: ${sourceIndex} → ${destinationIndex}`);
            
            return { tabAreas: newTabAreas };
        });
    },

    // 전역 활성 탭 설정
    setActiveTab: (tabId) => {
        set({ activeTabId: tabId });
    },

    // 영역별 활성 탭 설정
    setActiveTabByArea: (area, tabId) => {
        set(state => ({
            activeTabsByArea: {
                ...state.activeTabsByArea,
                [area]: tabId
            }
        }));
    },

    // 모든 탭 제거
    clearAllTabs: () => {
        set({
            tabAreas: { left: [], center: [], right: [] },
            activeTabId: null,
            activeTabsByArea: { left: null, center: null, right: null }
        });
    },

    // 특정 영역의 탭들 반환
    getTabsForArea: (area) => {
        return get().tabAreas[area];
    },

    // 모든 탭 반환
    getAllTabs: () => {
        const { tabAreas } = get();
        return [...tabAreas.left, ...tabAreas.center, ...tabAreas.right];
    },

    // 모든 활성 탭 ID들 반환
    getAllActiveTabIds: () => {
        const { activeTabsByArea } = get();
        return Object.values(activeTabsByArea).filter(Boolean) as string[];
    },

    // 탭 ID로 탭과 영역 찾기
    findTabById: (tabId) => {
        const { tabAreas } = get();
        
        for (const [area, tabs] of Object.entries(tabAreas) as [TabArea, DynamicTab[]][]) {
            const tab = tabs.find(t => t.id === tabId);
            if (tab) {
                return { tab, area };
            }
        }
        
        return null;
    }
}));
