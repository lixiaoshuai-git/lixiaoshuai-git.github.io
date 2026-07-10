/**
 * 学生心理健康测评问卷
 * 基于SCL-90与PHQ-9等经典量表改编，适配学生群体
 * 5个维度共20题，每题0-4分，总分0-80分
 */

export const dimensions = [
  { key: 'emotion', name: '情绪状态', icon: 'M', color: '#1a3a5c' },
  { key: 'anxiety', name: '焦虑状况', icon: 'A', color: '#2c5282' },
  { key: 'social', name: '人际关系', icon: 'S', color: '#3a6ea5' },
  { key: 'academic', name: '学业压力', icon: 'W', color: '#4a7fb8' },
  { key: 'lifestyle', name: '生活状态', icon: 'L', color: '#5a90cc' },
]

export const options = [
  { value: 0, label: '从不', desc: '完全没有此情况' },
  { value: 1, label: '偶尔', desc: '一周内1-2天有此情况' },
  { value: 2, label: '有时', desc: '一周内3-4天有此情况' },
  { value: 3, label: '经常', desc: '一周内5-6天有此情况' },
  { value: 4, label: '总是', desc: '几乎每天均有此情况' },
]

export const questions = [
  // 情绪状态
  { id: 1, dim: 'emotion', text: '过去两周内，我感到情绪低落、沮丧或绝望' },
  { id: 2, dim: 'emotion', text: '过去两周内，我对平时喜欢做的事情失去了兴趣或乐趣' },
  { id: 3, dim: 'emotion', text: '过去两周内，我感到自己没有价值，或对某些事情过度自责' },
  { id: 4, dim: 'emotion', text: '过去两周内，我出现过伤害自己或不想活下去的念头' },

  // 焦虑状况
  { id: 5, dim: 'anxiety', text: '过去两周内，我经常感到紧张、焦虑或烦躁不安' },
  { id: 6, dim: 'anxiety', text: '过去两周内，我无法停止或控制自己的担忧' },
  { id: 7, dim: 'anxiety', text: '过去两周内，我感到很难放松下来' },
  { id: 8, dim: 'anxiety', text: '过去两周内，我容易烦躁或因小事发怒' },

  // 人际关系
  { id: 9, dim: 'social', text: '我感到孤独，或觉得自己与他人疏远' },
  { id: 10, dim: 'social', text: '我在社交场合感到不自在、紧张或害怕' },
  { id: 11, dim: 'social', text: '我难以与同学、室友或老师进行有效沟通' },
  { id: 12, dim: 'social', text: '我觉得自己不被他人理解或接纳' },

  // 学业压力
  { id: 13, dim: 'academic', text: '我感到学业压力过大，难以应对' },
  { id: 14, dim: 'academic', text: '我对考试、作业或成绩感到过度焦虑' },
  { id: 15, dim: 'academic', text: '我难以集中注意力完成学习任务' },
  { id: 16, dim: 'academic', text: '我对未来的学业或职业发展感到迷茫或担忧' },

  // 生活状态
  { id: 17, dim: 'lifestyle', text: '我有入睡困难、睡眠质量差或早醒的问题' },
  { id: 18, dim: 'lifestyle', text: '我的食欲明显下降或明显增加' },
  { id: 19, dim: 'lifestyle', text: '我经常感到疲惫、精力不足或身体不适' },
  { id: 20, dim: 'lifestyle', text: '我缺乏规律的作息和运动习惯' },
]

/**
 * 评分结果分级标准
 */
export const levels = [
  {
    min: 0,
    max: 20,
    level: '良好',
    color: '#2e7d32',
    icon: 'check_circle',
    summary: '心理健康状况良好',
    advice: '您当前的心理健康状况良好，请继续保持积极的生活态度和健康的生活方式。建议定期关注自身心理状态，遇到困难时主动寻求支持。',
    risk: false,
  },
  {
    min: 21,
    max: 40,
    level: '轻度',
    color: '#f9a825',
    icon: 'info',
    summary: '存在轻度心理困扰',
    advice: '您当前存在轻度的心理困扰。建议适当调整生活节奏，增加运动和社交活动，学习压力管理技巧。如困扰持续，可考虑与亲友倾诉或寻求学校心理辅导。',
    risk: false,
  },
  {
    min: 41,
    max: 60,
    level: '中度',
    color: '#e65100',
    icon: 'warning',
    summary: '存在中度心理困扰',
    advice: '您当前存在中度的心理困扰，建议主动寻求帮助。可联系学校心理健康教育中心预约咨询，或与辅导员、信任的师长沟通。保持规律作息，避免独处。',
    risk: true,
  },
  {
    min: 61,
    max: 80,
    level: '重度',
    color: '#b71c1c',
    icon: 'error',
    summary: '存在重度心理困扰',
    advice: '您当前的心理困扰程度较高，强烈建议尽快寻求专业心理帮助。请及时联系学校心理健康教育中心或前往专业医疗机构就诊。您也可以拨打心理援助热线：400-161-9995。',
    risk: true,
  },
]

/**
 * 根据总分获取评级
 */
export function getLevel(score) {
  return levels.find((l) => score >= l.min && score <= l.max) || levels[0]
}

/**
 * 根据维度计算得分
 */
export function getDimensionScores(answers) {
  const scores = {}
  for (const dim of dimensions) {
    const dimQuestions = questions.filter((q) => q.dim === dim.key)
    const dimScore = dimQuestions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0)
    scores[dim.key] = {
      name: dim.name,
      score: dimScore,
      max: dimQuestions.length * 4,
      percent: Math.round((dimScore / (dimQuestions.length * 4)) * 100),
    }
  }
  return scores
}
