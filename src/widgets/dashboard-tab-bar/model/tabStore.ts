import { create } from 'zustand';
import { DynamicTab } from './types';

interface TabStore {
    tabs: DynamicTab[];
    activeTabId: string | null;
    // 각 영역별 활성 탭 추적을 위한 상태
    activeTabsByArea: Record<string, string | null>;

    // Actions
    addTab: (tab: Omit<DynamicTab, 'order'>) => void;
    removeTab: (tabId: string) => void;
    setActiveTab: (tabId: string | null) => void;
    reorderTabs: (sourceIndex: number, destinationIndex: number) => void;
    updateTab: (tabId: string, updates: Partial<DynamicTab>) => void;
    clearAllTabs: () => void;
    // 영역별 활성 탭 관리
    setActiveTabByArea: (area: string, tabId: string | null) => void;
    getAllActiveTabIds: () => (string | null)[];
    // 영역별 자동 활성 탭 설정
    ensureActiveTabsForAreas: (tabAreas: Record<string, { id: string; [key: string]: unknown }[]>) => void;
    // Getter
    getSortedTabs: () => DynamicTab[];
}

export const useTabStore = create<TabStore>((set, get) => ({
    tabs: [],
    activeTabId: null,
    activeTabsByArea: {},

    getSortedTabs: () => {
        const { tabs } = get();
        return tabs.sort((a, b) => a.order - b.order);
    },

    setActiveTabByArea: (area, tabId) => {
        set(state => ({
            activeTabsByArea: {
                ...state.activeTabsByArea,
                [area]: tabId
            }
        }));
    },

    getAllActiveTabIds: () => {
        const { activeTabsByArea } = get();
        return Object.values(activeTabsByArea).filter(tabId => tabId !== null);
    },

    ensureActiveTabsForAreas: (tabAreas) => {
        const { activeTabsByArea } = get();
        const updates: Record<string, string | null> = {};
        let hasUpdates = false;

        Object.entries(tabAreas).forEach(([area, areaTabs]) => {
            const currentActiveTab = activeTabsByArea[area];
            
            if (areaTabs && areaTabs.length > 0) {
                // 현재 활성 탭이 없거나, 활성 탭이 더 이상 해당 영역에 없는 경우
                if (!currentActiveTab || !areaTabs.find(tab => tab && tab.id === currentActiveTab)) {
                    const newActiveTab = areaTabs[0].id;
                    console.log(`Zustand: ${area} 영역에 자동 활성 탭 설정:`, newActiveTab);
                    updates[area] = newActiveTab;
                    hasUpdates = true;
                }
            }
        });

        if (hasUpdates) {
            set(state => ({
                activeTabsByArea: {
                    ...state.activeTabsByArea,
                    ...updates
                }
            }));
        }
    },

    addTab: (newTab) => {
        const { tabs } = get();

        // 중복 탭 체크 - 항상 새로 추가하도록 변경
        const existingTabIndex = tabs.findIndex(t => t.menuNo === newTab.menuNo);

        // 기존 탭이 있다면 제거하지 않고 활성화만
        if (existingTabIndex !== -1) {
            console.log('기존 탭 활성화:', newTab.menuNo);
            set({ activeTabId: tabs[existingTabIndex].id });
            return;
        }

        // 새 탭 추가
        const maxOrder = Math.max(...tabs.map(t => t.order), -1);
        const tabWithOrder: DynamicTab = {
            ...newTab,
            order: maxOrder + 1,
            isClosable: newTab.isClosable ?? true
        };

        console.log('새 탭 추가:', tabWithOrder);
        set({
            tabs: [...tabs, tabWithOrder],
            activeTabId: newTab.id
        });
    },

    removeTab: (tabId) => {
        const { tabs } = get();

        console.log('탭 삭제:', tabId);
        console.log('삭제 전 탭들:', tabs.map(t => ({ id: t.id, label: t.label })));

        // 단순히 탭만 삭제 (활성 탭 변경은 레이아웃에서 처리)
        const filteredTabs = tabs.filter(tab => tab.id !== tabId);

        console.log('삭제 후 탭들:', filteredTabs.map(t => ({ id: t.id, label: t.label })));

        set({
            tabs: filteredTabs
            // activeTabId는 여기서 변경하지 않음
        });
    },

    setActiveTab: (tabId) => {
        set({ activeTabId: tabId });
    },

    reorderTabs: (sourceIndex, destinationIndex) => {
        const { tabs } = get();
        const newTabs = Array.from(tabs);
        const [reorderedTab] = newTabs.splice(sourceIndex, 1);
        newTabs.splice(destinationIndex, 0, reorderedTab);

        // order 값 재조정
        const reorderedTabs = newTabs.map((tab, index) => ({
            ...tab,
            order: index
        }));

        set({ tabs: reorderedTabs });
    },

    updateTab: (tabId, updates) => {
        const { tabs } = get();
        const updatedTabs = tabs.map(tab =>
            tab.id === tabId ? { ...tab, ...updates } : tab
        );

        set({ tabs: updatedTabs });
    },

    clearAllTabs: () => {
        set({ tabs: [], activeTabId: null });
    }
}));
