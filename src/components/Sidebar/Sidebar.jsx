import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">
            <ul>
                <li>
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link to="/users">Users</Link>
                </li>
                 <li>
                    <Link to="/classrooms">Classrooms</Link>
                </li>
                <li>
                    <Link to="/bookings">Bookings</Link>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;