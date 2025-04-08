import { ElMessage } from 'element-plus'

type ToastType = 'success' | 'warning' | 'error' | 'info'

/**
 * 显示消息提示
 * @param message 提示内容
 * @param type 提示类型: success, warning, error, info
 * @param duration 显示时长(毫秒)
 */
export function useToast(message: string, type: ToastType = 'info', duration = 3000) {
  ElMessage({
    message,
    type,
    duration,
    showClose: true
  })
} 