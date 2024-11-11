import { Column } from "../Column/Column"
import { Task } from "../Task/Task"
import styles from "./table.module.css"

export const Table = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Tabla</div>
      <div className={styles.table}>
        <Column>
          <Task name="asd"></Task>
          <Task name="asd"></Task>
          <Task name="asd"></Task>
        </Column>
        <Column>
          <Task name="asd"></Task>
        </Column>

        <Column />
      </div>
    </div>
  )
}
