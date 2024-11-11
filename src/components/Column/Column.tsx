import styles from "./Column.module.css"

interface ColumnProps {
  children?: string | JSX.Element | JSX.Element[]
}

export const Column = ({ children }: ColumnProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Title</div>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
