import { useDrop } from "react-dnd"
import styles from "./Column.module.css"
import { ColumnType, DragItem, Task_ } from "../../types/types"
import { TaskItem } from "../Task/TaskItem"
import { v4 as uuidv4 } from "uuid"
import { ChangeEvent, useState } from "react"

interface ColumnProps {
  status: ColumnType
  tasks: Task_[]
  setTasks: React.Dispatch<React.SetStateAction<Task_[]>>
}

export const Column = ({ status, tasks, setTasks }: ColumnProps) => {
  const [taskName, setTaskName] = useState("")

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item: DragItem) => addItemToSection(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  const addItemToSection = (item: DragItem) => {
    if (item.status !== status.id) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === item.id ? { ...task, status: status.id } : task
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

  const createNewTask = () => {
    if (taskName.length == 0) {
      return
    }

    if (taskName.trim().length == 0) {
      return
    }

    const id = uuidv4()
    const newTask = { id: id, text: taskName, status: status.id, type: "TASK" }

    setTasks((prevTasks) => [...prevTasks, newTask])
    setTaskName("")
  }

  const handleTaskNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>{status.name}</div>
        <div className={styles.tasks_counter}>{tasks.length}</div>
      </div>
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
            setTasks={setTasks}
          />
        ))}
      </div>
      <div className={styles.footer}>
        <input
          value={taskName}
          onChange={handleTaskNameChange}
          className={styles.task_input}
          type="text"
          placeholder="Nueva tarea ..."
        ></input>
        <button className={styles.add_task_button} onClick={createNewTask}>
          Añadir
        </button>
      </div>
    </div>
  )
}
