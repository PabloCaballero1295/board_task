import { useState } from "react"
import { Task } from "../../types/types"
import styles from "./TaskCard.module.css"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"

interface Props {
  task: Task
  deleteTask: (id: number) => void
  updateTask: (id: number, content: string) => void
}

export const TaskCard = ({ task, deleteTask, updateTask }: Props) => {
  const [mouseIsOver, setMouseIsOver] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const toggleEditMode = () => {
    setEditMode((prev) => !prev)
    setMouseIsOver(false)
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={styles.wrapper_empty}
      ></div>
    )
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={toggleEditMode}
        className={styles.wrapper}
      >
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
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
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
      {mouseIsOver && (
        <MoreHorizIcon
          className={styles.options_button}
          onClick={() => deleteTask(task.id)}
        >
          Del
        </MoreHorizIcon>
      )}
    </div>
  )
}
