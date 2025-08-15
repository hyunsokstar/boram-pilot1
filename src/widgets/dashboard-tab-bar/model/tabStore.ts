// import { create } from 'zustand';
// import { DynamicTab, TabArea, TabAreas } from './types';

// interface TabStore {
//     // 영역별 탭 관리 (단순하게!)
//     tabAreas: TabAreas;
//     activeTabId: string | null;
//     activeTabsByArea: Record<TabArea, string | null>;

//     // 액션들
//     addTab: (tab: DynamicTab, targetArea?: TabArea) => void;
//     removeTab: (tabId: string) => void;
//     moveTab: (tabId: string, fromArea: TabArea, toArea: TabArea, targetIndex?: number) => void;
//     reorderTabsInArea: (area: TabArea, sourceIndex: number, destinationIndex: number) => void;
//     setActiveTab: (tabId: string | null) => void;
//     setActiveTabByArea: (area: TabArea, tabId: string | null) => void;
//     clearAllTabs: () => void;

//     // 헬퍼 함수들
//     getTabsForArea: (area: TabArea) => DynamicTab[];
//     getAllTabs: () => DynamicTab[];
//     getAllActiveTabIds: () => string[];
//     findTabById: (tabId: string) => { tab: DynamicTab; area: TabArea } | null;
// }

// export const useTabStore = create<TabStore>((set, get) => ({
//     tabAreas: {
//         left: [],
//         center: [],
//         right: []
//     },
//     activeTabId: null,
//     activeTabsByArea: {
//         left: null,
//         center: null,
//         right: null
//     },

//     // 탭 추가 (기본적으로 left 영역에)
//     addTab: (tab, targetArea = 'left') => {
//         // 중복 체크
//         const existingTab = get().findTabById(tab.id);
//         if (existingTab) {
//             console.log('기존 탭 활성화:', tab.label);
//             set({ activeTabId: tab.id });
//             get().setActiveTabByArea(existingTab.area, tab.id);
//             return;
//         }

//         // 메뉴 번호로 중복 체크
//         const allTabs = get().getAllTabs();
//         const duplicateTab = allTabs.find(t => t.menuNo === tab.menuNo);
//         if (duplicateTab) {
//             console.log('같은 메뉴 탭 활성화:', duplicateTab.label);
//             const existing = get().findTabById(duplicateTab.id);
//             if (existing) {
//                 set({ activeTabId: duplicateTab.id });
//                 get().setActiveTabByArea(existing.area, duplicateTab.id);
//             }
//             return;
//         }

//         // 새 탭을 해당 영역 끝에 추가
//         set(state => ({
//             tabAreas: {
//                 ...state.tabAreas,
//                 [targetArea]: [...state.tabAreas[targetArea], tab]
//             },
//             activeTabId: tab.id
//         }));

//         // 해당 영역의 활성 탭으로 설정
//         get().setActiveTabByArea(targetArea, tab.id);

//         console.log(`새 탭 추가: ${tab.label} → ${targetArea} 영역`);
//     },

//     // 탭 제거
//     removeTab: (tabId) => {
//         const tabInfo = get().findTabById(tabId);
//         if (!tabInfo) return;

//         const { area } = tabInfo;

//         set(state => {
//             const newTabAreas = { ...state.tabAreas };
//             newTabAreas[area] = newTabAreas[area].filter(tab => tab.id !== tabId);

//             const newActiveTabsByArea = { ...state.activeTabsByArea };
//             if (newActiveTabsByArea[area] === tabId) {
//                 // 같은 영역의 첫 번째 탭으로 변경
//                 newActiveTabsByArea[area] = newTabAreas[area].length > 0 ? newTabAreas[area][0].id : null;
//             }

//             return {
//                 tabAreas: newTabAreas,
//                 activeTabsByArea: newActiveTabsByArea,
//                 activeTabId: state.activeTabId === tabId ? (newActiveTabsByArea[area] || null) : state.activeTabId
//             };
//         });

//         console.log(`탭 제거: ${tabInfo.tab.label} from ${area}`);
//     },

//     // 탭 이동 (다른 영역으로)
//     moveTab: (tabId, fromArea, toArea, targetIndex) => {
//         const tabInfo = get().findTabById(tabId);
//         if (!tabInfo || tabInfo.area !== fromArea) return;

//         const { tab } = tabInfo;

//         set(state => {
//             const newTabAreas = { ...state.tabAreas };

//             // 원본 영역에서 제거
//             newTabAreas[fromArea] = newTabAreas[fromArea].filter(t => t.id !== tabId);

