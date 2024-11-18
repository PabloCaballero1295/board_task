import { useState } from "react"
import { Task } from "../../types/types"
import styles from "./TaskCard.module.css"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TaskMenu } from "../TaskMenu/TaskMenu"

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

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={styles.wrapper_empty}
      ></div>
    )
  }

  const updateEditMode = (mode: boolean) => {
    setEditMode(mode)
  }

  const updateOnMouseOver = (value: boolean) => {
    setMouseIsOver(value)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
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
        <TaskMenu
          id={task.id}
          content={task.content}
          updateTask={updateTask}
          deleteTask={deleteTask}
          updateEditMode={updateEditMode}
          updateOnMouseOver={updateOnMouseOver}
        />
      )}
    </div>
  )
}
