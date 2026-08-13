import api from "../api/axiosConfig";

export const getUsers = async () => {
    const response = await api.get("/api/users");
    return response.data;
};