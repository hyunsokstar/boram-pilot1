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
  /** 탭 정렬 순서 (드래그 앤 드롭용) */
  order: number;
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
 * 탭 액션 인터페이스
 * 
 * @description 탭 조작을 위한 액션 함수들
 */
export interface TabActions {
  /** 새 탭 추가 */
  addTab: (tab: Omit<DynamicTab, 'order'>) => void;
  /** 탭 삭제 */
  removeTab: (tabId: string) => void;
  /** 활성 탭 설정 */
  setActiveTab: (tabId: string | null) => void;
  /** 탭 순서 변경 (드래그 앤 드롭용) */
  reorderTabs: (sourceIndex: number, destinationIndex: number) => void;
  /** 탭 정보 업데이트 */
  updateTab: (tabId: string, updates: Partial<DynamicTab>) => void;
}