//             // 목표 영역에 추가
//             if (targetIndex !== undefined) {
//                 // 특정 위치에 삽입
//                 newTabAreas[toArea].splice(targetIndex, 0, tab);
//             } else {
//                 // 끝에 추가
//                 newTabAreas[toArea].push(tab);
//             }

//             return { tabAreas: newTabAreas };
//         });

//         // 이동된 탭을 해당 영역의 활성 탭으로 설정
//         get().setActiveTabByArea(toArea, tabId);

//         console.log(`탭 이동: ${tab.label} ${fromArea} → ${toArea}`);
//     },

//     // 같은 영역 내 순서 변경
//     reorderTabsInArea: (area, sourceIndex, destinationIndex) => {
//         set(state => {
//             const newTabAreas = { ...state.tabAreas };
//             const areaTabs = [...newTabAreas[area]];

//             // 배열 순서 변경
//             const [movedTab] = areaTabs.splice(sourceIndex, 1);
//             areaTabs.splice(destinationIndex, 0, movedTab);

//             newTabAreas[area] = areaTabs;

//             console.log(`${area} 영역 순서 변경: ${sourceIndex} → ${destinationIndex}`);

//             return { tabAreas: newTabAreas };
//         });
//     },

//     // 전역 활성 탭 설정
//     setActiveTab: (tabId) => {
//         set({ activeTabId: tabId });
//     },

//     // 영역별 활성 탭 설정
//     setActiveTabByArea: (area, tabId) => {
//         set(state => ({
//             activeTabsByArea: {
//                 ...state.activeTabsByArea,
//                 [area]: tabId
//             }
//         }));
//     },

//     // 모든 탭 제거
//     clearAllTabs: () => {
//         set({
//             tabAreas: { left: [], center: [], right: [] },
//             activeTabId: null,
//             activeTabsByArea: { left: null, center: null, right: null }
//         });
//     },

//     // 특정 영역의 탭들 반환
//     getTabsForArea: (area) => {
//         return get().tabAreas[area];
//     },

//     // 모든 탭 반환
//     getAllTabs: () => {
//         const { tabAreas } = get();
//         return [...tabAreas.left, ...tabAreas.center, ...tabAreas.right];
//     },

//     // 모든 활성 탭 ID들 반환
//     getAllActiveTabIds: () => {
//         const { activeTabsByArea } = get();
//         return Object.values(activeTabsByArea).filter(Boolean) as string[];
//     },

//     // 탭 ID로 탭과 영역 찾기
//     findTabById: (tabId) => {
//         const { tabAreas } = get();

//         for (const [area, tabs] of Object.entries(tabAreas) as [TabArea, DynamicTab[]][]) {
//             const tab = tabs.find(t => t.id === tabId);
//             if (tab) {
//                 return { tab, area };
//             }
//         }

//         return null;
//     }
// }));

import { create } from 'zustand';
import { DynamicTab, TabArea, TabAreas, SplitMode } from './types';

// localStorage 유틸리티 함수들
const STORAGE_KEY = 'dashboard-tab-store';

const saveToLocalStorage = (state: Partial<TabStore>) => {
    if (typeof window === 'undefined') return;
    try {
        const dataToSave = {
            tabAreas: state.tabAreas,
            activeTabId: state.activeTabId,
            activeTabsByArea: state.activeTabsByArea,
            splitMode: state.splitMode,
            timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        console.log('localStorage 저장:', dataToSave);
    } catch (error) {
        console.error('localStorage 저장 실패:', error);
    }
};

const loadFromLocalStorage = () => {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            console.log('localStorage 복원:', parsed);
            return parsed;
        }
    } catch (error) {
        console.error('localStorage 복원 실패:', error);
    }
    return null;
};

interface TabStore {
    // 영역별 탭 관리 (단순하게!)
    tabAreas: TabAreas;
    activeTabId: string | null;
    activeTabsByArea: Record<TabArea, string | null>;
    splitMode: SplitMode;

    // 액션들
    addTab: (tab: DynamicTab, targetArea?: TabArea) => void;
    removeTab: (tabId: string) => void;
    moveTab: (tabId: string, fromArea: TabArea, toArea: TabArea, targetIndex?: number) => void;
    reorderTabsInArea: (area: TabArea, sourceIndex: number, destinationIndex: number) => void;
    setActiveTab: (tabId: string | null) => void;
    setActiveTabByArea: (area: TabArea, tabId: string | null) => void;
    clearAllTabs: () => void;
    setSplitMode: (mode: SplitMode) => void;

