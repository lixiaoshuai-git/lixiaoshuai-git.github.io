<template>
  <div class="page-container">
    <div class="header-bar">
      <div class="header-content">
        <div class="logo-area">
          <div class="logo-text">
            <h1>学生心理健康测评系统</h1>
            <p>Student Psychological Assessment System</p>
          </div>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="info-card">
        <div class="card-header">
          <h2>学生信息录入</h2>
          <span class="step-badge">步骤 1 / 3</span>
        </div>

        <div class="notice-box">
          <div class="notice-content">
            <p>本测评旨在了解您近期的心理健康状况，所有信息将严格保密。请如实填写个人信息并认真完成测评问卷，测评结果将自动提交至学校心理健康管理系统。</p>
          </div>
        </div>

        <form class="info-form" @submit.prevent="handleSubmit">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label required">姓名</label>
              <input
                v-model="form.name"
                type="text"
                class="form-input"
                placeholder="请输入学生姓名"
                maxlength="20"
              />
              <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">学号</label>
              <input
                v-model="form.studentId"
                type="text"
                class="form-input"
                placeholder="请输入学号"
                maxlength="30"
              />
              <span v-if="errors.studentId" class="error-msg">{{ errors.studentId }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label required">性别</label>
              <div class="radio-group">
                <label class="radio-item" :class="{ active: form.gender === 'male' }">
                  <input v-model="form.gender" type="radio" value="male" />
                  <span>男</span>
                </label>
                <label class="radio-item" :class="{ active: form.gender === 'female' }">
                  <input v-model="form.gender" type="radio" value="female" />
                  <span>女</span>
                </label>
              </div>
              <span v-if="errors.gender" class="error-msg">{{ errors.gender }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">年龄</label>
              <input
                v-model.number="form.age"
                type="number"
                class="form-input"
                placeholder="请输入年龄"
                min="10"
                max="40"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">学院/专业</label>
              <input
                v-model="form.major"
                type="text"
                class="form-input"
                placeholder="请输入学院及专业"
                maxlength="50"
              />
            </div>

            <div class="form-group">
              <label class="form-label">年级</label>
              <select v-model="form.grade" class="form-input form-select">
                <option value="">请选择年级</option>
                <option value="大一">大一</option>
                <option value="大二">大二</option>
                <option value="大三">大三</option>
                <option value="大四">大四</option>
                <option value="研一">研一</option>
                <option value="研二">研二</option>
                <option value="研三">研三</option>
                <option value="其他">其他</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">联系电话（选填）</label>
            <input
              v-model="form.phone"
              type="text"
              class="form-input"
              placeholder="请输入联系电话"
              maxlength="11"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="!isFormValid">
              进入测评
            </button>
          </div>
        </form>
      </div>

      <div class="info-footer">
        <p>本系统仅用于学生心理健康筛查，测评结果由专业人员审阅</p>
        <p>如遇紧急心理危机，请拨打 24 小时心理援助热线：400-161-9995</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'

const emit = defineEmits(['start'])

const form = reactive({
  name: '',
  studentId: '',
  gender: '',
  age: null,
  major: '',
  grade: '',
  phone: '',
})

const errors = ref({})

const isFormValid = computed(() => {
  return form.name.trim() && form.studentId.trim() && form.gender
})

function validate() {
  errors.value = {}
  if (!form.name.trim()) errors.value.name = '请输入姓名'
  if (!form.studentId.trim()) errors.value.studentId = '请输入学号'
  if (!form.gender) errors.value.gender = '请选择性别'
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validate()) return
  emit('start', { ...form })
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-bar {
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  color: white;
  padding: 24px 0;
  box-shadow: var(--shadow);
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-text h1 {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 1px;
}

.logo-text p {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 2px;
  letter-spacing: 0.5px;
}

.content-wrapper {
  flex: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
}

.info-card {
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(180deg, #fafbfc, #f5f7fa);
}

.card-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-dark);
}

.step-badge {
  font-size: 12px;
  color: var(--text-secondary);
  background: #e8ecf0;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.notice-box {
  margin: 24px 32px 0;
  background: #f0f5fa;
  border-left: 4px solid var(--primary-light);
  border-radius: 4px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.notice-content p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.info-form {
  padding: 24px 32px 32px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-group {
  flex: 1;
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 8px;
}

.form-label.required::after {
  content: ' *';
  color: var(--danger);
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 14px;
  color: var(--text);
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(44, 82, 130, 0.1);
}

.form-input::placeholder {
  color: #a0aab8;
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%235a6a7a'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}

.radio-group {
  display: flex;
  gap: 12px;
}

.radio-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.radio-item input {
  display: none;
}

.radio-item.active {
  border-color: var(--primary-light);
  background: rgba(44, 82, 130, 0.08);
  color: var(--primary-dark);
  font-weight: 500;
}

.error-msg {
  display: block;
  font-size: 12px;
  color: var(--danger);
  margin-top: 4px;
}

.form-actions {
  margin-top: 28px;
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  display: flex;
  align-items: center;
  padding: 12px 32px;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 1px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 58, 92, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.info-footer {
  text-align: center;
  margin-top: 24px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 2;
}

.info-footer p:first-child {
  opacity: 0.7;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  .header-content, .content-wrapper {
    padding-left: 16px;
    padding-right: 16px;
  }
  .info-form {
    padding: 20px 20px 24px;
  }
  .card-header, .notice-box {
    margin-left: 0;
    margin-right: 0;
  }
  .notice-box {
    margin: 20px 20px 0;
  }
}
</style>
