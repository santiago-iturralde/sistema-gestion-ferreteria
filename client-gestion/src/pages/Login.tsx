import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios"; 
import { Box, Button, Container, TextField, Typography, Paper } from "@mui/material";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email: email,
        password: password,
      });

      console.log("Respuesta del servidor:", response.data);
      
      // 1. Guardamos el Token
      localStorage.setItem("token", response.data.access_token);
      
      // 2. Guardamos el Nombre
      localStorage.setItem("usuario", response.data.usuario.nombre);

      // 3. GUARDAMOS EL ROL ID (Esto es lo nuevo)
      // Si el usuario tiene rol, guardamos el ID. Si no, guardamos 0.
      const rolId = response.data.usuario.rol ? response.data.usuario.rol.id_rol : 0;
      localStorage.setItem("rol", rolId);

      navigate("/"); 

    } catch (err) {
      console.error(err);
      setError("Email o contraseña incorrectos");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Paper elevation={3} style={{ padding: "40px", width: "100%", borderRadius: "15px" }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Bienvenido
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" mb={3}>
            Ingresá tus credenciales para continuar
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Email" variant="outlined" fullWidth
                value={email} onChange={(e) => setEmail(e.target.value)}
                type="email" error={!!error}
              />
              <TextField
                label="Contraseña" variant="outlined" fullWidth
                value={password} onChange={(e) => setPassword(e.target.value)}
                type="password" error={!!error} helperText={error}
              />
              <Button type="submit" variant="contained" color="primary" size="large" fullWidth style={{ marginTop: "10px" }}>
                Ingresar
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};