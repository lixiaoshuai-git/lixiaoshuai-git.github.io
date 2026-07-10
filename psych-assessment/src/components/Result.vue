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
      <div class="result-card">
        <div class="card-header">
          <h2>测评结果报告</h2>
          <span class="step-badge">步骤 3 / 3</span>
        </div>

        <!-- 学生信息摘要 -->
        <div class="student-summary">
          <div class="summary-item">
            <span class="summary-label">姓名</span>
            <span class="summary-value">{{ studentInfo.name }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">学号</span>
            <span class="summary-value">{{ studentInfo.studentId }}</span>
          </div>
          <div class="summary-item" v-if="studentInfo.gender">
            <span class="summary-label">性别</span>
            <span class="summary-value">{{ studentInfo.gender === 'male' ? '男' : '女' }}</span>
          </div>
          <div class="summary-item" v-if="studentInfo.grade">
            <span class="summary-label">年级</span>
            <span class="summary-value">{{ studentInfo.grade }}</span>
          </div>
          <div class="summary-item" v-if="studentInfo.major">
            <span class="summary-label">专业</span>
            <span class="summary-value">{{ studentInfo.major }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">测评时间</span>
            <span class="summary-value">{{ currentTime }}</span>
          </div>
        </div>

        <!-- 总分与评级 -->
        <div class="score-section">
          <div class="score-main">
            <div class="score-ring" :style="{ '--ring-color': level.color, '--pct': scorePercent }">
              <div class="score-inner">
                <span class="score-number">{{ totalScore }}</span>
                <span class="score-total">/ {{ maxScore }}</span>
              </div>
            </div>
            <div class="score-label">
              <span class="level-tag" :style="{ background: level.color }">{{ level.level }}</span>
              <p class="level-summary">{{ level.summary }}</p>
            </div>
          </div>
        </div>

        <!-- 维度分析 -->
        <div class="dimension-section">
          <h3 class="section-title">维度分析</h3>
          <div class="dimension-list">
            <div v-for="dim in dimensionScores" :key="dim.name" class="dimension-bar">
              <div class="dim-bar-header">
                <span class="dim-bar-name">{{ dim.name }}</span>
                <span class="dim-bar-score">{{ dim.score }} / {{ dim.max }}</span>
              </div>
              <div class="dim-bar-track">
                <div
                  class="dim-bar-fill"
                  :style="{
                    width: dim.percent + '%',
                    background: getDimColor(dim.percent)
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 建议 -->
        <div class="advice-section">
          <h3 class="section-title">专业建议</h3>
          <div class="advice-box" :style="{ borderLeftColor: level.color }">
            <p>{{ level.advice }}</p>
          </div>
          <div v-if="level.risk" class="emergency-box">
            <div>
              <p class="emergency-title">温馨提示</p>
              <p class="emergency-text">如果您正经历心理困扰，请及时寻求帮助。24小时心理援助热线：<strong>400-161-9995</strong>，北京心理危机研究与干预中心：<strong>010-82951332</strong></p>
            </div>
          </div>
        </div>

        <!-- 提交状态 -->
        <div class="submit-section">
          <h3 class="section-title">数据提交</h3>
          <div v-if="submitStatus === 'pending'" class="submit-status pending">
            <div class="spinner"></div>
            <span>正在提交测评结果至学校心理健康管理系统...</span>
          </div>
          <div v-else-if="submitStatus === 'success'" class="submit-status success">
            <div>
              <span>测评结果已成功提交</span>
              <p class="submit-detail">提交时间：{{ submittedTime }}</p>
            </div>
          </div>
          <div v-else-if="submitStatus === 'error'" class="submit-status error">
            <div>
              <span>提交失败：{{ submitError }}</span>
              <button class="retry-btn" @click="retrySubmit">重新提交</button>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <button class="btn-secondary" @click="$emit('restart')">
            重新测评
          </button>
          <button class="btn-primary" @click="handlePrint">
            打印报告
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { getLevel, getDimensionScores, questions } from '../data/questions.js'
import { submitAssessment } from '../api/submit.js'

const props = defineProps({
  studentInfo: { type: Object, required: true },
  totalScore: { type: Number, required: true },
  answers: { type: Object, required: true },
})

const emit = defineEmits(['restart'])

const maxScore = questions.length * 4
const scorePercent = computed(() => Math.round((props.totalScore / maxScore) * 100))
const level = computed(() => getLevel(props.totalScore))
const dimensionScores = computed(() => Object.values(getDimensionScores(props.answers)))

const currentTime = new Date().toLocaleString('zh-CN', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit'
})

const submitStatus = ref('pending')
const submitError = ref('')
const submittedTime = ref('')

function getDimColor(percent) {
  if (percent <= 25) return 'linear-gradient(90deg, #2e7d32, #43a047)'
  if (percent <= 50) return 'linear-gradient(90deg, #f9a825, #ffb300)'
  if (percent <= 75) return 'linear-gradient(90deg, #e65100, #f57c00)'
  return 'linear-gradient(90deg, #b71c1c, #d32f2f)'
}

async function doSubmit() {
  submitStatus.value = 'pending'
  const result = await submitAssessment({
    score: props.totalScore,
    studentName: props.studentInfo.name,
    studentId: props.studentInfo.studentId,
  })
  if (result.success) {
    submitStatus.value = 'success'
    submittedTime.value = new Date().toLocaleString('zh-CN')
  } else {
    submitStatus.value = 'error'
    submitError.value = result.error
  }
}

function retrySubmit() {
  doSubmit()
}

function handlePrint() {
  window.print()
}

onMounted(() => {
  doSubmit()
})
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

.result-card {
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

.student-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 20px 32px;
  background: #f8fafc;
  border-bottom: 1px solid var(--border);
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.summary-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

.score-section {
  padding: 32px;
  border-bottom: 1px solid var(--border);
}

.score-main {
  display: flex;
  align-items: center;
  gap: 32px;
  justify-content: center;
}

.score-ring {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: conic-gradient(var(--ring-color) calc(var(--pct, 0) * 1%), #e8ecf0 0);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}

.score-ring::before {
  content: '';
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: white;
}

.score-inner {
  position: relative;
  z-index: 1;
  text-align: center;
}

.score-number {
  font-size: 42px;
  font-weight: 700;
  color: var(--ring-color, var(--primary));
  line-height: 1;
}

.score-total {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.score-label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.level-tag {
  display: inline-block;
  padding: 6px 20px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: 20px;
  align-self: flex-start;
}

.level-summary {
  font-size: 15px;
  color: var(--text);
  font-weight: 500;
}

.dimension-section {
  padding: 24px 32px;
  border-bottom: 1px solid var(--border);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 16px;
  padding-left: 10px;
  border-left: 3px solid var(--primary);
}

.dimension-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.dimension-bar {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dim-bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dim-bar-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

.dim-bar-score {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.dim-bar-track {
  height: 10px;
  background: #eef0f3;
  border-radius: 5px;
  overflow: hidden;
}

.dim-bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.8s ease;
}

.advice-section {
  padding: 24px 32px;
  border-bottom: 1px solid var(--border);
}

.advice-box {
  background: #f8fafc;
  border-left: 4px solid var(--primary);
  border-radius: 4px;
  padding: 16px 20px;
  margin-bottom: 16px;
}

.advice-box p {
  font-size: 14px;
  color: var(--text);
  line-height: 1.8;
}

.emergency-box {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #fff3e0;
  border-radius: 6px;
  padding: 16px;
}

.emergency-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--warning);
  margin-bottom: 4px;
}

.emergency-text {
  font-size: 13px;
  color: var(--text);
  line-height: 1.6;
}

.emergency-text strong {
  color: var(--danger);
}

.submit-section {
  padding: 24px 32px;
  border-bottom: 1px solid var(--border);
}

.submit-status {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 6px;
  font-size: 14px;
}

.submit-status.pending {
  background: #f0f5fa;
  color: var(--primary-dark);
}

.submit-status.success {
  background: #e8f5e9;
  color: var(--success);
}

.submit-status.error {
  background: #ffebee;
  color: var(--danger);
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.submit-status.error > div {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.submit-detail {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.retry-btn {
  padding: 4px 16px;
  background: var(--danger);
  color: white;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.retry-btn:hover {
  opacity: 0.9;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #c5d4e8;
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-actions {
  display: flex;
  justify-content: space-between;
  padding: 24px 32px;
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
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 58, 92, 0.3);
}

@media (max-width: 600px) {
  .score-main {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  .score-label {
    align-items: center;
  }
  .student-summary {
    gap: 16px;
  }
  .header-content, .content-wrapper {
    padding-left: 16px;
    padding-right: 16px;
  }
  .student-summary, .score-section, .dimension-section, .advice-section, .submit-section, .form-actions {
    padding-left: 16px;
    padding-right: 16px;
  }
  .card-header {
    padding: 20px 16px;
  }
}
</style>
