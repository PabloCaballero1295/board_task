import { useState } from "react"
import { Task_ } from "../../types/types"
import { Column } from "../Column/Column"
import styles from "./table.module.css"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ColumnType } from "../../types/types"

export const Table = () => {
  const [tasks, setTasks] = useState<Task_[]>([
    { id: "1", text: "TASK 1", status: "TODO" },
    { id: "2", text: "TASK 2", status: "IN_PROGRESS" },
    { id: "3", text: "TASK 3", status: "DONE" },
  ])

  const columns: ColumnType[] = [
    { id: "TODO", name: "TODO" },
    { id: "IN_PROGRESS", name: "EN PROGRESO" },
    { id: "DONE", name: "HECHO" },
  ]

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Tabla</div>
      <div className={styles.table}>
        <DndProvider backend={HTML5Backend}>
          {columns.map((column) => (
            <Column
              key={column.id}
              status={column}
              tasks={tasks.filter((task) => task.status === column.id)}
              setTasks={setTasks}
            />
          ))}
        </DndProvider>
      </div>
    </div>
  )
}
