import { useEffect, useState } from "react"
import styles from "./Task.module.css"

interface TaskProps {
  name: string
}

export const Task = ({ name }: TaskProps) => {
  const [taskName, setTaskName] = useState(name)

  useEffect(() => {
    setTaskName(name)
  }, [name])

  return (
    <div className={styles.wrapper}>
      <div className={styles.name}>{taskName}</div>
    </div>
  )
}
