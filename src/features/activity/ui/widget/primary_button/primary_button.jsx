"use client"
import styles from "./primary_button.module.css"

const PrimaryButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  icon: iconSrc,
  className = "",
  ...props
}) => {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`${styles.button} ${disabled ? styles.disabled : ""} ${className}`}
      {...props}
    >
      {iconSrc && <img src={iconSrc || "/placeholder.svg"} alt="" className={styles.icon} />}
      <span className={styles.text}>{children}</span>
    </button>
  )
}

export default PrimaryButton
