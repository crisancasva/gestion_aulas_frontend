import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button, Typography } from "@mui/material";

function Navbar() {
    
        const navigate = useNavigate();

        const handleLogout = () => {
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            localStorage.removeItem("lastName");
            navigate("/"), {replace: true};
        };
    return (    
        <nav className="navbar">
            <h2>Sistema de Gestion de Aulas</h2>

            <div className="navbar-user">
                <Typography 
                    variant="body1"
                    sx={{
                        color: "#ffffff",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                    }}
                >Bienvenido, {localStorage.getItem("name")} </Typography>
                <Button 
                    variant="outlined" 
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                        color: "#ffffff",
                        borderColor: "#ffffff",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": {
                            borderColor: "#ffffff",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                    }}
                    >
                    Cerrar Sesion
                </Button>
            </div>
        </nav>);
}

export default Navbar;