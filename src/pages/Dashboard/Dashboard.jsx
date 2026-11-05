import { useEffect, useState } from "react";
import { getClassrooms } from "../../services/classroomServices";
import { getBookings } from "../../services/bookingServices";

function Dashboard() {

    
    const [classrooms, setClassrooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedDate, setSelectedDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );

    const generateTimeSlots = () => {
        const slots = [];

        for (let hour = 8; hour < 17; hour++) {
            slots.push({
                start: `${String(hour).padStart(2, "0")}:00:00`,
                end: `${String(hour + 1).padStart(2, "0")}:00:00`
            });
        }

        return slots;
    };

    const timeSlots = generateTimeSlots();

    const isReserved = (classroom, slot) => {
        return bookings.some((booking) => {
            return (
                booking.classroom === classroom.name &&
                booking.bookingDate === selectedDate &&
                booking.state === "RESERVADA" &&
                booking.startTime < slot.end &&
                booking.endTime > slot.start
            );
        });
    };

    const isPastSlot = (slot) => {
        const now = new Date();

        const today = now.toLocaleDateString("en-CA");
        const currentTime = now.toTimeString().slice(0, 8);

        // Si la fecha seleccionada ya pasó
        if (selectedDate < today) {
            return true;
        }

        // Si estamos consultando el día actual
        if (selectedDate === today) {
            return slot.end <= currentTime;
        }

        return false;
    };

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [classroomsData, bookingsData] = await Promise.all([
                    getClassrooms(),
                    getBookings()
                ]);

                setClassrooms(classroomsData);
                setBookings(bookingsData);

                console.log("AULAS:", classroomsData);
                console.log("RESERVAS:", bookingsData);

            } catch (error) {
                console.error("Error cargando el dashboard:", error);
                setError("No fue posible cargar la información.");
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return <p>Cargando información...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

   return (
        <div style={{ textAlign: "center", padding: "24px" }}>
            <h1 style={{ marginBottom: "16px" }}>DISPONIBILIDAD DE AULAS</h1>

            <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "8px" }}>
                    Consultar fecha:{" "}
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </label>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px"
            }}>
                {classrooms.map((classroom) => (
                    <div
                        key={classroom.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "12px",
                            padding: "20px",
                            backgroundColor: "white",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
                        }}
                    >
                        <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <h2>{classroom.name}</h2>

                            <p>{classroom.location}</p>
                            <p>Capacidad: {classroom.capacity} personas</p>

                            <h3 style={{marginBottom: "16px"}}>Horario disponible</h3>

                        </div>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "8px"
                        }}>
                            {timeSlots.map((slot) => {
                                const reserved = isReserved(classroom, slot);
                                const past = isPastSlot(slot);
                                return (
                                    <div
                                        key={slot.start}
                                        style={{
                                            padding: "12px 6px",
                                            borderRadius: "8px",
                                            textAlign: "center",
                                            backgroundColor: reserved ? "#fee2e2" : past ? "#f3f4f6" : "#dcfce7",
                                            color: reserved ? "#991b1b" : "#166534",
                                            border: `1px solid ${reserved ? "#fca5a5" : past ? "#d1d5db" : "#1976d2"}`
                                        }}
                                    >
                                        <strong>
                                            {slot.start.slice(0, 5)}
                                        </strong>

                                        <div style={{ fontSize: "12px" }}>
                                            {reserved ? "Reservado" : "Libre"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;