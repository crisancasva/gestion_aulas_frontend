import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

import { ROLE_OPTIONS, USER_STATE_OPTIONS } from "./userUtils";

function UserFormDialog({
  open,
  editingUser,
  form,
  onClose,
  onSubmit,
  onFieldChange,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Nombre"
          margin="normal"
          value={form.name}
          onChange={onFieldChange("name")}
        />

        <TextField
          fullWidth
          label="Apellido"
          margin="normal"
          value={form.lastName}
          onChange={onFieldChange("lastName")}
        />

        <TextField
          fullWidth
          label="Correo electrónico"
          type="email"
          margin="normal"
          value={form.email}
          onChange={onFieldChange("email")}
        />

        {!editingUser && (
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            margin="normal"
            value={form.password}
            onChange={onFieldChange("password")}
          />
        )}

        <TextField
          fullWidth
          select
          label="Rol"
          margin="normal"
          value={form.roleId}
          onChange={onFieldChange("roleId")}
        >
          {ROLE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {editingUser && (
          <TextField
            fullWidth
            select
            label="Estado"
            margin="normal"
            value={form.stateId}
            onChange={onFieldChange("stateId")}
          >
            {USER_STATE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSubmit} variant="contained">
          {editingUser ? "Guardar Cambios" : "Crear Usuario"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserFormDialog;
