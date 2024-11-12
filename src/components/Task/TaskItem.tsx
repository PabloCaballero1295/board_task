import { useRef } from "react"
import { DragItem, Task } from "../../types/types"
import styles from "./TaskItem.module.css"
import { useDrag, useDrop } from "react-dnd"

interface TaskProps {
  task: Task
  index: number
  moveTask: (dragIndex: number, hoverIndex: number) => void
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

export const TaskItem = ({ task, index, moveTask, setTasks }: TaskProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { type: "TASK", id: task.id, index, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "TASK",
    hover: (item: DragItem) => {
      if (!ref.current) return

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      moveTask(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
  })

  drag(drop(ref))

  const deleteTask = () => {
    setTasks((prev) => {
      const array_copy = [...prev]

      prev.map((t, index) => {
        if (t.id == task.id) {
          array_copy.splice(index, 1)
        }
      })

      return [...array_copy]
    })
  }

  return (
    <div
      ref={ref}
      className={`${styles.wrapper} ${isDragging ? styles.dragging : ""}`}
    >
      <div className={styles.name}>{task.text}</div>
      <button className={styles.delete_button} onClick={deleteTask}>
        borrar
      </button>
    </div>
  )
}
