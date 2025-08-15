/**
 * 동적 탭 인터페이스
 * 
 * @description 탭바에서 사용되는 개별 탭의 데이터 구조
 * @example
 * ```typescript
 * const tab: DynamicTab = {
 *   id: 'MNU100',
 *   label: '조직/사원',
 *   href: '/dashboard/organization',
 *   menuNo: 'MNU100',
 *   isClosable: true,
 *   order: 0
 * };
 * ```
 */
import type { ComponentType } from 'react';

export interface DynamicTab {
  /** 탭의 고유 식별자 */
  id: string;
  /** 탭에 표시될 라벨 텍스트 */
  label: string;
  /** 탭 클릭 시 이동할 경로 */
  href: string;
  /** 메뉴 번호 (사이드바 연동용) */
  menuNo: string;
  /** 탭 닫기 버튼 표시 여부 */
  isClosable?: boolean;
  /** 탭 활성화 상태 (UI용, 실제 상태는 store에서 관리) */
  isActive?: boolean;
  /** 스플릿 본문에서 렌더할 뷰 컴포넌트 (클라이언트 전용) */
  view?: ComponentType;
}

/**
 * 탭바 상태 인터페이스
 * 
 * @description Zustand 스토어에서 관리하는 탭바의 전체 상태
 */
export interface TabBarState {
  /** 등록된 모든 탭들 */
  tabs: DynamicTab[];
  /** 현재 활성화된 탭의 ID */
  activeTabId: string | null;
}

/**
 * 드래그 앤 드롭 관련 타입들
 * dnd-kit의 타입과 호환되도록 정의
 */
import type { DragEndEvent as DndKitDragEndEvent } from '@dnd-kit/core';

export type DragEndEvent = DndKitDragEndEvent;

/**
 * 탭 영역 타입
 * 
 * @description 탭이 위치할 수 있는 영역들
 */
export type TabArea = 'left' | 'center' | 'right';

/**
 * 분할 모드 타입
 * 
 * @description 탭 영역의 분할 상태
 */
export type SplitMode = 'single' | 'double' | 'triple';

/**
 * 탭 영역별 데이터 구조
 * 
 * @description 각 영역에 속한 탭들을 관리하는 구조
 */
export interface TabAreas {
  /** 왼쪽 영역 탭들 */
  left: DynamicTab[];
  /** 가운데 영역 탭들 (3분할일 때만 사용) */
  center: DynamicTab[];
  /** 오른쪽 영역 탭들 */
  right: DynamicTab[];
}

/**
 * 탭 그룹 상태 인터페이스
 * 
 * @description 분할된 탭 영역들의 전체 상태
 */
export interface TabGroupState {
  /** 현재 분할 모드 */
  splitMode: SplitMode;
  /** 각 영역별 탭들 */
  areas: TabAreas;
  /** 현재 활성화된 탭 ID */
  activeTabId: string | null;
  /** 각 영역별 활성 탭 ID */
  activeTabByArea: Record<TabArea, string | null>;
}

/**
 * 탭 액션 인터페이스
 * 
 * @description 탭 조작을 위한 액션 함수들
 */
export interface TabActions {
  /** 새 탭 추가 */
  addTab: (tab: Omit<DynamicTab, 'order'>, area?: TabArea) => void;
  /** 탭 삭제 */
  removeTab: (tabId: string) => void;
  /** 활성 탭 설정 */
  setActiveTab: (tabId: string | null, area?: TabArea) => void;
  /** 탭 순서 변경 (같은 영역 내) */
  reorderTabs: (sourceIndex: number, destinationIndex: number, area: TabArea) => void;
  /** 탭을 다른 영역으로 이동 */
  moveTabToArea: (tabId: string, fromArea: TabArea, toArea: TabArea, targetIndex?: number) => void;
  /** 분할 모드 변경 */
  setSplitMode: (mode: SplitMode) => void;
  /** 탭 정보 업데이트 */
  updateTab: (tabId: string, updates: Partial<DynamicTab>) => void;
}