    // 헬퍼 함수들
    getTabsForArea: (area: TabArea) => DynamicTab[];
    getAllTabs: () => DynamicTab[];
    getAllActiveTabIds: () => string[];
    findTabById: (tabId: string) => { tab: DynamicTab; area: TabArea } | null;
}

export const useTabStore = create<TabStore>((set, get) => {
    return {
        // 초기 상태 (기본값으로 시작)
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
        splitMode: 'single' as SplitMode,

        // 탭 추가 (기본적으로 left 영역에)
        addTab: (tab, targetArea = 'left') => {
            console.log('addTab 호출됨:', tab, targetArea);

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
            set(state => {
                console.log('상태 업데이트 전:', state.tabAreas);
                const newState = {
                    ...state,
                    tabAreas: {
                        ...state.tabAreas,
                        [targetArea]: [...state.tabAreas[targetArea], tab]
                    },
                    activeTabId: tab.id
                };
                console.log('상태 업데이트 후:', newState.tabAreas);

                // localStorage에 저장
                saveToLocalStorage(newState);

                return newState;
            });

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

                const newState = {
                    ...state,
                    tabAreas: newTabAreas,
                    activeTabsByArea: newActiveTabsByArea,
                    activeTabId: state.activeTabId === tabId ? (newActiveTabsByArea[area] || null) : state.activeTabId
                };

                // 가운데 영역의 마지막 탭이 제거되면 double 모드로 변경
                if (area === 'center' && newTabAreas.center.length === 0 && state.splitMode === 'triple') {
                    newState.splitMode = 'double';
                }

                // localStorage에 저장
                saveToLocalStorage(newState);

                return newState;
            });

            console.log(`탭 제거: ${tabInfo.tab.label} from ${area}`);
        },    // 탭 이동 (다른 영역으로)
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
            set((state) => {
                const newState = {
                    ...state,
                    activeTabId: tabId
                };

                // localStorage에 저장
                saveToLocalStorage(newState);

                return newState;
            });
        },

        // 영역별 활성 탭 설정
        setActiveTabByArea: (area, tabId) => {
            set(state => {
                const newState = {
                    ...state,
                    activeTabsByArea: {
                        ...state.activeTabsByArea,
                        [area]: tabId
                    }
                };

                // localStorage에 저장
                saveToLocalStorage(newState);

                return newState;
            });
        },

        // 모든 탭 제거
        clearAllTabs: () => {
            set(() => {
                const newState = {
                    tabAreas: { left: [], center: [], right: [] },
                    activeTabId: null,
                    activeTabsByArea: { left: null, center: null, right: null },
                    splitMode: 'single' as SplitMode
                };

                // localStorage에 저장
                saveToLocalStorage(newState);

                return newState;
            });
        },

        // 분할 모드 설정
        setSplitMode: (mode: SplitMode) => {
            set((state) => {
                const newState = {
                    ...state,
                    splitMode: mode
                };

                // localStorage에 저장
                saveToLocalStorage(newState);

                return newState;
            });
            console.log('분할 모드 변경:', mode);
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
    };
});

// 개발 환경에서 브라우저 콘솔 테스트용
if (typeof window !== 'undefined') {
    (window as typeof window & { testTabStore?: object }).testTabStore = {
        addTestTab: () => {
            const testTab = {
                id: `test-${Date.now()}`,
                label: `테스트 탭 ${Date.now()}`,
                href: `/test/${Date.now()}`,
                menuNo: 'TEST001',
            };
            useTabStore.getState().addTab(testTab, 'center');
            console.log('테스트 탭 추가됨:', testTab);
        },
        getState: () => {
            const state = useTabStore.getState();
            console.log('현재 상태:', {
                tabAreas: state.tabAreas,
                activeTabId: state.activeTabId,
                activeTabsByArea: state.activeTabsByArea
            });
            return state;
        },
        clearAll: () => {
            useTabStore.getState().clearAllTabs();
            console.log('모든 탭 제거됨');
        }
    };
}

// 클라이언트에서 localStorage 상태 복원
export const restoreFromLocalStorage = () => {
    if (typeof window === 'undefined') return;

    const savedState = loadFromLocalStorage();
    if (savedState) {
        const store = useTabStore.getState();

        // 저장된 상태로 복원
        useTabStore.setState({
            tabAreas: savedState.tabAreas || store.tabAreas,
            activeTabId: savedState.activeTabId || store.activeTabId,
            activeTabsByArea: savedState.activeTabsByArea || store.activeTabsByArea,
            splitMode: savedState.splitMode || store.splitMode
        });

        console.log('localStorage에서 상태 복원됨:', savedState);
    }
};
