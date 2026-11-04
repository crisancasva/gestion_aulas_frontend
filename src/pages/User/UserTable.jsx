import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  getUserStateColor,
  getUserStateLabel,
} from "./userUtils";

function UserTable({ users, onEdit, onDelete }) {
  const actionButtonSx = {
    minWidth: "40px",
    width: "40px",
    height: "40px",
    padding: 0,
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Nombre</strong></TableCell>
            <TableCell><strong>Apellido</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
            <TableCell><strong>Rol</strong></TableCell>
            <TableCell><strong>Estado</strong></TableCell>
            <TableCell><strong>Acciones</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>

              <TableCell>
                <Chip
                  label={getUserStateLabel(user.state)}
                  color={getUserStateColor(user.state)}
                  size="small"
                />
              </TableCell>

              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onEdit(user)}
                  sx={actionButtonSx}
                >
                  <EditIcon fontSize="small" />
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onDelete(user)}
                  sx={{ ...actionButtonSx, ml: 1 }}
                >
                  <DeleteIcon fontSize="small" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UserTable;
