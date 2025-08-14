# Dashboard Tab Bar Widget

드래그 앤 드롭이 가능한 동적 탭바 위젯

## 📋 목차

- [기능 개요](#기능-개요)
- [컴포넌트 구조](#컴포넌트-구조)
- [사용법](#사용법)
- [API 문서](#api-문서)
- [커스터마이징](#커스터마이징)
- [개발 가이드](#개발-가이드)

## 🎯 기능 개요

### 주요 기능
- ✅ **동적 탭 관리**: 탭 추가/삭제 기능
- ✅ **드래그 앤 드롭**: 탭 순서 변경 가능
- ✅ **상태 관리**: Zustand를 이용한 전역 상태 관리
- ✅ **접근성**: 키보드 네비게이션 및 스크린 리더 지원
- ✅ **반응형**: 모바일/데스크톱 대응
- ✅ **헤더 연동**: 헤더 메뉴 클릭 시 자동 탭 추가

### 기술 스택
- **React 18**: 컴포넌트 기반 UI
- **TypeScript**: 타입 안전성
- **dnd-kit**: 드래그 앤 드롭 기능
- **Zustand**: 상태 관리
- **Tailwind CSS**: 스타일링

## 🏗️ 컴포넌트 구조

```
src/widgets/dashboard-tab-bar/
├── ui/
│   ├── tab-bar.tsx          # 메인 탭바 컨테이너
│   ├── dynamic-tab.tsx      # 기본 탭 컴포넌트
│   └── draggable-tab.tsx    # 드래그 가능한 탭 컴포넌트
├── model/
│   ├── tabStore.ts          # Zustand 스토어
│   └── types.ts             # TypeScript 타입 정의
└── index.ts                 # 익스포트 인터페이스
```

## 🚀 사용법

### 기본 사용법

```tsx
import { TabBar } from '@/widgets/dashboard-tab-bar';

function MyComponent() {
  const tabs = [
    { id: '1', label: '조직/사원', href: '/org' },
    { id: '2', label: '회원/계약', href: '/member' }
  ];

  return (
    <TabBar
      tabs={tabs}
      activeTab="1"
      onTabChange={(tabId) => console.log('탭 변경:', tabId)}
      onTabClose={(tabId) => console.log('탭 닫기:', tabId)}
      onTabReorder={(from, to) => console.log('순서 변경:', from, to)}
    />
  );
}
```

### Zustand 스토어 사용

```tsx
import { useTabStore } from '@/widgets/dashboard-tab-bar';

function Dashboard() {
  const { 
    tabs, 
    activeTabId, 
    addTab, 
    removeTab, 
    setActiveTab,
    reorderTabs 
  } = useTabStore();

  const handleAddTab = () => {
    addTab({
      id: 'new-tab',
      label: '새 탭',
      href: '/new',
      menuNo: 'MNU999',
      isClosable: true
    });
  };

  return (
    <div>
      <button onClick={handleAddTab}>탭 추가</button>
      <TabBar
        tabs={tabs}
        activeTab={activeTabId}
        onTabChange={setActiveTab}
        onTabClose={removeTab}
        onTabReorder={reorderTabs}
      />
    </div>
  );
}
```

## 📚 API 문서

### TabBar Props

| 속성 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `tabs` | `TabItem[]` | ✅ | 표시할 탭 목록 |
| `activeTab` | `string` | ❌ | 현재 활성 탭 ID |
| `onTabChange` | `(tabId: string) => void` | ❌ | 탭 클릭 시 호출 |
| `onTabClose` | `(tabId: string) => void` | ❌ | 탭 닫기 시 호출 |
| `onTabReorder` | `(from: number, to: number) => void` | ❌ | 탭 순서 변경 시 호출 |
| `className` | `string` | ❌ | 추가 CSS 클래스 |

### TabItem 인터페이스

```typescript
interface TabItem {
  id: string;           // 고유 식별자
  label: string;        // 탭 라벨
  href?: string;        // 이동할 경로
  menuNo?: string;      // 메뉴 번호
  isClosable?: boolean; // 닫기 가능 여부
  order?: number;       // 정렬 순서
}
```

### Zustand Store 액션

```typescript
interface TabActions {
  addTab: (tab: Omit<DynamicTab, 'order'>) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string | null) => void;
  reorderTabs: (sourceIndex: number, destinationIndex: number) => void;
  updateTab: (tabId: string, updates: Partial<DynamicTab>) => void;
  clearAllTabs: () => void;
  getSortedTabs: () => DynamicTab[];
}
```

## 🎨 커스터마이징

### 스타일 커스터마이징

```tsx
<TabBar
  className="custom-tab-bar"
  tabs={tabs}
  // ... 기타 props
/>
```

```css
.custom-tab-bar {
  /* 커스텀 스타일 */
  border-bottom: 2px solid #e5e7eb;
}

.custom-tab-bar .tab-item {
  /* 개별 탭 스타일 */
}
```

### 드래그 동작 커스터마이징

```tsx
// 드래그 시 최소 거리 설정
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10, // 10px 이동 후 드래그 시작
    },
  })
);
```

## 🛠️ 개발 가이드

### 새로운 탭 타입 추가

1. `types.ts`에서 `DynamicTab` 인터페이스 확장
2. `tabStore.ts`에서 해당 타입 처리 로직 추가
3. 필요시 새로운 탭 컴포넌트 생성

### 드래그 제약 조건 추가

```tsx
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

<DndContext
  modifiers={[restrictToVerticalAxis]} // 수직 드래그만 허용
  // ... 기타 props
>
```

### 접근성 개선

```tsx
// ARIA 라벨 추가
<nav 
  role="tablist"
  aria-label="대시보드 탭 네비게이션"
>
  {tabs.map((tab) => (
    <div
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${tab.id}`}
      key={tab.id}
    >
      {tab.label}
    </div>
  ))}
</nav>
```

## 🐛 디버깅 팁

### 드래그가 작동하지 않을 때

1. **센서 설정 확인**: `activationConstraint` 값이 너무 큰지 확인
2. **CSS 충돌**: `pointer-events: none` 등의 CSS가 적용되어 있는지 확인
3. **이벤트 전파**: `stopPropagation()`이 드래그를 방해하는지 확인

### 탭 순서가 저장되지 않을 때

1. **스토어 연결**: `onTabReorder` 핸들러가 올바르게 연결되어 있는지 확인
2. **order 필드**: 탭 데이터에 `order` 필드가 포함되어 있는지 확인
3. **정렬 함수**: `getSortedTabs()`가 올바르게 작동하는지 확인

## 📝 변경 로그

### v1.1.0 - 드래그 앤 드롭 추가
- ✅ dnd-kit을 이용한 드래그 앤 드롭 기능 구현
- ✅ 드래그 중 시각적 피드백 개선
- ✅ 키보드 접근성 지원 추가
- ✅ 타입 안전성 강화

### v1.0.0 - 초기 버전
- ✅ 기본 탭바 기능 구현
- ✅ Zustand 상태 관리 연동
- ✅ 헤더 메뉴 연동
- ✅ 탭 추가/삭제 기능

---

💡 **문의사항이나 개선 제안이 있으시면 언제든 알려주세요!**
