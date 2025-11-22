
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios"; // <--- Importamos el teléfono
import { Box, Button, Container, TextField, Typography, Paper } from "@mui/material";


export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Para mostrar mensaje si falla

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpiamos errores viejos

    try {
      // 1. Enviamos los datos al Backend
      const response = await axios.post("http://localhost:3000/auth/login", {
        email: email,
        password: password,
      });

      // 2. Si llegamos acá, es que funcionó
      console.log("Respuesta del servidor:", response.data);
      
      // 3. Guardamos el Token en el navegador (localStorage)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("usuario", response.data.usuario);

      navigate("/"); // <--- Redirigir al Dashboard
      
      // (Acá más adelante te vamos a redirigir al Dashboard)

    } catch (err) {
      // 4. Si falla (401 Unauthorized), mostramos error
      console.error(err);
      setError("Email o contraseña incorrectos");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Paper
          elevation={3}
          style={{ padding: "40px", width: "100%", borderRadius: "15px" }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Bienvenido
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" mb={3}>
            Ingresá tus credenciales para continuar
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                type="email"
                error={!!error} // Pone el borde rojo si hay error
              />
              <TextField
                label="Contraseña"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                type="password"
                error={!!error}
                helperText={error} // Muestra el mensaje de error abajo
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                style={{ marginTop: "10px" }}
              >
                Ingresar
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};