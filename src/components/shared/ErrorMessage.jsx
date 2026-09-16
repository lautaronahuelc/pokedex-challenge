import Button from './Button';
import styles from './ErrorMessage.module.css';

function ErrorMessage({ title = 'Algo salió mal', message = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.', onRetry }) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon} aria-hidden="true">⚠️</div>
      <h2 className={styles.errorTitle}>{title}</h2>
      <p className={styles.errorDescription}>{message}</p>
      {onRetry && (
        <Button className={styles.retryButton} onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}

export default ErrorMessage