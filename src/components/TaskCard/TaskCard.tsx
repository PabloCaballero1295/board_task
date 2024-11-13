import { useState } from "react"
import { Task } from "../../types/types"
import styles from "./TaskCard.module.css"

interface Props {
  task: Task
  deleteTask: (id: number) => void
  updateTask: (id: number, content: string) => void
}

export const TaskCard = ({ task, deleteTask, updateTask }: Props) => {
  const [mouseIsOver, setMouseIsOver] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const toggleEditMode = () => {
    setEditMode((prev) => !prev)
    setMouseIsOver(false)
  }

  if (editMode) {
    return (
      <div onClick={toggleEditMode} className={styles.wrapper}>
        <textarea
          className={styles.text_area}
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode()
          }}
          onChange={(e) => {
            updateTask(task.id, e.target.value)
          }}
        ></textarea>
      </div>
    )
  }

  return (
    <div
      onClick={toggleEditMode}
      className={styles.wrapper}
      onMouseEnter={() => {
        setMouseIsOver(true)
      }}
      onMouseLeave={() => {
        setMouseIsOver(false)
      }}
    >
      <p className={styles.task_content}>{task.content}</p>
      {mouseIsOver && <button onClick={() => deleteTask(task.id)}>Del</button>}
    </div>
  )
}
