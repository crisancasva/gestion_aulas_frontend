import api from "../api/axiosConfig";

export const getClassrooms = async () => {
    const response = await api.get("/api/classrooms");
    return response.data;
};

export const createClassroom = async (classroomData) => {
    const response = await api.post("/api/classrooms", classroomData);
    return response.data;
};

export const updateClassroom = async (id, classroomData) => {
    const response = await api.put(`/api/classrooms/${id}`, classroomData);
    return response.data;
};

export const deleteClassroom = async (id) => {
    await api.delete(`/api/classrooms/${id}`);
};