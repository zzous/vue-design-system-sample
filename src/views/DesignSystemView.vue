<script setup>
import { ref } from 'vue'
import {
  SToastProvider,
  SButton,
  SInput,
  SSelect,
  STextarea,
  SCheckbox,
  SCheckboxGroup,
  SRadioGroup,
  SBadge,
  SChip,
  SCard,
  SModal,
  SPagination,
  SDatePicker,
  STypography,
} from '@zzou/vue-design-system'
import DesignSystemToastDemo from '@/components/DesignSystemToastDemo.vue'

const email = ref('')
const role = ref('')
const memo = ref('')
const agree = ref(false)
const interests = ref(['vue'])
const plan = ref('basic')
const modalOpen = ref(false)
const currentPage = ref(1)
const selectedDate = ref(null)
const chips = ref(['Vue', 'Vite', 'Pinia'])

const roleOptions = [
  { value: 'admin', label: '관리자' },
  { value: 'operator', label: '운영자' },
  { value: 'viewer', label: '뷰어' },
]

const interestOptions = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
]

const planOptions = [
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
]

const buttonVariants = ['primary', 'secondary', 'outline', 'ghost', 'danger']

function removeChip(label) {
  chips.value = chips.value.filter((item) => item !== label)
}
</script>

<template>
  <SToastProvider position="topRight">
    <section class="card">
      <h2>@zzou/vue-design-system</h2>
      <STypography variant="body2" color="muted">
        npm 패키지 컴포넌트 데모 —
        <a href="https://zzous.github.io/vue-design-system/" target="_blank" rel="noreferrer">
          Storybook
        </a>
      </STypography>
    </section>

    <section class="card">
      <h2>Button</h2>
      <div class="row">
        <SButton
          v-for="variant in buttonVariants"
          :key="variant"
          :variant="variant"
        >
          {{ variant }}
        </SButton>
        <SButton variant="primary" loading>loading</SButton>
      </div>
    </section>

    <SCard
      title="Form Controls"
      description="Input, Select, Textarea"
      variant="raised"
    >
      <div class="form-grid">
        <SInput
          v-model="email"
          label="이메일"
          placeholder="user@example.com"
          helper-text="업무용 이메일을 입력하세요"
          required
        />
        <SSelect
          v-model="role"
          label="역할"
          placeholder="역할 선택"
          :options="roleOptions"
        />
        <STextarea
          v-model="memo"
          label="메모"
          placeholder="내용을 입력하세요"
          :rows="3"
          show-count
          :max-length="200"
        />
      </div>
    </SCard>

    <section class="card">
      <h2>Checkbox & Radio</h2>
      <div class="form-grid">
        <SCheckbox v-model="agree" label="이용약관에 동의합니다" />
        <SCheckboxGroup
          v-model="interests"
          :options="interestOptions"
          direction="horizontal"
        />
        <SRadioGroup
          v-model="plan"
          name="plan"
          :options="planOptions"
          direction="horizontal"
        />
      </div>
    </section>

    <section class="card">
      <h2>Badge & Chip</h2>
      <div class="row">
        <SBadge variant="primary">primary</SBadge>
        <SBadge variant="success">success</SBadge>
        <SBadge variant="warning">warning</SBadge>
        <SBadge variant="error">error</SBadge>
        <SBadge variant="info" dot>dot</SBadge>
      </div>
      <div class="row">
        <SChip
          v-for="chip in chips"
          :key="chip"
          variant="secondary"
          :on-close="() => removeChip(chip)"
        >
          {{ chip }}
        </SChip>
      </div>
    </section>

    <section class="card">
      <h2>Modal & Toast</h2>
      <div class="row">
        <SButton variant="primary" @click="modalOpen = true">Modal 열기</SButton>
      </div>
      <DesignSystemToastDemo class="toast-demo" />

      <SModal
        :open="modalOpen"
        title="확인"
        description="디자인 시스템 Modal 컴포넌트 샘플입니다."
        @close="modalOpen = false"
      >
        <p>모달 본문 영역입니다. 폼이나 상세 내용을 배치할 수 있습니다.</p>
        <template #footer>
          <SButton variant="ghost" @click="modalOpen = false">취소</SButton>
          <SButton variant="primary" @click="modalOpen = false">확인</SButton>
        </template>
      </SModal>
    </section>

    <section class="card">
      <h2>DatePicker & Pagination</h2>
      <div class="form-grid">
        <SDatePicker
          label="시작일"
          placeholder="날짜 선택"
          @date-change="selectedDate = $event"
        />
        <p v-if="selectedDate" class="hint">
          선택: {{ selectedDate.toLocaleDateString('ko-KR') }}
        </p>
        <SPagination
          :item-count="120"
          :cnt-per-page="10"
          :current-page="currentPage"
          @changed-page="currentPage = $event"
        />
      </div>
    </section>
  </SToastProvider>
</template>

<style lang="scss" scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 480px;
}

.toast-demo {
  margin-top: 0.75rem;
}

.hint {
  margin: 0;
  font-size: 0.9rem;
  color: $color-muted;
}

a {
  color: $color-primary;
}
</style>
