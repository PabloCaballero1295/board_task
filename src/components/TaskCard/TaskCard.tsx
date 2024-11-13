import { useState } from "react"
import { Task } from "../../types/types"
import styles from "./TaskCard.module.css"

interface Props {
  task: Task
  deleteTask: (id: number) => void
}

export const TaskCard = ({ task, deleteTask }: Props) => {
  const [mouseIsOver, setMouseIsOver] = useState(false)

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => {
        setMouseIsOver(true)
      }}
      onMouseLeave={() => {
        setMouseIsOver(false)
      }}
    >
      {task.content}
      {mouseIsOver && <button onClick={() => deleteTask(task.id)}>Del</button>}
    </div>
  )
}
