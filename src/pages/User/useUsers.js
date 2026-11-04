import { useCallback, useEffect, useState } from "react";
import {
  getUsers,
  createUser as createUserService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from "../../services/userServices";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getUsers();
      setUsers(data);
      return data;
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(
    async (userData) => {
      try {
        const newUser = await createUserService(userData);
        await loadUsers();
        return newUser;
      } catch (err) {
        console.error("Error al crear usuario:", err);
        setError(err);
        throw err;
      }
    },
    [loadUsers]
  );

  const updateUser = useCallback(
    async (id, userData) => {
      try {
        const updatedUser = await updateUserService(id, userData);
        await loadUsers();
        return updatedUser;
      } catch (err) {
        console.error("Error al actualizar usuario:", err);
        setError(err);
        throw err;
      }
    },
    [loadUsers]
  );

  const removeUser = useCallback(
    async (id) => {
      try {
        await deleteUserService(id);
        await loadUsers();
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
        setError(err);
        throw err;
      }
    },
    [loadUsers]
  );

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users,
    isLoading,
    error,
    loadUsers,
    createUser,
    updateUser,
    removeUser,
  };
};
