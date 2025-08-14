import { create } from 'zustand';
import { DynamicTab } from './types';

interface TabStore {
    tabs: DynamicTab[];
    activeTabId: string | null;

    // Actions
    addTab: (tab: Omit<DynamicTab, 'order'>) => void;
    removeTab: (tabId: string) => void;
    setActiveTab: (tabId: string | null) => void;
    reorderTabs: (sourceIndex: number, destinationIndex: number) => void;
    updateTab: (tabId: string, updates: Partial<DynamicTab>) => void;
    clearAllTabs: () => void;
    // Getter
    getSortedTabs: () => DynamicTab[];
}

export const useTabStore = create<TabStore>((set, get) => ({
    tabs: [],
    activeTabId: null,

    getSortedTabs: () => {
        const { tabs } = get();
        return tabs.sort((a, b) => a.order - b.order);
    },

    addTab: (newTab) => {
        const { tabs } = get();

        // 중복 탭 체크
        const existingTab = tabs.find(t => t.menuNo === newTab.menuNo);
        if (existingTab) {
            set({ activeTabId: existingTab.id });
            return;
        }

        const maxOrder = Math.max(...tabs.map(t => t.order), -1);
        const tabWithOrder: DynamicTab = {
            ...newTab,
            order: maxOrder + 1,
            isClosable: newTab.isClosable ?? true
        };

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
