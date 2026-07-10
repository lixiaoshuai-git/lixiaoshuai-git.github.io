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
      <div class="assessment-card">
        <div class="card-header">
          <div class="header-left">
            <h2>心理健康测评问卷</h2>
            <span class="step-badge">步骤 2 / 3</span>
          </div>
          <div class="progress-info">
            <span class="progress-count">{{ answeredCount }} / {{ questions.length }}</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="instructions">
          <p>请根据您<strong>最近两周</strong>的实际情况，选择最符合您状态的选项。本测评共 {{ questions.length }} 题，涵盖五个维度。请如实作答，无对错之分。</p>
        </div>

        <div class="question-list">
          <div
            v-for="(dim, dimIdx) in dimensionGroups"
            :key="dim.key"
            class="dimension-section"
          >
            <div class="dimension-header">
              <span class="dim-index">{{ dimIdx + 1 }}</span>
              <span class="dim-name">{{ dim.name }}</span>
              <span class="dim-count">{{ dim.questions.length }} 题</span>
            </div>

            <div
              v-for="q in dim.questions"
              :key="q.id"
              class="question-item"
              :class="{ answered: answers[q.id] !== undefined }"
            >
              <div class="question-top">
                <span class="question-num">Q{{ q.id }}</span>
                <p class="question-text">{{ q.text }}</p>
              </div>
              <div class="option-group">
                <label
                  v-for="opt in options"
                  :key="opt.value"
                  class="option-item"
                  :class="{ selected: answers[q.id] === opt.value }"
                >
                  <input
                    type="radio"
                    :name="'q' + q.id"
                    :value="opt.value"
                    v-model="answers[q.id]"
                  />
                  <span class="option-radio"></span>
                  <span class="option-label">{{ opt.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-secondary" @click="$emit('back')">
            返回修改
          </button>
          <button
            class="btn-primary"
            :disabled="!allAnswered"
            @click="handleSubmit"
          >
            提交测评
          </button>
        </div>

        <div v-if="!allAnswered && showHint" class="submit-hint">
          <span>还有 {{ questions.length - answeredCount }} 道题未作答，请完成所有题目后再提交</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { questions, options, dimensions } from '../data/questions.js'

const emit = defineEmits(['complete', 'back'])

const answers = reactive({})
const showHint = ref(false)

const dimensionGroups = computed(() => {
  return dimensions.map((dim) => ({
    ...dim,
    questions: questions.filter((q) => q.dim === dim.key),
  }))
})

const answeredCount = computed(() => {
  return Object.keys(answers).filter((k) => answers[k] !== undefined).length
})

const progressPercent = computed(() => {
  return Math.round((answeredCount.value / questions.length) * 100)
})

const allAnswered = computed(() => {
  return answeredCount.value === questions.length
})

function handleSubmit() {
  if (!allAnswered.value) {
    showHint.value = true
    setTimeout(() => (showHint.value = false), 3000)
    return
  }
  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0)
  emit('complete', { answers: { ...answers }, totalScore })
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
  max-width: 860px;
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
}

.content-wrapper {
  flex: 1;
  max-width: 860px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
}

.assessment-card {
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

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
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

.progress-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-count {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-dark);
  white-space: nowrap;
}

.progress-bar {
  width: 120px;
  height: 6px;
  background: #e0e4ea;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--primary-light));
  border-radius: 3px;
  transition: width 0.3s ease;
}

.instructions {
  padding: 20px 32px;
  background: #f0f5fa;
  border-bottom: 1px solid var(--border);
}

.instructions p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.instructions strong {
  color: var(--primary-dark);
}

.question-list {
  padding: 16px 0;
}

.dimension-section {
  margin-bottom: 8px;
}

.dimension-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px 8px;
  border-bottom: 1px solid #eef0f3;
}

.dim-index {
  width: 24px;
  height: 24px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.dim-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--primary-dark);
}

.dim-count {
  font-size: 12px;
  color: var(--text-secondary);
  margin-left: auto;
}

.question-item {
  padding: 20px 32px;
  border-bottom: 1px solid #f0f2f5;
  transition: background 0.2s;
}

.question-item:hover {
  background: #fafbfc;
}

.question-item.answered {
  background: #f6faf6;
}

.question-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 14px;
}

.question-num {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-light);
  background: rgba(44, 82, 130, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  flex-shrink: 0;
  margin-top: 1px;
}

.question-text {
  font-size: 14px;
  color: var(--text);
  line-height: 1.6;
}

.option-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-left: 42px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
  transition: all 0.2s;
  background: #fff;
}

.option-item input {
  display: none;
}

.option-radio {
  width: 14px;
  height: 14px;
  border: 2px solid #c0c8d4;
  border-radius: 50%;
  transition: all 0.2s;
  flex-shrink: 0;
}

.option-item:hover {
  border-color: var(--primary-light);
  color: var(--primary-dark);
}

.option-item:hover .option-radio {
  border-color: var(--primary-light);
}

.option-item.selected {
  border-color: var(--primary);
  background: rgba(26, 58, 92, 0.08);
  color: var(--primary-dark);
  font-weight: 500;
}

.option-item.selected .option-radio {
  border-color: var(--primary);
  background: var(--primary);
  box-shadow: inset 0 0 0 2px #fff;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  padding: 24px 32px;
  border-top: 1px solid var(--border);
  background: #fafbfc;
}

.btn-secondary {
  display: flex;
  align-items: center;
  padding: 10px 24px;
  background: #fff;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.btn-secondary:hover {
  border-color: var(--primary-light);
  color: var(--primary-dark);
}

.btn-primary {
  display: flex;
  align-items: center;
  padding: 10px 32px;
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

.submit-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: #fff3e0;
  color: var(--warning);
  font-size: 13px;
  border-top: 1px solid var(--border);
}

@media (max-width: 600px) {
  .option-group {
    flex-direction: column;
    padding-left: 0;
  }
  .option-item {
    width: 100%;
    justify-content: center;
  }
  .header-content, .content-wrapper {
    padding-left: 16px;
    padding-right: 16px;
  }
  .question-item, .dimension-header, .form-actions {
    padding-left: 16px;
    padding-right: 16px;
  }
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 20px 16px;
  }
  .instructions {
    padding: 16px;
  }
}
</style>
