import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

import UserTable from "./UserTable";
import UserFormDialog from "./UserFormDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import { useUsers } from "./useUsers";
import {
  createEmptyUserForm,
  normalizeRoleId,
  normalizeStateId,
} from "./userUtils";

function User() {
  const { users, isLoading, createUser, updateUser, removeUser } = useUsers();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(createEmptyUserForm());
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const newUserButtonSx = {
    width: "auto",
    minWidth: "150px",
    flexShrink: 0,
    textTransform: "none",
    fontWeight: "bold",
    borderRadius: 2,
    px: 3,
  };

  const resetForm = () => {
    setForm(createEmptyUserForm());
  };

  const closeUserDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    resetForm();
  };

  const closeDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleOpenCreateDialog = () => {
    setEditingUser(null);
    resetForm();
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: "",
      roleId: normalizeRoleId(user.role),
      stateId: normalizeStateId(user.state),
    });
    setOpenDialog(true);
  };

  const handleFieldChange = (field) => (event) => {
    const value =
      field === "roleId" || field === "stateId"
        ? Number(event.target.value)
        : event.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateUser = async () => {
    const userData = {
      name: form.name,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      roleId: form.roleId,
      stateId: 1,
    };

    await createUser(userData);
    closeUserDialog();
  };

  const handleUpdateUser = async () => {
    const userData = {
      name: form.name,
      lastName: form.lastName,
      email: form.email,
      roleId: form.roleId,
      stateId: form.stateId,
    };

    if (form.password) {
      userData.password = form.password;
    }

    await updateUser(editingUser.id, userData);
    closeUserDialog();
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteUser = async () => {
    await removeUser(userToDelete.id);
    closeDeleteDialog();
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          width: "100%",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Usuarios
        </Typography>

        <Button
          variant="contained"
          onClick={handleOpenCreateDialog}
          sx={newUserButtonSx}
        >
          Nuevo usuario
        </Button>
      </Box>

      {isLoading ? (
        <Typography>Cargando usuarios...</Typography>
      ) : (
        <UserTable users={users} onEdit={handleOpenEditDialog} onDelete={handleDeleteUser} />
      )}

      <UserFormDialog
        open={openDialog}
        editingUser={editingUser}
        form={form}
        onClose={closeUserDialog}
        onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
        onFieldChange={handleFieldChange}
      />

      <DeleteUserDialog
        open={openDeleteDialog}
        user={userToDelete}
        onClose={closeDeleteDialog}
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
}

export default User;