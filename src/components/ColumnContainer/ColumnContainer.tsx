import { useSortable } from "@dnd-kit/sortable"
import { Column } from "../../types/types"
import styles from "./ColumnContainer.module.css"
import { CSS } from "@dnd-kit/utilities"

interface Props {
  column: Column
  deleteColumn: (id: number) => void
}

export const ColumnContainer = (props: Props) => {
  const { column, deleteColumn } = props

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
      <div {...attributes} {...listeners} className={styles.header}>
        <div>0</div>
        <div className={styles.title}>{column.title}</div>
        <button
          className={styles.delete_column}
          onClick={() => deleteColumn(column.id)}
        >
          del
        </button>
      </div>
      <div className={styles.content}>Content</div>
      <div>Footer</div>
    </div>
  )
}
