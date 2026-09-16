import styles from './Button.module.css'

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const variantClass = styles[`btn-${variant}`] || styles['btn-primary']
  const sizeClass = styles[`btn-${size}`] || styles['btn-medium']
  const fullWidthClass = fullWidth ? styles['btn-full'] : ''

  return (
    <button
      type={type}
      className={`${styles.btn} ${variantClass} ${sizeClass} ${fullWidthClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button