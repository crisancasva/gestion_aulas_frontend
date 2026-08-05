import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Booking from "../pages/Booking/Booking";
import Classroom from "../pages/Classroom/Classroom";
import User from "../pages/User/User";
import MainLayout from "../layouts/MainLayout";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Rutas con layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<User />} />
          <Route path="/classrooms" element={<Classroom />} />
          <Route path="/bookings" element={<Booking />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;