import ToastContainer from '../toasts/ToastContainer'
import Header from './Header'
import ScrollToTopBtn from '../ScrollToTopBtn/ScrollToTopBtn'
import styles from './Layout.module.css'

function Layout({ children }) {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>{children}</main>
      <ToastContainer />
      <ScrollToTopBtn />
    </div>
  )
}

export default Layout