<template>
  <transition name="fade" mode="out-in">
    <StudentInfo
      v-if="step === 'info'"
      key="info"
      @start="handleStart"
    />
    <Assessment
      v-else-if="step === 'assessment'"
      key="assessment"
      @complete="handleComplete"
      @back="step = 'info'"
    />
    <Result
      v-else
      key="result"
      :student-info="studentInfo"
      :total-score="totalScore"
      :answers="answers"
      @restart="handleRestart"
    />
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import StudentInfo from './components/StudentInfo.vue'
import Assessment from './components/Assessment.vue'
import Result from './components/Result.vue'

const step = ref('info')
const studentInfo = ref({})
const totalScore = ref(0)
const answers = ref({})

function handleStart(info) {
  studentInfo.value = info
  step.value = 'assessment'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleComplete(result) {
  totalScore.value = result.totalScore
  answers.value = result.answers
  step.value = 'result'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleRestart() {
  step.value = 'info'
  studentInfo.value = {}
  totalScore.value = 0
  answers.value = {}
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
