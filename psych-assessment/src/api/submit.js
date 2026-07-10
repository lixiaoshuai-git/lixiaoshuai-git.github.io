/**
 * 测评结果提交 - 苍穹IFrame嵌入模式
 *
 * 原理：Vue页面在iframe内，通过 window.parent.postMessage()
 * 把测评数据发给苍穹父页面（动态表单），由苍穹表单插件(Java)
 * 接收后调用 SaveServiceHelper 保存到单据 kded_risk_alert_bill。
 *
 * 数据流：
 *   Vue(iframe) --postMessage--> 苍穹动态表单 --customEvent--> 表单插件(Java) --save--> 单据
 *
 * 同时监听父页面的回传消息，获取保存结果。
 */

const MESSAGE_TYPE = 'psych-assessment-submit'

/**
 * 格式化当前时间
 */
function formatTime() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

/**
 * 提交测评结果（通过 postMessage 发给苍穹父页面）
 * @param {Object} params - { score, studentName, studentId }
 * @returns {Promise<Object>} 保存结果
 */
export async function submitAssessment({ score, studentName, studentId }) {
  const payload = {
    type: MESSAGE_TYPE,
    data: {
      code_score: score,
      kd_student_name: studentName,
      kd_studentid: studentId,
      kd_trigger_time: formatTime(),
    },
  }

  return new Promise((resolve) => {
    let resolved = false

    // 监听苍穹父页面的回传消息
    function handleMessage(event) {
      if (event.data && event.data.type === MESSAGE_TYPE + '-result') {
        window.removeEventListener('message', handleMessage)
        if (!resolved) {
          resolved = true
          resolve(event.data.success
            ? { success: true, data: event.data.data }
            : { success: false, error: event.data.error || '苍穹表单插件返回失败' }
          )
        }
      }
    }

    window.addEventListener('message', handleMessage)

    // 向苍穹父页面发送测评数据
    window.parent.postMessage(payload, '*')

    // 超时保护（15秒）
    setTimeout(() => {
      if (!resolved) {
        resolved = true
        window.removeEventListener('message', handleMessage)
        resolve({
          success: false,
          error: '苍穹父页面未响应（超时15秒）。请确认：1.苍穹动态表单已注册表单插件；2.插件已监听 message 事件；3.Vue页面确实在苍穹iframe内运行。',
        })
      }
    }, 15000)
  })
}
