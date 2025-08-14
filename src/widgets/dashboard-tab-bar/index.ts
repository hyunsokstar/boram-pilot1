/**
 * @fileoverview 대시보드 탭바 위젯 익스포트
 * @description 드래그 앤 드롭이 가능한 탭바 컴포넌트들
 */

export { default as TabBar } from './ui/tab-bar';
export { default as DynamicTab } from './ui/dynamic-tab';
export { default as DraggableTab } from './ui/draggable-tab';
export type { TabItem, TabBarProps } from './ui/tab-bar';
export { useTabStore } from './model/tabStore';
export type { DynamicTab as DynamicTabType, TabBarState, TabActions, DragEndEvent } from './model/types';
