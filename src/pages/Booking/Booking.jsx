import { useEffect, useState } from "react";
import { getBookings } from "../../services/bookingServices";
import { getClassrooms } from "../../services/classroomServices";

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

function Booking() {

    const [bookings, setBookings] = useState([]);  
    const [openDialog, setOpenDialog] = useState(false);
    const [bookingDate, setBookingDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [classroomId, setClassroomId] = useState("");
    const [classrooms, setClassrooms] = useState([]);



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
                                <strong>Usuario</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Estado</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (

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
                                    {booking.user}
                                </TableCell>

                                <TableCell>
                                    {booking.state}
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
                    Nueva Reserva
                </DialogTitle>

                <DialogContent>

                    <TextField
                        label="Fecha"
                        type="date"
                        fullWidth
                        margin="normal"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
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
                        onChange={(e) => setStartTime(e.target.value)}
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
                        onChange={(e) => setEndTime(e.target.value)}
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
                        onChange={(e) => setClassroomId(e.target.value)}
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
                        onClick={() => {
                            console.log("Datos de la reserva:", {
                                bookingDate,
                                startTime,
                                endTime,
                                classroomId,
                            });
                        }}
                    >
                        Guardar
                    </Button>

                </DialogActions>

            </Dialog>
        </div>
    );
}

export default Booking;