import { useEffect, useState } from "react";
import { getBookings, createBookings, updateBookings, deleteBookings } from "../../services/bookingServices";
import { getClassrooms } from "../../services/classroomServices";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
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

function Booking() {

    const [bookings, setBookings] = useState([]);  
    const [openDialog, setOpenDialog] = useState(false);
    const [bookingDate, setBookingDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [classroomId, setClassroomId] = useState("");
    const [classrooms, setClassrooms] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [editingBooking, setEditingBooking] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [bookingDateError, setBookingDateError] = useState("");
    const [startTimeError, setStartTimeError] = useState("");
    const [endTimeError, setEndTimeError] = useState("");
    const [classroomError, setClassroomError] = useState("");

    const clearFormErrors = () => {
        setBookingDateError("");
        setStartTimeError("");
        setEndTimeError("");
        setClassroomError("");
        setErrorMessage("");
    };

    const handleSaveBooking = async () => {
        const today = new Date();
        
        const todayString = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");

        setBookingDateError("");
        setErrorMessage("");

        if (!bookingDate) {
            setBookingDateError("Selecciona una fecha.");
            return;
        }

        if (!startTime) {
            setStartTimeError("Selecciona una hora de inicio.");
            return;
        }

        if (!endTime) {
            setEndTimeError("Selecciona una hora de finalización.");
            return;
        }

        if (startTime >= endTime) {
            setEndTimeError("La hora de finalización debe ser posterior a la hora de inicio.");
            return;
        }

        if (startTime < "08:00") {
            setStartTimeError("Las reservas comienzan a partir de las 8:00 a. m.");
            return;
        }

        if (endTime > "18:00") {
            setEndTimeError("Las reservas deben finalizar antes de las 5:00 p. m.");
            return;
        }

        if (!classroomId) {
            setClassroomError("Selecciona un aula.");
            return;
        }

        if (bookingDate < todayString) {
            setBookingDateError("No puedes reservar en una fecha pasada.");
            return;
        }

        if (bookingDate === todayString) {
            const now = new Date();
            const currentTime = [
                String(now.getHours()).padStart(2, "0"),
                String(now.getMinutes()).padStart(2, "0")
            ].join(":");

            if (startTime <= currentTime) {
                setStartTimeError("La hora de inicio debe ser posterior a la hora actual.");
                return;
            }
        }

        const bookingData = {
            bookingDate,
            startTime,
            endTime,
            classroomId: Number(classroomId),
            stateId: 5
        };

        try {

            if (editingBooking) {

                // Actualizar reserva existente
                await updateBookings(editingBooking.id, bookingData);

                console.log("Reserva actualizada correctamente");

            } else {

                // Crear nueva reserva
                await createBookings(bookingData);

                console.log("Reserva creada correctamente");
            }

            // Actualizar la tabla
            const updatedBookings = await getBookings();
            setBookings(updatedBookings);

            // Cerrar y limpiar formulario
           setBookingDate("");
           setStartTime("");
           setEndTime("");
           setClassroomId("");
           clearFormErrors();

        } catch (error) {

            console.error("Error al guardar la reserva:", error);

            const backendMessage = error.response?.data;

            setErrorMessage(
                typeof backendMessage === "string"
                    ? backendMessage
                    : backendMessage?.message || "No fue posible guardar la reserva."
            );
        }
    };

    useEffect(() => {

        const loadBookings = async () => {

            try {

                const data = await getBookings();

                console.log("Reservas:", data);

                setBookings(data);

            } catch (error) {

                console.error(
                    "Error al obtener reservas:",
                    error
                );

                console.log(
                    "Respuesta del backend:",
                    error.response?.data
                );
            }
        };

        loadBookings();

    }, []);

    useEffect(() => {

        const loadClassrooms = async () => {

            try {

                const data = await getClassrooms();

                console.log("Aulas:", data);

                setClassrooms(data);

            } catch (error) {

                console.error(
                    "Error al obtener aulas:",
                    error
                );
            }
        };

        loadClassrooms();

    }, []);

    const onEdit = (booking) => {
        clearFormErrors();
        setEditingBooking(booking);

        setBookingDate(booking.bookingDate);
        setStartTime(booking.startTime);
        setEndTime(booking.endTime);

        const selectedClassroom = classrooms.find(
            (classroom) => classroom.name === booking.classroom
        );

        setClassroomId(selectedClassroom ? selectedClassroom.id : "");

        setErrorMessage("");
        setOpenDialog(true);
    };

    const onDelete = (booking) => {
        clearFormErrors();
        setErrorMessage("");
        setBookingToDelete(booking);
        setOpenDeleteDialog(true);
    };

    const handleDeleteBooking = async () => {

        if (!bookingToDelete) return;

        try {

            // Eliminar reserva en el backend
            await deleteBookings(bookingToDelete.id);

            console.log("Reserva eliminada correctamente");

            // Actualizar la tabla
            const updatedBookings = await getBookings();
            setBookings(updatedBookings);

            // Cerrar diálogo y limpiar selección
            setOpenDeleteDialog(false);
            setBookingToDelete(null);

        } catch (error) {

            console.error("Error al eliminar la reserva:", error);

            const backendMessage = error.response?.data;

            setErrorMessage(
                typeof backendMessage === "string"
                    ? backendMessage
                    : backendMessage?.message || "No fue posible eliminar la reserva."
            );
        }
    };

    const getClassroomLocation = (classroomName) => {
        const classroom = classrooms.find(
            (item) => item.name === classroomName
        );

        return classroom ? classroom.location : "No disponible";
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
                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Reservas
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => {
                        setEditingBooking(null);
                        setBookingDate("");
                        setStartTime("");
                        setEndTime("");
                        setClassroomId("");
                        setErrorMessage("");
                        clearFormErrors();
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
                    Nueva Reserva
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>    
                            <TableCell>
                                <strong>Fecha</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Hora Inicio</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Hora Fin</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Aula</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Ubicación</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Usuario</strong>
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
                        {[...bookings]
                        .sort((a, b) => {
                            // Primero ordenar por fecha
                            const dateComparison = a.bookingDate.localeCompare(b.bookingDate);

                            // Si las fechas son iguales, ordenar por hora
                            if (dateComparison === 0) {
                                return a.startTime.localeCompare(b.startTime);
                            }

                            return dateComparison;
                        })
                        .map((booking) => (

                            <TableRow key={booking.id}>

                                <TableCell>
                                    {booking.bookingDate}
                                </TableCell>

                                <TableCell>
                                    {booking.startTime}
                                </TableCell>

                                <TableCell>
                                    {booking.endTime}
                                </TableCell>

                                <TableCell>
                                    {booking.classroom}
                                </TableCell>

                                <TableCell>
                                    {getClassroomLocation(booking.classroom)}
                                </TableCell>

                                <TableCell>
                                    {booking.user}
                                </TableCell>

                                <TableCell>
                                    {booking.state}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => onEdit(booking)}
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
                                        onClick={() => onDelete(booking)}
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
                    {editingBooking ? "Editar Reserva" : "Nueva Reserva"}
                </DialogTitle>

                <DialogContent>
                        {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                        )}

                    <TextField
                        label="Fecha"
                        type="date"
                        fullWidth
                        margin="normal"
                        value={bookingDate}
                        onChange={(e) => {
                            setBookingDate(e.target.value);
                            setBookingDateError("");
                            setErrorMessage("");
                        }}
                        error={Boolean(bookingDateError)}
                        helperText={bookingDateError}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />

                    <TextField
                        label="Hora de inicio"
                        type="time"
                        fullWidth
                        margin="normal"
                        value={startTime}
                        error={Boolean(startTimeError)}
                        helperText={startTimeError}
                        onChange={(e) => {
                            setStartTime(e.target.value);
                            setStartTimeError("");
                            setEndTimeError("");
                            setErrorMessage("");
                        }}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />

                    <TextField
                        label="Hora de finalización"
                        type="time"
                        fullWidth
                        margin="normal"
                        value={endTime}
                        error={Boolean(endTimeError)}
                        helperText={endTimeError}
                        onChange={(e) => {
                            setEndTime(e.target.value);
                            setEndTimeError("");
                            setErrorMessage("");
                        }}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />

                    <TextField
                        select
                        label="Aula"
                        fullWidth
                        margin="normal"
                        value={classroomId}
                        error={Boolean(classroomError)}
                        helperText={classroomError}
                        onChange={(e) => {
                            setClassroomId(e.target.value);
                            setClassroomError("");
                            setErrorMessage("");
                        }}
                    >
                        {classrooms
                            .filter((classroom) => classroom.state === "DISPONIBLE")
                            .map((classroom) => (
                                <MenuItem
                                    key={classroom.id}
                                    value={classroom.id}
                                >
                                    {classroom.name} - {classroom.location}
                                </MenuItem>
                            ))}
                    </TextField>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() => setOpenDialog(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleSaveBooking}
                    >
                        Guardar
                    </Button>

                </DialogActions>

            </Dialog>

            <Dialog

                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>
                    Confirmar eliminación
                </DialogTitle>

                <DialogContent>
                    ¿Estás seguro de que deseas eliminar esta reserva?
                    {errorMessage && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {errorMessage}
                    </Alert>
)}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setOpenDeleteDialog(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteBooking}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Booking;