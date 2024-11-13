import { useSortable } from "@dnd-kit/sortable"
import { Column, Task } from "../../types/types"
import styles from "./ColumnContainer.module.css"
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react"
import { TaskCard } from "../TaskCard/TaskCard"

interface Props {
  column: Column
  deleteColumn: (id: number) => void
  updateColumn: (id: number, title: string) => void
  createTask: (columnId: number) => void
  deleteTask: (id: number) => void
  tasks: Task[]
}

export const ColumnContainer = (props: Props) => {
  const { column, deleteColumn, updateColumn, createTask, deleteTask, tasks } =
    props

  const [editMode, setEditMode] = useState(false)

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
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
        className={styles.wrapper_dragging}
      ></div>
    )
  }

  return (
    <div ref={setNodeRef} style={style} className={styles.wrapper}>
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className={styles.header}
      >
        <div>0</div>
        <div className={styles.title}>
          {!editMode && column.title}
          {editMode && (
            <input
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false)
              }}
              onKeyDown={(e) => {
                if (e.key != "Enter") return
                setEditMode(false)
              }}
            ></input>
          )}
        </div>
        <button
          className={styles.delete_column}
          onClick={() => deleteColumn(column.id)}
        >
          del
        </button>
      </div>
      <div className={styles.content}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} deleteTask={deleteTask} />
        ))}
      </div>
      <button
        className={styles.add_task}
        onClick={() => {
          createTask(column.id)
        }}
      >
        Add task
      </button>
    </div>
  )
}
