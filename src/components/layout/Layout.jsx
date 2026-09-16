import ToastContainer from '../toasts/ToastContainer'
import Header from './Header'
import styles from './Layout.module.css'

function Layout({ children }) {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>{children}</main>
      <ToastContainer />
    </div>
  )
}

export default Layout