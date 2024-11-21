import SettingsIcon from "@mui/icons-material/Settings"
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
import styles from "./BoardMenu.module.css"

interface BoardMenuProps {
  name: string
  updateBoardName: (name: string) => void
  resetBoard: () => void
}

export const BoardMenu = ({
  name,
  updateBoardName,
  resetBoard,
}: BoardMenuProps) => {
  const [boardName, setBoardName] = useState(name)

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
    setOpenEdit(false)
  }

  const handleClickEdit = () => {
    handleClose()
    setOpenEdit(true)
  }

  const handleSave = () => {
    if (boardName.length == 0) {
      return
    }

    updateBoardName(boardName)
    handleCloseEdit()
    handleClose()
  }

  const handleReset = () => {
    resetBoard()
    handleClose()
  }

  return (
    <>
      <button onClick={handleClick} className={styles.menu_button}>
        <SettingsIcon
          sx={{ fontSize: 40, color: "white" }}
          className={styles.menu_icon}
          id="column-menu-button"
        />
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
        <MenuItem onClick={handleClickEdit}>Edit board name</MenuItem>
        <MenuItem onClick={handleReset}>Reset board</MenuItem>
      </Menu>
      <Dialog
        open={openEdit}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Edit board name</DialogTitle>
        <DialogContent>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
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
