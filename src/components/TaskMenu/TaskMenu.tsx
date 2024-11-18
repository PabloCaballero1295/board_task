import { MoreHoriz } from "@mui/icons-material"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
} from "@mui/material"
import { useState } from "react"
import styles from "./TaskMenu.module.css"

interface ColumnMenuProps {
  id: number
  content: string
  deleteTask: (id: number) => void
  updateTask: (id: number, title: string) => void
  updateEditMode: (mode: boolean) => void
  updateOnMouseOver: (value: boolean) => void
}

export const TaskMenu = ({
  id,
  content,
  deleteTask,
  updateTask,
  updateEditMode,
  updateOnMouseOver,
}: ColumnMenuProps) => {
  const [taskContent, setTaskContent] = useState(content)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openEdit, setOpenEdit] = useState(false)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCloseEdit = () => {
    updateEditMode(false)
    setOpenEdit(false)
    updateOnMouseOver(false)
  }

  const handleClickEdit = () => {
    updateEditMode(true)
    handleClose()
    setOpenEdit(true)
  }

  const handleSave = () => {
    if (taskContent.length == 0) {
      return
    }
    updateEditMode(false)
    updateTask(id, taskContent)
    handleCloseEdit()
  }

  return (
    <>
      <button onClick={handleClick} className={styles.menu_button}>
        <MoreHoriz className={styles.menu_icon} id="column-menu-button" />
      </button>
      <Menu
        id="column-menu-button"
        aria-labelledby="column-menu-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleClickEdit}>Edit</MenuItem>
        <MenuItem onClick={() => deleteTask(id)}>Delete</MenuItem>
      </Menu>
      <Dialog
        open={openEdit}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Edit task content</DialogTitle>
        <DialogContent>
          <textarea
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
