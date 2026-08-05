import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

function MainLayout() {
    return (
        <>
            <Navbar />
            <div className="container">
                <Sidebar />
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </>
    );
}

export default MainLayout;