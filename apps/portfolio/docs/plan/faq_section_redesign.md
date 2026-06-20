# FAQ Section: Architecture & Layout Plan

## 1. 개요 (Overview)

**목표:** `FAQ.`라는 메인 타이틀(h1)을 좌측 컨테이너 내부에서 빼내어, 좌우 분할(Split) 레이아웃 상단에 **완전히 독립된 섹션 타이틀**로 배치합니다.
동시에 현재 사용자님이 만족하고 계시는 **타이틀과 본문 간의 타이트한 간격(mt-6 md:mt-8)은 그대로 유지**하여, 시각적인 텐션과 응집력을 잃지 않도록 합니다.

**배경 및 문제점:**

- 기존에는 `FAQ.` 타이틀이 좌우 2단 분할 레이아웃의 좌측(Left Column)에 종속되어 있었습니다.
- 데스크톱 환경에서도 타이틀을 노출하기로 결정함에 따라, 타이틀이 좌측에만 갇혀 있는 것보다 **화면 전체를 아우르는 상단 독립 타이틀**로 존재하는 것이 포트폴리오의 다른 섹션(Experience, Works 등)과 일관성이 맞습니다.
- 단, 단순히 DOM 바깥으로 빼낼 경우 최상위 `<section>` 태그에 걸려 있는 거대한 간격(`gap-[120px]`)의 영향을 받아 제목과 본문이 붕 떠버리는(이중 여백) 문제가 발생할 수 있습니다.

---

## 2. 세부 수정 계획 (Implementation Details)

### 3. 작업 히스토리 및 현재 상태 (Work History & Current State)

오늘(2026년 6월 20일) 진행된 FAQ 섹션 리디자인 작업의 주요 흐름과 현재 상태를 기록합니다.

#### 3.1. 시각적 장식 제거 및 레이아웃 실험

- **이미지 제거:** 불필요하게 영역을 차지하던 `faq-visual.jpg` 이미지를 제거하여 정보 전달에 집중하도록 변경했습니다.
- **레이아웃 실험:**
  - **Route A (Works 스타일):** 2단 분할(좌측 타이틀 + 우측 아코디언) 구조를 테스트했습니다. Sticky 및 Vertical Center 배치를 통해 기존 Works 섹션과의 완벽한 일관성을 확인했습니다.
  - **Route B (1단 Full-width):** 화면 전체를 사용하는 1단 구조를 테스트했습니다. 거대 폰트를 활용한 브루탈리즘 스타일과 원본 폰트 사이즈 등을 넘나들며 밀도와 가독성을 조율했습니다.
  - **Max-Width 중앙 정렬:** 1단 구조의 휑함을 해결하기 위해 `max-w-4xl mx-auto` 기법을 적용해 갤러리 같은 에디토리얼 레이아웃을 테스트했습니다.

#### 3.2. 타이포그래피 딜레마 발견

- 1단 `w-full` 구조에서 디자인적 긴장감을 주려면 글씨 크기를 대폭 키워야 하지만(Route B 초기 상태), 이는 **사이트 전체(Works, About 등)의 폰트 사이즈 위계질서를 무너뜨린다**는 중요한 디자인적 모순을 발견했습니다.

#### 3.3. 현재 체크포인트 (보류 상태)

- **현재 적용 상태:** 1단 Full-width 레이아웃(`w-full`) + 거대한 타이틀(`FAQ.`) + **오리지널 폰트 사이즈의 아코디언 리스트**.
- **의의:** 가장 시원한 레이아웃을 가졌지만, 전체 너비 대비 폰트가 작아 발생하는 '여백의 딜레마'를 시각적으로 확인하기 위해 보존해 둔 상태입니다. 향후 데스크톱 전체 타이포그래피 스케일업 여부에 따라 최종 레이아웃 방향(Route A 복귀 vs Route B 완성)이 결정될 예정입니다.

---

# 4. 기대 효과 (최종 결정 시)

1. **사용자 경험 극대화:** 불필요한 시각적 장식이 배제되어 핵심 정보인 FAQ 텍스트에 온전히 몰입할 수 있습니다.
2. **디자인 시스템 확립:** FAQ 섹션의 폰트 크기 고민이 곧 전체 사이트의 데스크톱 폰트 스케일링 정책을 정의하는 중요한 기준점이 됩니다.

---

## 3. 구조적 변경 예시 (Pseudo-code structure)

```tsx
<section className='... gap-[120px]'>
  <SectionLabel ... />

  {/* 새로운 래퍼: Section의 120px 갭을 무시하고, 타이트한 간격(gap-6 md:gap-8) 유지 */}
  <div className='w-full flex flex-col gap-6 md:gap-8'>

    {/* 1. 독립된 FAQ 타이틀 블록 */}
    <div className='site-container w-full px-6 md:px-12'>
      <motion.div>
        <h1 className='text-7xl md:text-8xl lg:text-9xl tracking-tight font-semibold'>FAQ.</h1>
      </motion.div>
    </div>

    {/* 2. 좌우 2단 분할 콘텐츠 영역 */}
    <div className='site-container w-full flex flex-col xl:flex-row xl:items-start gap-12 xl:gap-20 px-6 md:px-12 relative'>

      {/* LEFT — 이미지와 H3 (타이틀이 빠졌으므로 이것만 남음) */}
      <div className='w-full xl:max-w-[540px] xl:grow shrink-0 xl:flex xl:flex-col font-semibold xl:sticky xl:top-32 self-start'>
        <div className='relative'>
          {/* 이미지 (hidden xl:block) */}
          {/* h3 텍스트 (absolute 겹침) */}
        </div>
      </div>

      {/* RIGHT — 아코디언 */}
      <div className='flex-1 border-t border-white/20'>
        {FAQS.map(...)}
      </div>

    </div>
  </div>
</section>
```

---

## 4. 기대 효과 (Expected Outcomes)

1. **완벽한 구조화:** "거대한 제목" 밑에 "설명과 본문"이 좌우로 나뉘어 배치되는 가장 이상적인 에디토리얼 레이아웃이 완성됩니다.
2. **간격의 보존:** 사용자님이 만족하신 현재의 타이트한 간격이 1픽셀의 오차도 없이 동일하게 유지됩니다.
3. **Sticky UI 최적화:** 좌측 이미지가 우측 리스트의 스크롤을 부드럽게 따라다니는 세련된 사용성을 제공하게 됩니다.
