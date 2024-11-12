export interface Task {
  id: string
  text: string
  status: ColumnType
}

export type ColumnType = "TODO" | "IN_PROGRESS" | "DONE"

export type DragItem = {
  id: string
  index: number
  status: ColumnType
  type: string
}
