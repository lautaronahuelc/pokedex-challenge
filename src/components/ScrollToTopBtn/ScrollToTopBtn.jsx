import { useEffect } from 'react';
import styles from './ScrollToTopBtn.module.css';





function ScrollToTopBtn() {
  function scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  useEffect(() => {
    function handleScroll() {
      // llegamos al boton o estamos cerca?
    }

    addEventListener('scroll', handleScroll);
  }, [window.scrollY]);

  const showScrollToTopBtn = window.scrollY >= window.visualViewport.height;

  console.log('scrollY', window.scrollY);
  console.log('visualViewport.height', window.visualViewport.height);
  console.log(showScrollToTopBtn);

  return (
    <div className={styles['btt-container']}>
      <button className={styles['btt-button']} onClick={scrollToTop}>
        Go to top
      </button>      
    </div>
  );
}

export default ScrollToTopBtn;