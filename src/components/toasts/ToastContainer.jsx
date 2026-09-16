import { useToast } from './ToastContext'
import styles from './ToastContainer.module.css'

function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.message}
        </div>
      ))}
    </div>
  )
}

export default ToastContainer