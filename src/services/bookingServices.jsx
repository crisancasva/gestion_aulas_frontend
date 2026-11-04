import api from "../api/axiosConfig";

export const getBookings = async () => {
    const response = await api.get("/api/bookings");
    return response.data;
};

export const createBookings = async (bookingData) => {
    const response = await api.post("/api/bookings", bookingData);
    return response.data;
};

export const updateBookings = async (id, bookingData) => {
    const response = await api.put(`/api/bookings/${id}`, bookingData);
    return response.data;
};

export const deleteBookings = async (id) => {
    await api.delete(`/api/bookings/${id}`);
};