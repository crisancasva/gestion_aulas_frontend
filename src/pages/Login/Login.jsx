import "../../styles/Login.css";
import { login } from "../../services/authServices";
import { useNavigate } from "react-router-dom";

import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();  
  const handleLogin = async () => {
     try {
        const credentials = {
            email,
            password
        };

        const response = await login(credentials);
        localStorage.setItem("token", response.token);
        localStorage.setItem("name", response.name);
        localStorage.setItem("lastName", response.lastName);
        console.log("Login exitoso",response);
        navigate("/dashboard");
       
    } catch (error) {
        console.error("Error al iniciar sesion", error);
    }
  };

  return (
    <div className="login">

      <Paper elevation={8} className="login-card">

        <Box className="login-header">

          <SchoolIcon
            sx={{
              fontSize: 60,
              color: "#1976D2",
            }}
          />

          <Typography
            variant="h3"
            fontWeight="bold"
            color="#1565C0"
          >
            AulaHub
          </Typography>

          <Typography color="text.secondary">
            Gestión inteligente de aulas
          </Typography>

            <TextField
                fullWidth
                label="Correo electrónico"
                placeholder="correo@ejemplo.com"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailOutlinedIcon />
                            </InputAdornment>
                        ),
                    },
                }}
            />
            <TextField
            fullWidth
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <LockOutlinedIcon />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <VisibilityOffOutlinedIcon />
                                ) : (
                                    <VisibilityOutlinedIcon />
                                )}
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
        <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            sx={{
                mt:3,
                py:1.5,
                borderRadius:3,
                fontWeight:"bold",
                textTransform:"none",
                fontSize:"1rem",

                "&:hover":{
                    backgroundColor:"#0D47A1"
                }
            }}
        >
            Iniciar sesión
        </Button>
        </Box>

      </Paper>

    </div>
  );
}

export default Login;