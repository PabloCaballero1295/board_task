export interface Task_ {
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

export type Column = {
  id: number
  title: string
}

export type Task = {
  id: number
  columnId: number
  content: string
}
export interface Board {
  id: string
  name: string
  columns: Column[]
  tasks: Task[]
}
