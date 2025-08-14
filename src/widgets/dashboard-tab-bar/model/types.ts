export interface DynamicTab {
  id: string;
  label: string;
  href: string;
  menuNo: string;
  isClosable?: boolean;
  isActive?: boolean;
  order: number;
}

export interface TabBarState {
  tabs: DynamicTab[];
  activeTabId: string | null;
}

export interface TabActions {
  addTab: (tab: Omit<DynamicTab, 'order'>) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  reorderTabs: (sourceIndex: number, destinationIndex: number) => void;
  updateTab: (tabId: string, updates: Partial<DynamicTab>) => void;
}
