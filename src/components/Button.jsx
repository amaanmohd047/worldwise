import styles from "./Button.module.css";

export default function Button({ children, type, onHandleClick }) {
  return (
    <button className={`${styles.btn} ${styles[type]}`} onClick={onHandleClick}>
      {children}
    </button>
  );
}
