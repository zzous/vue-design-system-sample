<script setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  email: yup.string().required('이메일을 입력하세요').email('올바른 이메일 형식이 아닙니다'),
  name: yup.string().required('이름을 입력하세요').min(2, '2자 이상 입력하세요'),
})

const { defineField, errors, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: { email: '', name: '' },
})

const [email, emailAttrs] = defineField('email')
const [name, nameAttrs] = defineField('name')

const onSubmit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2))
})
</script>

<template>
  <section class="card">
    <h2>vee-validate + yup</h2>
    <form class="form" @submit="onSubmit">
      <label class="field">
        <span>이메일</span>
        <input v-model="email" v-bind="emailAttrs" type="email" />
        <em v-if="errors.email">{{ errors.email }}</em>
      </label>
      <label class="field">
        <span>이름</span>
        <input v-model="name" v-bind="nameAttrs" type="text" />
        <em v-if="errors.name">{{ errors.name }}</em>
      </label>
      <div class="actions">
        <button type="submit" class="btn">제출</button>
        <button type="button" class="btn btn--ghost" @click="resetForm">초기화</button>
      </div>
    </form>
  </section>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  span {
    font-weight: 600;
    font-size: 0.9rem;
  }

  input {
    padding: 0.5rem 0.75rem;
    border: 1px solid $color-border;
    border-radius: 6px;
    font-size: 1rem;
  }

  em {
    color: #c0392b;
    font-size: 0.8rem;
    font-style: normal;
  }
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>
