import { useDrop } from "react-dnd"
import styles from "./Column.module.css"
import { ColumnType, DragItem, Task } from "../../types/types"
import { TaskItem } from "../Task/TaskItem"

interface ColumnProps {
  status: ColumnType
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

export const Column = ({ status, tasks, setTasks }: ColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item: DragItem) => addItemToSection(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  const addItemToSection = (item: DragItem) => {
    if (item.status !== status) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === item.id ? { ...task, status } : task
        )
      )
    }
  }

  const moveTask = (dragIndex: number, hoverIndex: number) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks]
      const [movedTask] = newTasks.splice(dragIndex, 1)
      newTasks.splice(hoverIndex, 0, movedTask)
      return newTasks.map((task, idx) =>
        newTasks.includes(task) ? { ...task, index: idx } : task
      )
    })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{status}</div>
      <div
        className={`${styles.content}  ${isOver ? styles.over : ""}`}
        ref={drop}
      >
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            index={index}
            moveTask={moveTask}
          />
        ))}
      </div>
    </div>
  )
}
