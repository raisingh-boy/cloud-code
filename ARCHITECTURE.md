# Seamless Universe — Финальная архитектура

**Версия:** 3.1 (2026-06-07)  
**Стек:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Three.js  
**Домен:** universe.seamless.club

---

## Содержание

1. [Философия проекта](#1-философия-проекта)
2. [Обзор системы](#2-обзор-системы)
3. [Данные](#3-данные)
4. [3D-движок и физика](#4-3d-движок-и-физика)
5. [Управление состоянием](#5-управление-состоянием)
6. [UI-архитектура](#6-ui-архитектура)
7. [Аутентификация](#7-аутентификация)
8. [Бэкенд и хранение данных](#8-бэкенд-и-хранение-данных)
9. [Деплой и инфраструктура](#9-деплой-и-инфраструктура)
10. [Производительность](#10-производительность)
11. [Безопасность](#11-безопасность)
12. [Предлагаемые улучшения](#12-предлагаемые-улучшения)
13. [Дорожная карта](#13-дорожная-карта)

---

## 1. Философия проекта

### Что это

Seamless Universe — **живая 3D-карта смыслов**. Не база знаний, не социальная сеть и не вики. Это граф, где 170 идей (нод) связаны 373 рёбрами, и каждая связь — это история: исторический момент, личное пересечение, концептуальный мост.

Домен намеренно узкий: философия тела, соматика, движение, когнитивная наука, системное мышление. Узел между телесными практиками (контактная импровизация, александер-техника, фельденкрайз) и интеллектуальными системами (Бейтсон, Варела, Матурана).

### Принципы, которые диктуют архитектуру

**Connection, not Creation** (Are.na > Notion). Первое действие пользователя — провести связь между существующими нодами, а не создать пустую карточку. Граф уже живой, пользователь входит в него.

**Invisible gamification**. Никаких лайков, лидербордов, стриков. Но: «твоя связь создала мост между двумя кластерами» — это видно. Ноды «растут» (seed → sprout → alive → rooted → atlas) через реальное взаимодействие.

**Сома как метафора UI**. Сферы дышат. Рёбра — это нити мицелия. Аудио синхронизировано с нодами. Физика мягкая, органическая, не гравитационная.

---

## 2. Обзор системы

```
┌─────────────────────────────────────────────────────────────┐
│                    КЛИЕНТ (React SPA)                       │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Atlas   │  │  Field   │  │ My World │  │  Audio    │  │
│  │ (Canon)  │  │(Community│  │ (Personal│  │  Player   │  │
│  │ 170 нод  │  │  граф)   │  │ + «Я»)   │  │ + Синхро  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────────┘  │
│       │             │              │                         │
│       └─────────────┴──────────────┘                        │
│                      │                                      │
│             ┌────────▼────────┐                             │
│             │  MyceliumGraph  │                             │
│             │  (Three.js R3F) │                             │
│             │  Physics Loop   │                             │
│             └─────────────────┘                             │
│                                                             │
│  App.tsx (State Hub) ──→ localStorage (resonances/carries)  │
└───────────────────┬─────────────────────────────────────────┘
                    │ HTTPS
          ┌─────────▼──────────┐
          │   Supabase (BaaS)  │
          │                    │
          │  users             │
          │  field_nodes       │
          │  resonances        │
          │  carried_nodes     │
          │  personal_links    │
          └────────────────────┘
                    │
          ┌─────────▼──────────┐
          │  Google OAuth 2.0  │
          └────────────────────┘
```

### Технологический стек

| Слой | Технология | Версия | Роль |
|------|-----------|--------|------|
| Фреймворк | React | 19.0.1 | UI-рендеринг, управление состоянием |
| Язык | TypeScript | 5.8.2 | Строгая типизация |
| Сборка | Vite | 6.2.3 | Dev server, HMR, production build |
| Стили | Tailwind CSS | 4.1.14 | Утилитарный CSS, мобильная адаптация |
| 3D | Three.js | 0.184.0 | WebGL-рендеринг |
| 3D React | @react-three/fiber | 9.6.1 | React-обёртка над Three.js |
| 3D утилиты | @react-three/drei | 10.7.7 | Stars, Billboard, Text, OrbitControls |
| Анимация | motion/react | 12.23.24 | Drawer/modal анимации |
| Иконки | lucide-react | 0.546.0 | UI-иконки |
| AI SDK | @google/genai | 2.4.0 | Зарезервирован для AI-фич |

---

## 3. Данные

### 3.1 Модель данных

#### Нода (SomaticNode)

```typescript
interface SomaticNode {
  // Идентификация
  id: string;           // 'soma-hanna', 'pattern-bateson', 'node-user-1234567890'
  nameRu: string;       // 'Томас Ханна'
  nameEn: string;       // 'Thomas Hanna'
  
  // Классификация
  type: NodeType;       // 'concept' | 'practice' | 'person' | 'movement' | 'event' | 'observation' | 'question'
  level: 'macro' | 'meso' | 'micro';  // Определяет физический размер сферы
  domain: Domain;       // 'body' | 'philosophy' | 'movement' | 'science' | 'cognition' | 'hybrid'
  world: World;         // 'atlas' | 'field' | 'me'
  status: NodeStatus;   // 'seed' | 'sprout' | 'alive' | 'rooted' | 'atlas'
  
  // Контент
  descriptionRu: string;
  descriptionEn: string;
  authorRu?: string;    // Имя автора (для нод типа 'person')
  epochRu?: string;     // Эпоха ('1960s', 'Античность')
  articles?: Article[]; // Материалы, связанные с нодой
  
  // Социальные метрики (эволюция)
  resonances: number;   // Сколько людей откликнулось
  connections: number;  // Сколько связей было создано
  carries: number;      // Сколько раз унесли в My World
  score: number;        // resonances×1 + connections×5 + carries×3
  
  // Приватность
  isPrivate?: boolean;
  addedBy?: string;     // Имя пользователя
  lastActiveAt?: number;
  
  // Физика (runtime, не хранится)
  x, y, z: number;            // Текущее положение (physics units)
  vx, vy, vz: number;         // Скорость
  targetX, targetY, targetZ: number;  // Целевое положение
  currentRadius: number;       // Текущий радиус (дышащий)
  baseRadius: number;          // Базовый радиус (14 atlas, 18 central-me, 10 field)
  breathPhase: number;         // Фаза дыхания
  breathSpeed: number;         // Скорость дыхания (0.3–0.75)
}
```

#### Ребро (SomaticLink)

```typescript
interface SomaticLink {
  id: string;                 // 'lnk-soma-hanna--pattern-bateson'
  source: string;             // ID исходной ноды
  target: string;             // ID целевой ноды
  type: EdgeType;             // 'conceptual' | 'historical' | 'practical' | 'resonance' | 'opposition'
  world: 'atlas' | 'field' | 'me';
  resonanceWeight: number;    // Сила связи (1–10), влияет на силу пружины в физике
  activity: number;           // Активность (1–10), влияет на скорость частицы
  labelRu?: string;           // Описание связи на русском
  storyIds?: string[];        // Истории, привязанные к этому ребру
  addedBy?: string;
  createdAt?: number;
}
```

#### Статус ноды и эволюция

```
SCORE = resonances × 1.0 + connections × 5.0 + carries × 3.0

seed   (score < 10)   → opacity 0.4,  метка скрыта,  маленькая сфера
sprout (score 10–49)  → opacity 0.65, метка видна,   нормальная сфера
alive  (score 50–99)  → opacity 0.85, метка яркая,   немного крупнее
rooted (score ≥ 100)  → opacity 1.0,  метка яркая,   полный размер
atlas  (особый)       → opacity 1.0,  всегда видна,  только admin
```

### 3.2 Объёмы данных (v1)

| Источник | Тип | Кол-во | Хранение |
|---------|-----|--------|---------|
| Atlas nodes | SomaticNode (world='atlas') | 170 | Статический JSON |
| Atlas edges | SomaticLink (world='atlas') | 373 | Статический JSON |
| Stories | Story | 17 (готово) / 66 (план) | Статический JSON |
| Field seed nodes | SomaticNode (world='field') | 3 | Статический JSON |
| Audio items | AudioItem | 2 | Статический JSON |
| User-created field nodes | SomaticNode | ∞ | Supabase |
| User resonances | resonances table | ∞ | Supabase |
| User carried nodes | carried_nodes table | ∞ | Supabase |
| Personal links | personal_links table | ∞ | Supabase |

### 3.3 Структура файлов данных

```
src/data/
├── nodesData.ts         # Комбинирует всё, экспортирует INITIAL_NODES, INITIAL_LINKS etc.
├── nodes-part1.ts       # 40 нод (корень, современный танец, КИ, буто)
├── nodes-part2.ts       # 57 нод (александер, фельденкрайз, психотерапия)
├── nodes-part3.ts       # 73 ноды (когнитивная наука, кибернетика, Бейтсон)
├── edges-part1.ts       # 117 рёбер (первая часть связей)
├── edges-part2.ts       # 256 рёбер (вторая часть)
└── stories.ts           # 17 историй (нужно до 66)
```

**Трансформация данных в nodesData.ts:**

```typescript
// Сырые данные (id + label + group + desc + years + figures)
//   ↓ mapGroupToDomain()      → Domain
//   ↓ mapGroupToNodeType()    → NodeType  
//   ↓ mapIdToLevel()          → 'macro' | 'meso' | 'micro'
//   ↓ getArticlesForNode()    → Article[]
//   ↓ Обогащённый SomaticNode с дефолтами
//   = ATLAS_NODES
```

---

## 4. 3D-движок и физика

### 4.1 Архитектура компонентов

```
<MyceliumGraph>          ← главный экспортируемый компонент
  <Canvas>               ← React Three Fiber Canvas
    <GraphScene>         ← физический оркестратор (THE BRAIN)
      <Stars>            ← звёздный фон
      <ambientLight>     ← равномерное освещение
      <pointLight × 3>   ← три источника: холодный, фиолетовый, тёмно-фиолетовый
      <OrbitControls>    ← управление камерой
      <MyceliumEdge × N> ← кривые рёбра с частицами
      <GoldenBridges>    ← золотые мосты (режим наложения)
      <SomaticSphere × N>← дышащие сферы-ноды
      <NodeLabel × N>    ← биллборды с текстом
```

### 4.2 Ключевая константа: SCALE

```typescript
const SCALE = 0.045;

// Физические координаты (0–320 units) → WebGL space (0–14.4 units)
// Камера стоит в (0, 0, 24) — видит сферы на расстоянии ~10-14 units
// Fog начинается с 35 units — ноды в глубине (~320 × 0.045 = 14.4) видны
// Ребро длиной 145 physics units = 6.5 WebGL units = комфортная дистанция
```

### 4.3 Физическая симуляция (useFrame, 60fps)

```
┌────────────────────────────────────────────────────────────┐
│                  PHYSICS LOOP (useFrame)                   │
│                                                            │
│  1. REPULSION (все пары нод в радиусе 310 physics units)  │
│     F = repulsionStrength / (dist² + 120)                  │
│     repulsionStrength = 2200 (desktop)                     │
│                       = 2200 × min(1, fieldCount/12)       │
│                         (field с малым числом нод)         │
│                                                            │
│  2. SPRING ATTRACTION (вдоль рёбер)                        │
│     stretch = dist - 145 (rest length = 145 units)         │
│     pull = stretch × 0.038 × log(resonanceWeight + 1)      │
│     central-me не притягивается (заморожен)                │
│                                                            │
│  3. GRAVITY TO TARGET                                      │
│     v += (target - pos) × 0.045                            │
│                                                            │
│  4. DAMPING                                                │
│     v *= 0.76 (высокое демпфирование = мягкие движения)    │
│                                                            │
│  5. INTEGRATION                                            │
│     pos += v                                               │
│     pos += noise(±0.2) (органическое дрожание)             │
│                                                            │
│  6. BREATHING                                              │
│     radius = baseRadius × (1 + sin(t × breathSpeed) × 0.08)│
│                                                            │
│  central-me: pos = (0,0,0), v = (0,0,0) — always frozen   │
└────────────────────────────────────────────────────────────┘
```

### 4.4 Целевые позиции по мирам

#### Atlas (Canon)

```
6 доменов, каждый = сектор 60°
Ноды сортируются внутри домена → равномерное распределение по сектору ±21°
5 колец: 100, 155, 210, 265, 320 physics units
Z-разброс: (-60, -20, +20, +60) physics units

body       →  0°  сектор (правая сторона)
science    →  60° сектор
philosophy → 120°
movement   → 180°
cognition  → 240°
hybrid     → 300°
```

#### Field (Living Field)

```
Золотой угол (2.399963 rad = 137.5°) — каждая нода смещается на это от предыдущей
Расстояние: (60 + idHash % 80) × densityScale

densityScale = clamp(sqrt(fieldNodeCount / 16), 0.3, 1.8)
  → 1 нода:  densityScale = 0.25 → радиус ~15-35 units (держатся вместе)
  → 16 нод:  densityScale = 1.0  → радиус 60-140 units (нормальное расстояние)
  → 64 ноды: densityScale = 1.8  → радиус 108-252 units (просторно)

Repulsion тоже масштабируется: 2200 × min(1, fieldCount / 12)
```

#### My World (Me)

```
central-me: (0, 0, 0) — замороженный якорь, никогда не двигается
Личные ноды: радиус 90–170 units, золотой угол
             tz = (idx % 5 - 2) × 28 (несколько уровней по Z)
Связь: каждая личная нода → ребро к central-me (ensureCentralLink)
Spring rest length 145 units — личные ноды притягиваются к central-me
```

### 4.5 Компоненты рендеринга

#### SomaticSphere

```typescript
// Два меша: внешнее свечение (glow) + внутреннее ядро (core)
// Breath animation: scale = baseRadius × (1 + sin(t × breathSpeed + phase) × 0.07)
// Emissive intensity: 0.2 (normal) → 0.45 (hover) → 0.75 (selected) → 1.2 (overlay match)
// Audio mode: emissive gold (#DFB757), pulse sin(t×8)×0.3

// Status → opacity (в field-мире)
seed:   0.4    // едва виден
sprout: 0.65
alive:  0.85
rooted: 1.0
atlas:  1.0    // всегда полная непрозрачность
```

#### MyceliumEdge

```typescript
// Кривая Безье: start → midpoint + perpendicular_offset → end
// Offset: уникальный для каждого ребра (детерминированный по хешу ID)
// Частица: путешествует по кривой 0→1→0 с циклическим reset
// Speed: 0.005 (обычное) × 2 (если активное ребро)
// Opacity: 0.16 (спящее) → 0.55 (активное)
```

#### NodeLabel (Billboard)

```typescript
// Видимость (условие OR):
showLabel = isSelected || isActiveAudio || isHovered || node.status !== 'seed'

// Позиция: чуть выше сферы (+ currentRadius + 0.16)
// Всегда смотрит на камеру (Billboard)
// Размер: 0.19 (selected/audio) | 0.14 (normal)
// Цвет: #DFB757 (selected/audio) | #D1D7E0 (normal)
```

### 4.6 Фильтрация нод (getFilteredNodes)

```
1. World matching:
   atlas → только node.world === 'atlas'
   field → только node.world === 'field'
   me    → central-me + (addedBy === userName || resonatedNodeIds.has(id) || carriedNodeIds.has(id))

2. Visible layers (чекбоксы):
   !atlas    → скрыть atlas-ноды
   !field    → скрыть field-ноды
   hot       → показать только resonances ≥ 50
   withAudio → показать только ноды из audio timeline

3. isFilterHot: resonances ≥ 50

4. Результат → filteredNodes → filteredNodeIds → activeLinks
```

---

## 5. Управление состоянием

### 5.1 Текущая архитектура (React hooks)

```
App.tsx (главный контейнер состояния, ~1140 строк)
│
├── МИРОВОЕ СОСТОЯНИЕ
│   ├── language: 'ru' | 'en'
│   ├── currentWorld: 'atlas' | 'field' | 'me'
│   └── showOnboarding: boolean
│
├── ДАННЫЕ ГРАФА
│   ├── nodes: SomaticNode[]          ← вся база нод
│   ├── links: SomaticLink[]          ← все рёбра
│   ├── stories: Story[]              ← все истории
│   ├── agendaQuestions: AgendaQuestion[]
│   └── notifications: ActivityNotification[]
│
├── ПОЛЬЗОВАТЕЛЬ
│   ├── userEmail: string | null
│   ├── userProfile: UserProfile
│   ├── resonatedNodeIds: Set<string>  ← localStorage
│   └── carriedNodeIds: Set<string>    ← localStorage
│
├── UI-СОСТОЯНИЕ
│   ├── selectedNode: SomaticNode | null
│   ├── searchQuery: string
│   ├── selectedDomainFilter: Domain | 'all'
│   ├── selectedEpoch: 0 | 1 | 2 | 3
│   ├── visibleLayers: {atlas, field, hot, withAudio}
│   ├── overlayPersona: string | null
│   ├── flashMessage: string | null
│   └── activeAudioNodeId: string | null
│
└── МОДАЛЫ / ДРАВЫ
    ├── isAddSenseOpen: boolean
    ├── showProfileDrawer: boolean
    ├── showActivityDrawer: boolean
    └── showAuthModal: boolean
```

### 5.2 Потоки данных

```
Пользовательское действие
       ↓
App.tsx handler (handleNodeResonated, handleCarryOver, etc.)
       ↓
setNodes() / setLinks() → React re-render
       ↓
MyceliumGraph получает новые props
       ↓
useEffect([nodes, links, currentWorld]):
  - Обновляет graphStateRef (внутреннее физическое состояние)
  - НЕ вызывает re-render (ref, не state)
       ↓
useFrame() (каждый кадр, 60fps):
  - Читает/пишет graphStateRef.current
  - Обновляет Three.js mesh positions напрямую
  - НЕ вызывает re-render
```

**Критический принцип:** Физика и рендеринг Three.js работают **вне React state**. `graphStateRef` — это мутируемый объект, который обновляется 60 раз в секунду без React re-renders. React re-render происходит только при изменении данных (nodes, links) — то есть при пользовательских действиях.

### 5.3 Персистентность

```typescript
// localStorage (синхронная, без бэкенда):
resonatedNodeIds → 'su_resonated' (JSON array)
carriedNodeIds   → 'su_carried'  (JSON array)

// Планируемая Supabase (после TASK-09):
resonances    table → resonated nodes in cloud
carried_nodes table → carried nodes in cloud
field_nodes   table → user-created nodes
users         table → user profiles
```

---

## 6. UI-архитектура

### 6.1 Компонентная структура

```
src/
├── App.tsx                        # Монолит: весь state + весь layout (нужна декомпозиция)
└── components/
    ├── MyceliumGraph.tsx           # 3D граф (725 строк)
    ├── NodeCard.tsx                # Детали ноды (400+ строк)
    ├── AddSenseModal.tsx           # Создание контента (400+ строк)
    ├── AudioPlayer.tsx             # Аудиоплеер (300+ строк)
    ├── PhilosophyOnboarding.tsx    # Онбординг (350+ строк)
    └── AgendaPanel.tsx             # Q&A (250+ строк)
```

### 6.2 Layout (мобильный и десктопный)

```
МОБИЛЬНЫЙ (< 768px):
┌────────────────────┐ ← header (absolute, blur)
│ [SU] SEAMLESS      │
│ UNIVERSE           │
├────────────────────┤ ← mobile world switcher
│ [Atlas][Field][Me] │
├────────────────────┤
│                    │
│    3D ГРАФ         │ ← MyceliumGraph (flex-1)
│                    │
│    (canvas)        │
│                    │
├────────────────────┤ ← AudioPlayer (bottom-24 на мобилке)
│  ♫ Трек...   ▶ ↑  │
├────────────────────┤ ← footer (h-16)
│ Info     [+]       │
└────────────────────┘
  ↑ safe-area-inset-bottom

ДЕСКТОПНЫЙ (≥ 768px):
┌─────────────────────────────────────────────┐ ← header
│ [SU]  [Atlas | Field | Me]    [🔔] [Profile]│
├──────────────────────────────┬──────────────┤
│                              │              │
│          3D ГРАФ             │  NodeCard    │ ← side drawer
│                              │  (400px)     │
│                              │              │
├──────────────────────────────┴──────────────┤
│         ♫ MiniPlayer (bottom-4 right-4)    │
├─────────────────────────────────────────────┤
│ Info text              [+]                  │ ← footer
└─────────────────────────────────────────────┘
```

### 6.3 Три мира — переходы

```
Atlas → Field:   fade-out (0.3s) → обновление filteredNodes → fade-in
Field → Me:      fade-out → inject central-me → rebuild links → fade-in
Me → Atlas:      fade-out → убрать центральную ноду из physics → fade-in

transitionProgress: 0.0 → 1.0 (increment 0.04/frame = ~0.67 секунды перехода)
Во время перехода: lerp(pos, target, 0.12) каждый кадр
```

### 6.4 Цветовая система

```typescript
// Домены (единая система, используется везде)
body:        '#E8A95C'  // Тёплый янтарь
science:     '#5C9BE8'  // Холодный синий
philosophy:  '#9B5CE8'  // Фиолетовый
movement:    '#5CE87A'  // Зелёный
cognition:   '#EAEAEA'  // Серебристо-белый
hybrid:      '#E85C7A'  // Коралловый

// Специальные
central-me:  '#DFB757'  // Золотой
atlas-mark:  '#DFB757'  // Золотой (для подсветки)
background:  '#050508'  // Почти чёрный

// Статусы (ambient / emissive)
seed:    opacity 0.4   → едва виден
sprout:  opacity 0.65
alive:   opacity 0.85
rooted:  opacity 1.0
atlas:   opacity 1.0
```

### 6.5 Анимации

```css
/* ascend — при добавлении наблюдения */
@keyframes ascend {
  0%:   translateY(300px) scale(0.6) opacity 0
  15%:  opacity 1
  85%:  translateY(-200px) scale(1.3) opacity 1
  100%: translateY(-400px) scale(0.2) opacity 0
}

/* slideIn — боковые панели (NodeCard, Drawer) */
@keyframes slideIn {
  mobile:  translateY(100% → 0)   /* снизу */
  desktop: translateX(100% → 0)  /* справа */
}

/* fadeIn — модальные окна */
@keyframes fadeIn {
  opacity 0 + scale(0.98) → opacity 1 + scale(1)
}
```

---

## 7. Аутентификация

### 7.1 Текущее состояние

Имитация: `userEmail` захардкожен как `'botovroman45@gmail.com'`. Логика авторизации обходится через симуляцию.

### 7.2 Целевая архитектура (Google OAuth)

```
Пользователь нажимает "Войти"
       ↓
<GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
       ↓
useGoogleLogin() → Google Popup
       ↓
credentials.credential → JWT (id_token)
       ↓
Decode JWT → { sub, email, name, picture }
       ↓
setUserEmail(email)
setUserProfile(p => ({ ...p, name: name }))
       ↓
Supabase: upsert into users table
       ↓
Fetch user's resonances/carries from Supabase
       ↓
Merge with localStorage state
```

### 7.3 Защита действий

```typescript
// Перед каждым мутирующим действием
const requireAuth = (action: () => void) => {
  if (!userEmail) {
    setShowAuthModal(true);
    return;
  }
  action();
};

// Atlas: readonly без авторизации (смотреть и кликать — можно)
// Field: создание нод — нужна авторизация
// My World: нужна авторизация (personalization)
// Resonate / Carry — нужна авторизация
```

### 7.4 Роли

```
guest (userEmail === null):
  ✅ Atlas: просмотр, клик на ноду, NodeCard (read-only)
  ✅ Field: просмотр
  ❌ Field: создание нод
  ❌ My World
  ❌ Resonate / Carry

user (userEmail !== null && !ADMIN_EMAILS):
  ✅ Все действия guest
  ✅ Resonate, Carry
  ✅ Создание нод в Field
  ✅ My World
  ✅ Создание историй / вопросов
  ❌ Admin panel

admin (userEmail in ADMIN_EMAILS):
  ✅ Все действия user
  ✅ Admin panel (/admin)
  ✅ Upload/download universe JSON
  ✅ CRUD Atlas нод
```

---

## 8. Бэкенд и хранение данных

### 8.1 Архитектура Hybrid Storage

```
┌──────────────────────────────────────────────────────────┐
│                   DATA LAYER                             │
│                                                          │
│  СТАТИКА (Git + Vercel CDN)                              │
│  ├── Atlas nodes (170)      → nodes-part1/2/3.ts         │
│  ├── Atlas edges (373)      → edges-part1/2.ts           │
│  ├── Stories (66)           → stories.ts                 │
│  ├── Audio metadata (2+)    → nodesData.ts               │
│  └── Seed field nodes (3)   → nodesData.ts               │
│                                                          │
│  SUPABASE (PostgreSQL + PostgREST + Realtime)            │
│  ├── users                  → профили пользователей      │
│  ├── field_nodes            → user-generated ноды        │
│  ├── resonances             → (user_id, node_id)         │
│  ├── carried_nodes          → (user_id, node_id)         │
│  └── personal_links         → My World рёбра             │
│                                                          │
│  CLOUD STORAGE (Supabase Storage или R2)                 │
│  └── public/audio/          → MP3 файлы                  │
└──────────────────────────────────────────────────────────┘
```

### 8.2 Схема Supabase

```sql
-- Пользователи
CREATE TABLE users (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email        text UNIQUE NOT NULL,
  name         text NOT NULL,
  avatar_url   text,
  domains      text[],     -- Domain[]
  created_at   timestamptz DEFAULT now(),
  last_seen_at timestamptz DEFAULT now()
);

-- Пользовательские ноды (Field)
CREATE TABLE field_nodes (
  id             text PRIMARY KEY,
  name_ru        text NOT NULL,
  name_en        text NOT NULL,
  domain         text NOT NULL,
  level          text NOT NULL DEFAULT 'meso',
  type           text NOT NULL DEFAULT 'observation',
  description_ru text,
  description_en text,
  added_by       uuid REFERENCES users(id),
  is_private     boolean DEFAULT false,
  resonances     int DEFAULT 1,
  connections    int DEFAULT 0,
  carries        int DEFAULT 0,
  created_at     timestamptz DEFAULT now(),
  last_active_at timestamptz DEFAULT now()
);

-- Резонансы (лайки-без-лайков)
CREATE TABLE resonances (
  user_id    uuid REFERENCES users(id) ON DELETE CASCADE,
  node_id    text NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, node_id)
);

-- Унесённые ноды (My World)
CREATE TABLE carried_nodes (
  user_id    uuid REFERENCES users(id) ON DELETE CASCADE,
  node_id    text NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, node_id)
);

-- Личные связи (My World edges)
CREATE TABLE personal_links (
  id         text PRIMARY KEY,
  source     text NOT NULL,
  target     text NOT NULL,
  type       text NOT NULL DEFAULT 'resonance',
  user_id    uuid REFERENCES users(id) ON DELETE CASCADE,
  weight     int DEFAULT 2,
  created_at timestamptz DEFAULT now()
);

-- Row Level Security
ALTER TABLE field_nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public field nodes visible to all" ON field_nodes
  FOR SELECT USING (is_private = false);
CREATE POLICY "Private nodes only for owner" ON field_nodes
  FOR SELECT USING (is_private = true AND added_by = auth.uid());

ALTER TABLE resonances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own resonances" ON resonances
  FOR ALL USING (user_id = auth.uid());
```

### 8.3 Admin JSON export format

```typescript
// Формат для анализа AI-агентами (экспорт из /admin)
interface UniverseExport {
  meta: {
    version: string;
    exportedAt: string;
    nodeCount: number;
    edgeCount: number;
    storyCount: number;
  };
  nodes: SomaticNode[];
  edges: SomaticLink[];
  stories: Story[];
}

// Текстовый формат (для LLM-анализа)
// Одна строка на ноду:
// ID | nameRu | domain | level | status | descriptionRu | resonances | connections | carries
```

---

## 9. Деплой и инфраструктура

### 9.1 Текущий деплой

```
Git push → ручной npm run build → ручная загрузка dist/ на VPS (vmi3274038)
```

### 9.2 Целевой CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
        env:
          VITE_GOOGLE_CLIENT_ID: ${{ secrets.VITE_GOOGLE_CLIENT_ID }}
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 9.3 Инфраструктура

```
┌──────────────┐    push    ┌──────────────┐   deploy   ┌──────────────┐
│   GitHub     │ ─────────→ │GitHub Actions│ ─────────→ │    Vercel    │
│  main branch │            │  build+test  │            │ CDN (global) │
└──────────────┘            └──────────────┘            └──────┬───────┘
                                                               │
                                                        universe.seamless.club
                                                               │
                            ┌──────────────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │   Supabase    │
                    │  (Frankfurt)  │
                    └───────────────┘
```

### 9.4 Переменные окружения

```bash
# .env.production
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# .env.example (в репозитории)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 10. Производительность

### 10.1 Текущие характеристики

| Метрика | Текущее | Цель |
|---------|---------|------|
| Bundle size | 1,514 KB (438 KB gzip) | < 800 KB gzip |
| Nodes rendering | Individual meshes | InstancedMesh (>500 нод) |
| frameloop | Continuous (батарея!) | demand + invalidate() |
| Physics complexity | O(n²) all pairs | O(n log n) Barnes-Hut (v2) |
| Mobile FPS | ~24fps | 30fps stable |
| Desktop FPS | ~55fps | 60fps stable |

### 10.2 Оптимизации (приоритет)

**Критические (батарея + мобилка):**

```typescript
// 1. frameloop="demand" — рендерить только при изменениях
<Canvas frameloop="demand">
  // В useFrame:
  if (maxMovement > 0.01) invalidate();
  // В OrbitControls:
  <OrbitControls onChange={invalidate} />
  // В pointer events:
  onPointerOver={() => { onHover(id); invalidate(); }}
```

```typescript
// 2. DPR ограничение (уже есть, проверить)
dpr={Math.min(window.devicePixelRatio, 2)}
// На iPhone 15 Pro devicePixelRatio = 3 → ограничить до 2
```

```typescript
// 3. PerformanceMonitor (drei)
<PerformanceMonitor
  onDecline={() => setDpr(1)}   // Понизить качество при низком FPS
  onIncline={() => setDpr(2)}   // Повысить при стабильном FPS
/>
```

**Для >500 нод (v2):**

```typescript
// 4. InstancedMesh вместо individual meshes
const instancedMeshRef = useRef<THREE.InstancedMesh>();
const dummy = new THREE.Object3D();
// В useFrame:
filteredNodes.forEach((node, i) => {
  dummy.position.set(node.x * SCALE, node.y * SCALE, node.z * SCALE);
  dummy.scale.setScalar(node.currentRadius * SCALE);
  dummy.updateMatrix();
  instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
  instancedMeshRef.current.setColorAt(i, new THREE.Color(domainColor));
});
instancedMeshRef.current.instanceMatrix.needsUpdate = true;
```

### 10.3 Bundle оптимизация

```typescript
// vite.config.ts — code splitting
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
        'vendor-react': ['react', 'react-dom', 'motion'],
        'data': ['./src/data/nodes-part1', './src/data/nodes-part2', './src/data/nodes-part3'],
      }
    }
  }
}
// Результат: three.js (~600KB) грузится параллельно с react (~50KB)
// Пользователь видит оболочку быстрее
```

---

## 11. Безопасность

### 11.1 Текущие риски

| Риск | Уровень | Статус |
|------|---------|--------|
| Нет реальной авторизации | Критический | В плане (TASK-01) |
| JWT не верифицируется на бэкенде | Высокий | Supabase RLS решает |
| XSS через user-generated names | Средний | React escapes by default ✅ |
| Нет rate limiting на Field | Средний | Supabase + RLS |
| Открытый VITE_SUPABASE_ANON_KEY | Низкий | Это публичный ключ, RLS защищает |

### 11.2 Supabase Row Level Security

```sql
-- Field nodes: все видят публичные, только автор видит приватные
CREATE POLICY "field_nodes_select" ON field_nodes
  FOR SELECT USING (is_private = false OR added_by = auth.uid());

-- Нельзя создать ноду от чужого имени
CREATE POLICY "field_nodes_insert" ON field_nodes
  FOR INSERT WITH CHECK (added_by = auth.uid());

-- Резонансы: только свои
CREATE POLICY "resonances_all" ON resonances
  FOR ALL USING (user_id = auth.uid());
```

### 11.3 Admin panel защита

```typescript
const ADMIN_EMAILS = ['vologdin.roman@gmail.com']; // hardcoded, не из БД

// В /admin route:
if (!ADMIN_EMAILS.includes(userEmail)) {
  return <Navigate to="/" />;
}
```

---

## 12. Предлагаемые улучшения

### 12.1 Архитектура кода

**Проблема: App.tsx — 1138 строк, монолит**

```typescript
// Решение: декомпозиция на кастомные хуки

// src/hooks/useGraphData.ts
export function useGraphData() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [links, setLinks] = useState(INITIAL_LINKS);
  const [stories, setStories] = useState(ALL_STORIES);
  const ensureCentralLink = useCallback(...);
  const handleAddObservation = useCallback(...);
  const handleCarryOver = useCallback(...);
  const handleNodeResonated = useCallback(...);
  return { nodes, links, stories, handlers... };
}

// src/hooks/useAuth.ts
export function useAuth() {
  const [userEmail, setUserEmail] = useState(null);
  const [userProfile, setUserProfile] = useState(DEFAULT_PROFILE);
  const login = useCallback(async (credential) => { ... });
  const logout = useCallback(() => { ... });
  return { userEmail, userProfile, login, logout, isAdmin };
}

// src/hooks/useFilteredGraph.ts
export function useFilteredGraph(nodes, links, filters) {
  return useMemo(() => {
    // search, domain, epoch, visibleLayers filtering
  }, [nodes, links, filters]);
}

// App.tsx: < 200 строк, только composition
```

**Проблема: GoldenOverlayBridges — захардкоженные IDs**

```typescript
// Решение: конфигурируемые overlay bridges
const OVERLAY_BRIDGES = {
  'Steve Paxton': ['soma-hanna', 'pattern-bateson', 'field-gaze', 'ci-paxton'],
  'Thomas Hanna': ['soma-hanna', 'feldenkrais', 'somatic-ed', 'cognitive-sci'],
  'Gregory Bateson': ['pattern-bateson', 'cybernetics', 'ecology', 'mind-nature']
};
```

### 12.2 Физика и 3D

**Проблема: O(n²) репульсия при большом числе нод**

```typescript
// Решение v2: Barnes-Hut с пространственным разбиением
// Для 170 нод не критично, но для Field с сотнями нод

class Octree {
  insert(node: PhysicsNode): void { ... }
  getNeighbors(node: PhysicsNode, radius: number): PhysicsNode[] { ... }
}
// Сложность: O(n log n) вместо O(n²)
```

**Улучшение: Camera Fly-To при клике на ноду**

```typescript
// В GraphScene useFrame:
const cameraTargetRef = useRef<THREE.Vector3 | null>(null);

// При выборе ноды:
useEffect(() => {
  if (!selectedNodeId) return;
  const node = gState.nodes.find(n => n.id === selectedNodeId);
  if (!node) return;
  cameraTargetRef.current = new THREE.Vector3(
    node.x * SCALE, node.y * SCALE, node.z * SCALE + 6
  );
}, [selectedNodeId]);

// В useFrame:
if (cameraTargetRef.current) {
  camera.position.lerp(cameraTargetRef.current, 0.06);
  controls.current?.target.lerp(
    new THREE.Vector3(node.x * SCALE, node.y * SCALE, node.z * SCALE), 
    0.06
  );
  if (camera.position.distanceTo(cameraTargetRef.current) < 0.1) {
    cameraTargetRef.current = null;
  }
  invalidate();
}
```

**Улучшение: LOD (Level of Detail)**

```typescript
// Текущее: все ноды рендерятся одинаково
// Предложение: уменьшать полигоны при удалении от камеры

const distFromCamera = camera.position.distanceTo(nodePos);
const segments = distFromCamera < 10 ? 24 : distFromCamera < 25 ? 12 : 6;
// macro = 24/12/6 сегментов, micro = 12/8/4
```

### 12.3 UX улучшения

**Двусторонняя навигация между нодами**

```typescript
// В NodeCard — кликабельные связи
<div className="space-y-1">
  {connectedNodes.map(n => (
    <button
      key={n.id}
      onClick={() => { onSelectNode(n); /* fly camera to n */ }}
      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 
                 flex items-center gap-2 text-sm"
    >
      <span className={`w-2 h-2 rounded-full ${domainColor[n.domain]}`} />
      {language === 'ru' ? n.nameRu : n.nameEn}
      <span className="ml-auto text-xs text-gray-500">{edgeType}</span>
    </button>
  ))}
</div>
```

**Мобильный NodeCard как bottom sheet с drag**

```typescript
// Используем touch events для drag-to-close и drag-to-expand
const [sheetY, setSheetY] = useState(window.innerHeight * 0.4); // 60% высоты
const startYRef = useRef(0);

const handleTouchStart = (e: TouchEvent) => {
  startYRef.current = e.touches[0].clientY;
};
const handleTouchMove = (e: TouchEvent) => {
  const delta = e.touches[0].clientY - startYRef.current;
  setSheetY(prev => Math.max(window.innerHeight * 0.1, prev + delta));
  startYRef.current = e.touches[0].clientY;
};
const handleTouchEnd = () => {
  // Snap to 40% или 95% или закрыть
  if (sheetY > window.innerHeight * 0.8) onClose();
  else if (sheetY < window.innerHeight * 0.3) setSheetY(window.innerHeight * 0.05);
  else setSheetY(window.innerHeight * 0.4);
};
```

**Serendipity — случайный прыжок**

```typescript
// Кнопка "случайная нода" (для Busybody-стиля навигации)
const handleRandomLeap = () => {
  const candidates = filteredNodes.filter(n => n.id !== selectedNode?.id);
  // Предпочитаем ноды из другого домена (cross-domain discovery)
  const crossDomain = candidates.filter(n => n.domain !== selectedNode?.domain);
  const pool = crossDomain.length > 3 ? crossDomain : candidates;
  const random = pool[Math.floor(Math.random() * pool.length)];
  setSelectedNode(random);
  // + camera fly-to random node
};
```

### 12.4 Аудио архитектура

**Web Audio API — Звук сфер**

```typescript
// Частота каждой ноды зависит от домена + уровня
const BASE_FREQ: Record<Domain, number> = {
  body: 110,       // A2 — глубокий, телесный
  science: 220,    // A3
  philosophy: 174, // F3 — философский, задумчивый
  movement: 330,   // E4 — живой, активный
  cognition: 440,  // A4 — ментальный, чистый
  hybrid: 264      // C4 — нейтральный
};
const LEVEL_MULT = { macro: 1.0, meso: 1.5, micro: 2.0 };

// Каждая видимая нода → OscillatorNode (синус) + GainNode
// Громкость = 1 / (dist_from_camera + 1)² × masterVolume
// На мобилке: ограничить до 5 oscillators (центральные/selected)
```

**Аудиофайлы — стратегия**

```typescript
// Приоритет создания контента:
// 1. ElevenLabs API → озвучить 17 готовых stories
// 2. Guided tour по Atlas (3-5 минут, ключевые ноды)
// 3. «Daily meditation» — 10-минутный трек с синхронизированными нодами

// Хранение: Supabase Storage (bucket: seamless-audio)
// CDN: Vercel Edge Network (автоматически при deploy)
// Формат: MP3 (128kbps) для мобилок, AAC для iOS
```

### 12.5 Онбординг — Connection-First

```typescript
// 3 шага, < 90 секунд

// Шаг 1: Atlas reveal
// Анимация: граф появляется из темноты, ноды постепенно «загораются»
// Текст: "Это 170 идей, которые изменили понимание движения и сознания"
// CTA: "Войти" (начать исследование)

// Шаг 2: Node click tutorial
// Выделяем 2 крупные MACRO-ноды пульсацией
// Текст: "Нажми на любую идею, чтобы узнать её историю"
// Ждём клика → auto-advance

// Шаг 3: First resonance
// NodeCard открылась после шага 2
// Стрелка указывает на кнопку Resonate
// Текст: "Нажми ♦ если эта идея тебя затрагивает"
// После клика: конфетти + "Добро пожаловать во вселенную Seamless"
```

### 12.6 Impact Notifications

```typescript
// Вместо Generic toast → конкретный вклад

// После resonate:
const linkedAtlasCount = links.filter(l => 
  (l.source === nodeId || l.target === nodeId) &&
  nodes.find(n => n.id === (l.source === nodeId ? l.target : l.source))?.world === 'atlas'
).length;
showFlash(`♦ Резонанс записан. Эта идея связана с ${linkedAtlasCount} атласными нодами`);

// После carry:
const nodeA = nodes.find(n => n.id === nodeId);
const alreadyCarried = [...carriedNodeIds].map(id => nodes.find(n => n.id === id));
const newDomain = nodeA?.domain;
const bridgeDomains = alreadyCarried.filter(n => n?.domain !== newDomain);
if (bridgeDomains.length > 0) {
  showFlash(`↗ Мост между [${bridgeDomains[0]?.domain}] и [${newDomain}] через тебя`);
}

// После добавления связи:
const sourceDomain = nodes.find(n => n.id === conn.sourceId)?.domain;
const targetDomain = nodes.find(n => n.id === conn.targetId)?.domain;
if (sourceDomain !== targetDomain) {
  showFlash(`✦ Межсферная связь: [${sourceDomain}] ↔ [${targetDomain}]`);
}
```

### 12.7 Метрики и наблюдаемость

**Рекомендую добавить:**

```typescript
// 1. Plausible Analytics (privacy-first, нет cookies)
// В index.html:
// <script defer data-domain="universe.seamless.club" src="https://plausible.io/js/script.js"></script>

// 2. Кастомные события
plausible('node_resonated', { props: { domain: node.domain, status: node.status }});
plausible('world_switch', { props: { from: prevWorld, to: currentWorld }});
plausible('connection_created', { props: { cross_domain: sourceDomain !== targetDomain }});

// 3. Sentry для error tracking
import * as Sentry from '@sentry/react';
Sentry.init({ dsn: 'https://xxx@sentry.io/xxx', tracesSampleRate: 0.1 });
```

---

## 13. Дорожная карта

### Sprint 0: Стабилизация (СДЕЛАНО ✅)
- ✅ Мобильный AudioPlayer не наезжает на «+»
- ✅ My World: ноды привязаны к центральной «Я»
- ✅ Atlas: детерминированный раскладка по секторам
- ✅ Field: масштабирование плотности по количеству нод
- ✅ Labels: seed-ноды скрывают метки
- ✅ Hover работает (setHoveredId подключён)
- ✅ JULIUS_TASKS.md + AGENTS.md добавлены

### Sprint 1: Critical Path (2–3 недели)

| Задача | Описание | Файлы |
|--------|---------|-------|
| TASK-01 | Google OAuth | App.tsx, main.tsx |
| TASK-02 | Все 66 stories | stories.ts, NodeCard.tsx |
| TASK-03 | Mobile safe-area + bottom sheet | index.css, NodeCard.tsx |
| TASK-04 | LOD node sizes + edge types | MyceliumGraph.tsx |
| TASK-05 | frameloop="demand" | MyceliumGraph.tsx |

### Sprint 2: Product (2–4 недели)

| Задача | Описание |
|--------|---------|
| TASK-06 | Connection-first onboarding (3 шага) |
| TASK-07 | Admin panel (/admin) |
| TASK-08 | Web Audio API — звук сфер |
| TASK-09 | Supabase integration |
| TASK-10 | Camera fly-to при выборе ноды |
| TASK-11 | Impact notifications |

### Sprint 3: Community (1–2 месяца)

| Задача | Описание |
|--------|---------|
| S3-01 | People graph (кто создал ноды в Field) |
| S3-02 | Serendipity (случайный прыжок в другой домен) |
| S3-03 | Dilts Logical Levels как переключаемый слой |
| S3-04 | Semantic search (Supabase pgvector) |
| S3-05 | Real-time активность (Supabase Realtime) |
| S3-06 | InstancedMesh для >500 нод |
| S3-07 | Barnes-Hut O(n log n) физика |

### Sprint 4: Monetization (2–3 месяца)

| Задача | Описание |
|--------|---------|
| S4-01 | Freemium limits (10 нод/день в Field) |
| S4-02 | Membership gate (stripe / lemon squeezy) |
| S4-03 | Audio paywall (preview vs full) |
| S4-04 | Premium My World (безлимитные ноды) |

---

## Приложение A: Именование нод и рёбер

```
Atlas nodes:   семантические ID  → 'soma-hanna', 'pattern-bateson', 'ci-paxton'
Field nodes:   временные ID      → 'node-user-{timestamp}'
Atlas edges:   hash-based        → 'lnk-{source}--{target}'
Field edges:   временные         → 'lnk-user-{timestamp}'
Personal edges: привязка к Me    → 'lnk-me-{nodeId}-{timestamp}'
Central Me:    синтетический      → 'central-me' (никогда не в БД)
```

## Приложение B: Цветовая система доменов

```
body:       #E8A95C  bg: amber-400/20  text: amber-300
science:    #5C9BE8  bg: blue-400/20   text: blue-300
philosophy: #9B5CE8  bg: violet-400/20 text: violet-300
movement:   #5CE87A  bg: green-400/20  text: green-300
cognition:  #EAEAEA  bg: gray-400/20   text: gray-200
hybrid:     #E85C7A  bg: rose-400/20   text: rose-300
```

## Приложение C: Физические константы

```
SCALE            = 0.045   physics → WebGL
gravityStrength  = 0.045   сила притяжения к цели
repulsionStrength= 2200    сила отталкивания (масштабируется в field)
attractionStr.   = 0.038   пружинная сила вдоль рёбер
springRestLength = 145     длина покоя пружины (physics units)
repulsionCutoff  = 310     радиус отталкивания
damping          = 0.76    коэффициент затухания скорости
noise            = ±0.2    случайное дрожание (органичность)
breathAmplitude  = 0.08    амплитуда дыхания сфер
```
