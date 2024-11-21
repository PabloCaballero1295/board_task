import { useEffect, useMemo, useState } from "react"
import styles from "./KanbanBoard.module.css"
import { Board, Column, Task } from "../../types/types"
import { ColumnContainer } from "../ColumnContainer/ColumnContainer"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import { createPortal } from "react-dom"
import { TaskCard } from "../TaskCard/TaskCard"

import { v4 as uuidv4 } from "uuid"
import { BoardMenu } from "../BoardMenu/BoardMenu"

export const KanbanBoard = () => {
  const boardKey = "board_todo"

  let boardLocalStorageData = JSON.parse(
    localStorage.getItem(boardKey)!
  ) as Board

  if (boardLocalStorageData == null) {
    const initialBoard = {
      id: uuidv4(),
      name: "My table",
      columns: [],
      tasks: [],
    }

    boardLocalStorageData = initialBoard
  }
  const saveStateOnLocalStorage = (data: Board) => {
    localStorage.setItem(boardKey, JSON.stringify(data))
  }

  const [title, setTitle] = useState(boardLocalStorageData.name)

  const [columns, setColumns] = useState<Column[]>(
    boardLocalStorageData.columns
  )
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns])

  const [tasks, setTasks] = useState<Task[]>(boardLocalStorageData.tasks)

  const [activeColumn, setActiveColumn] = useState<Column | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  useEffect(() => {
    saveStateOnLocalStorage({
      id: boardLocalStorageData.id,
      name: title,
      columns: columns,
      tasks: tasks,
    })
  }, [columns, tasks, title, boardLocalStorageData])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, //3px
      },
    })
  )

  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: "New column",
    }

    setColumns([...columns, columnToAdd])
  }

  const deleteColumn = (id: number) => {
    const filteredColumns = columns.filter((col) => col.id != id)
    setColumns(filteredColumns)

    const newTasks = tasks.filter((t) => t.columnId !== id)
    setTasks(newTasks)
  }

  const updateColumn = (id: number, title: string) => {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col
      return { ...col, title }
    })
    setColumns(newColumns)
  }

  const createTask = (columnId: number) => {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    }

    setTasks([...tasks, newTask])
  }

  const updateTask = (id: number, content: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task
      return { ...task, content }
    })

    setTasks(newTasks)
  }

  const deleteTask = (id: number) => {
    const newTasks = tasks.filter((task) => task.id != id)
    setTasks(newTasks)
  }

  const onDragStart = (event: DragStartEvent) => {
    //console.log("DRAG START", event)
    if (event.active.data.current?.type == "Column") {
      setActiveColumn(event.active.data.current.column)
      return
    }

    if (event.active.data.current?.type == "Task") {
      setActiveTask(event.active.data.current.task)
      return
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null)
    setActiveTask(null)
    //console.log("DRAG END", event)
    const { active, over } = event
    if (!over) return

    const activeColumnId = active.id
    const overColumnId = over.id

    if (activeColumnId === overColumnId) return

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      )
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      )

      return arrayMove(columns, activeColumnIndex, overColumnIndex)
    })
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    //Drop over a Task

    const isActiveATask = active.data.current?.type === "Task"
    const isOverATask = over.data.current?.type === "Task"

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const overIndex = tasks.findIndex((t) => t.id === overId)

        tasks[activeIndex].columnId = tasks[overIndex].columnId

        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    const isOverAColumn = over.data.current?.type === "Column"

    //Drop over a Column

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)

        tasks[activeIndex].columnId = overId as number

        return arrayMove(tasks, activeIndex, activeIndex)
      })
    }
  }

  const updateBoardName = (newBoardName: string) => {
    setTitle(newBoardName)
  }

  const resetBoard = () => {
    setTitle("My table")
    setColumns([])
    setTasks([])
  }

  const generateId = () => {
    return Math.floor(Math.random() * 10001)
  }

  return (
    <div className={styles.wrapper}>
      <BoardMenu
        name={title}
        updateBoardName={updateBoardName}
        resetBoard={resetBoard}
      />
      <div className={styles.title}>{title}</div>

      <div className={styles.board_wrapper}>
        <DndContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          sensors={sensors}
          onDragOver={onDragOver}
        >
          <div className={styles.columns_wrapper}>
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  key={column.id}
                  column={column}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                />
              ))}
              <button
                className={styles.add_column_button}
                onClick={createNewColumn}
              >
                Add Column
              </button>
            </SortableContext>
          </div>

          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createNewColumn}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id
                  )}
                />
              )}
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </div>
  )
}
