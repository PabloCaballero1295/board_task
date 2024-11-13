import { useMemo, useState } from "react"
import styles from "./KanbanBoard.module.css"
import { Column } from "../../types/types"
import { ColumnContainer } from "../ColumnContainer/ColumnContainer"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import { createPortal } from "react-dom"

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([])
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns])

  const [activeColumn, setActiveColumn] = useState<Column | null>(null)

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
      title: `Column ${columns.length + 1}`,
    }

    setColumns([...columns, columnToAdd])
  }

  const deleteColumn = (id: number) => {
    const filteredColumns = columns.filter((col) => col.id != id)
    setColumns(filteredColumns)
  }

  const onDragStart = (event: DragStartEvent) => {
    //console.log("DRAG START", event)
    if (event.active.data.current?.type == "Column") {
      setActiveColumn(event.active.data.current.column)
      return
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
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

  const generateId = () => {
    return Math.floor(Math.random() * 10001)
  }

  return (
    <div className={styles.wrapper}>
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        <div className={styles.columns_wrapper}>
          <SortableContext items={columnsId}>
            {columns.map((column) => (
              <ColumnContainer
                key={column.id}
                column={column}
                deleteColumn={deleteColumn}
              />
            ))}
          </SortableContext>
        </div>

        <button className={styles.add_column_button} onClick={createNewColumn}>
          Add Column
        </button>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  )
}
