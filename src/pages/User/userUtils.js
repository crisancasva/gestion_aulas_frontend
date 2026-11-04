export const ROLE_OPTIONS = [
  { value: 1, label: "Administrador" },
  { value: 2, label: "Usuario" },
];

export const USER_STATE_OPTIONS = [
  { value: 1, label: "Activo" },
  { value: 2, label: "Inactivo" },
];

export const normalizeRoleId = (role) => {
  if (role === "ADMIN") {
    return 1;
  }

  return 2;
};

export const normalizeStateId = (state) => {
  if (state === "ACTIVE") {
    return 1;
  }

  return 2;
};

export const getUserStateLabel = (state) => {
  if (state === "ACTIVE" || state === 1) {
    return "Activo";
  }

  return "Inactivo";
};

export const getUserStateColor = (state) => {
  if (state === "ACTIVE" || state === 1) {
    return "success";
  }

  return "error";
};

export const createEmptyUserForm = () => ({
  name: "",
  lastName: "",
  email: "",
  password: "",
  roleId: 2,
  stateId: 1,
});
