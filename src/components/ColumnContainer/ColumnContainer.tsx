import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { Column, Task } from "../../types/types"
import styles from "./ColumnContainer.module.css"
import { CSS } from "@dnd-kit/utilities"
import { useMemo, useState } from "react"
import { TaskCard } from "../TaskCard/TaskCard"
import { MoreHoriz } from "@mui/icons-material"

interface Props {
  column: Column
  deleteColumn: (id: number) => void
  updateColumn: (id: number, title: string) => void
  createTask: (columnId: number) => void
  deleteTask: (id: number) => void
  updateTask: (id: number, content: string) => void
  tasks: Task[]
}

export const ColumnContainer = (props: Props) => {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    deleteTask,
    updateTask,
    tasks,
  } = props

  const [editMode, setEditMode] = useState(false)
  const [mouseIsOver, setMouseIsOver] = useState(false)

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id)
  }, [tasks])

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
    <div
      ref={setNodeRef}
      style={style}
      className={styles.wrapper}
      onMouseEnter={() => {
        setMouseIsOver(true)
      }}
      onMouseLeave={() => {
        setMouseIsOver(false)
      }}
    >
      <div {...attributes} {...listeners} className={styles.header}>
        <div className={styles.task_number}>{tasks.length}</div>
        <div className={styles.title} onClick={() => setEditMode(true)}>
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
        {mouseIsOver && (
          <MoreHoriz
            className={styles.delete_column}
            onClick={() => deleteColumn(column.id)}
          >
            del
          </MoreHoriz>
        )}
      </div>
      <div className={styles.content}>
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
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
