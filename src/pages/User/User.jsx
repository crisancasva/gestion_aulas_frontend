import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../../services/userServices";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    
} from "@mui/material";

function User() {

    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roleId, setRoleId] = useState(2);
    const [stateId, setStateId] = useState(1);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await getUsers();

                console.log("Usuarios:", data);

                setUsers(data);
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            }
        };

        loadUsers();
    }, []);

    const handleCreateUser = async () => {
        try {
            const userData = {
                name,
                lastName,
                email,
                password,
                roleId,
                stateId: 1, 
            };
            console.log("Creando usuario:", userData);
            const newUser = await createUser(userData);
            console.log("Usuario creado:", newUser);
            const updatedUsers = await getUsers();
            setUsers(updatedUsers);
            setOpenDialog(false);

            setName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setRoleId(2);
            setStateId(1);

        } catch (error) {
            console.error("Error al crear usuario:", error);
             console.log("Respuesta del backend:", error.response?.data);
        }
    };

    const handleUpdateUser = async () => {
        try {
            const userData = {
                name,
                lastName,
                email,
                password,
                roleId,
                stateId, 
            };
            console.log("Actualizando usuario:", userData);
            await updateUser(editingUser.id, userData);
            const updatedUsers = await getUsers();
            setUsers(updatedUsers);
            setOpenDialog(false);
            setEditingUser(null);

            setName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setRoleId(2);
            setStateId(1);
        }   catch (error) {
            console.error("Error al actualizar usuario:", error);
            console.log("Respuesta del backend:", error.response?.data);
        }
    };

    const handleDeleteUser = async (id) => {
        const confirmDelete = window.confirm(
            "¿Estás seguro de que deseas eliminar al usuario ${user.name} ${user.lastName}?"
        );
        if (!confirmDelete) return;
        try {
            await deleteUser(id);
            const updatedUsers = await getUsers();
            setUsers(updatedUsers);

            console.log("Usuario eliminado con éxito");
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            console.log("Respuesta del backend:", error.response?.data);
        }
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
                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Usuarios
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => {
                        setEditingUser(null); 

                        setName("");
                        setLastName("");
                        setEmail("");
                        setPassword("");
                        setRoleId(2);
                        setStateId(1);

                        setOpenDialog(true);}}
                    sx={{
                        width: "auto",
                        minWidth: "150px",
                        flexShrink: 0,
                        textTransform: "none",
                        fontWeight: "bold",
                        borderRadius: 2,
                        px: 3,
                    }}
                >
                    Nuevo usuario
                </Button>
            </Box>

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
                                <TableCell>{user.state}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            setEditingUser(user);

                                            setName(user.name);
                                            setLastName(user.lastName);
                                            setEmail(user.email);
                                            setRoleId(user.role === "ADMIN" ? 1 : 2);
                                            setStateId(user.state === "ACTIVE" ? 1 : 2);

                                            setOpenDialog(true);
                                        }}
                                         sx={{
                                            minWidth: "40px",
                                            width: "40px",
                                            height: "40px",
                                            padding: 0,
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            handleDeleteUser(user.id);
                                        }}
                                        sx={{ minWidth: "40px",
                                            width: "40px",
                                            height: "40px",
                                            padding: 0,
                                            ml: 1, }}
                                             >
                                        <DeleteIcon fontSize="small" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} 
                onClose={() => setOpenDialog(false)}
                fullWidth
                maxWidth="sm">
                <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Nombre"
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Apellido"
                        margin="normal"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Correo electrónico"
                        type="email"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {!editingUser &&  (
                        <TextField 
                            fullWidth
                            label="Contraseña"
                            type="password"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    )}

                    <TextField
                        fullWidth
                        select
                        label="Rol"
                        margin="normal"
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                    >
                        <MenuItem value={1}>Administrador</MenuItem>
                        <MenuItem value={2}>Usuario</MenuItem>
                    </TextField>

                    {editingUser && (
                        <TextField
                            fullWidth
                            select
                            label="Estado"
                            margin="normal"
                            value={stateId}
                            onChange={(e) => setStateId(Number(e.target.value))}
                        >
                            <MenuItem value={1}>
                                Activo
                            </MenuItem>

                            <MenuItem value={2}>
                                Inactivo
                            </MenuItem>
                        </TextField>
                    )}

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={editingUser ? handleUpdateUser : handleCreateUser} variant="contained">
                        {editingUser ? "Guardar Cambios" : "Crear Usuario"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default User;