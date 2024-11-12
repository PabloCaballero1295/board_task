export interface Task {
  id: string
  text: string
  status: ColumnId
}

export type ColumnId = "TODO" | "IN_PROGRESS" | "DONE"
export interface ColumnType {
  id: ColumnId
  name: string
}

export type DragItem = {
  id: string
  index: number
  status: ColumnId
  type: string
}
