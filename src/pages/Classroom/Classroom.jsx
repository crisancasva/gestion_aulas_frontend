import { useEffect, useState } from "react";
import { getClassrooms, createClassroom, updateClassroom, deleteClassroom } from "../../services/classroomServices";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Box,
    Button,
    Chip,
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

function Classroom() {

    const [classrooms, setClassrooms] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState("");
    const [location, setLocation] = useState("");
    const [editingClassroom, setEditingClassroom] = useState(null);
    const [stateId, setStateId] = useState(3);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [classroomToDelete, setClassroomToDelete] = useState(null);


    useEffect(() => {
        const loadClassrooms = async () => {
            try {
                const data = await getClassrooms();

                console.log("Aulas:", data);

                setClassrooms(data);
            } catch (error) {
                console.error("Error al obtener aulas:", error);
            }
        };

        loadClassrooms();
    }, []);

    const handleCreateClassroom = async () => {
        try {
            const classroomData = {
                name,
                capacity: Number(capacity),
                location,
                stateId: 3,
            };

            console.log("Creando aula", classroomData);

            await createClassroom(classroomData);

            const updateClassrooms = await getClassrooms();
            setClassrooms(updateClassrooms);

            setOpenDialog(false);

            setName("");
            setCapacity("");
            setLocation("");

            console.log("Aula creada correctamente");
        } catch(error){
            console.error("Error al crear el aula", error);
            console.log("Respuesta del backend: ", error.response?.data);
        }
    }

    const handleUpdateClassroom = async () => {
        try {
            const classroomData = {
                name,
                capacity: Number(capacity),
                location,
                stateId,
            };

            console.log("Actualizando aula:", classroomData);

            await updateClassroom(
                editingClassroom.id,
                classroomData
            );

            const updatedClassrooms = await getClassrooms();
            setClassrooms(updatedClassrooms);

            setOpenDialog(false);
            setEditingClassroom(null);

            setName("");
            setCapacity("");
            setLocation("");
            setStateId(3);

            console.log("Aula actualizada correctamente");

        } catch (error) {
            console.error("Error al actualizar aula:", error);
            console.log(
                "Respuesta del backend:",
                error.response?.data
            );
        }
    };
    
    const handleDeleteClassroom = (classroom) => {
        setClassroomToDelete(classroom);
        setOpenDeleteDialog(true);
    };

    const confirmDeleteClassroom = async () => {
        try {
            await deleteClassroom(classroomToDelete.id);

            const updatedClassrooms = await getClassrooms();
            setClassrooms(updatedClassrooms);

            setOpenDeleteDialog(false);
            setClassroomToDelete(null);

            console.log("Aula eliminada correctamente");

        } catch (error) {
            console.error("Error al eliminar aula:", error);
            console.log(
                "Respuesta del backend:",
                error.response?.data
            );
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
                }}>
                <Typography variant="h4" fontWeight="bold">
                    Aulas
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => {
                        setName("");
                        setCapacity("");
                        setLocation("");
                        setStateId(3);
                        setOpenDialog(true);
                    }}
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
                    Nueva Aula
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>Nombre</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Capacidad</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Ubicación</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Estado</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Acciones</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {classrooms.map((classroom) => (
                            <TableRow key={classroom.id}>
                                <TableCell>
                                    {classroom.name}
                                </TableCell>

                                <TableCell>
                                    {classroom.capacity}
                                </TableCell>

                                <TableCell>
                                    {classroom.location}
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={
                                            classroom.state === "DISPONIBLE"
                                                ? "Disponible"
                                                : "No disponible"
                                        }
                                        color={
                                            classroom.state === "DISPONIBLE"
                                                ? "success"
                                                : "error"
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            setEditingClassroom(classroom);

                                            setName(classroom.name);
                                            setCapacity(classroom.capacity)
                                            setLocation(classroom.location)
                                            setStateId(classroom.state === "DISPONIBLE" ? 3 : 4);

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
                                            handleDeleteClassroom(classroom);
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

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingClassroom ? "Editar aula" : "Nueva aula"}
                </DialogTitle>

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
                        label="Capacidad"
                        type="number"
                        margin="normal"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Ubicación"
                        margin="normal"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    {editingClassroom &&(
                    <TextField
                        fullWidth
                        select
                        label="Estado"
                        margin="normal"
                        value={stateId}
                        onChange={(e) => setStateId(Number(e.target.value))}
                    >
                        <MenuItem value={3}>
                            Disponible
                        </MenuItem>

                        <MenuItem value={4}>
                            No disponible
                        </MenuItem>
                    </TextField>
                    )}
                </DialogContent>

                <DialogActions>
                        <Button
                            onClick={() => setOpenDialog(false)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="contained"
                            onClick={editingClassroom ? handleUpdateClassroom: handleCreateClassroom}
                        >
                            {editingClassroom ? "Actualizar aula" : "Crear aula"}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openDeleteDialog}
                    onClose={() => {
                        setOpenDeleteDialog(false);
                        setClassroomToDelete(null);
                    }}
                    maxWidth="xs"
                    fullWidth
                >
                    <DialogTitle>
                        Eliminar aula
                    </DialogTitle>

                    <DialogContent>
                        <Typography>
                            ¿Está seguro de que desea eliminar el aula{" "}
                            <strong>
                                {classroomToDelete?.name}
                            </strong>
                            ?
                        </Typography>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={() => {
                                setOpenDeleteDialog(false);
                                setClassroomToDelete(null);
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            onClick={confirmDeleteClassroom}
                        >
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>
        </div>

        
    );
}

export default Classroom;