import { Box, Typography, Container, Paper } from "@mui/material";
import { Sidebar } from "../components/Sidebar";

export const Dashboard = () => {
  const usuario = localStorage.getItem("usuario");

  return (
    <Box display="flex">
      {/* 1. MENÚ LATERAL */}
      <Sidebar />

      {/* 2. CONTENIDO */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Panel de Control
          </Typography>
          
          {/* SOLUCIÓN SIMPLE: Usamos Box en lugar de Grid */}
          <Box 
            display="flex" 
            gap={3}           // Espacio entre tarjetas
            mt={2}            // Margen arriba
            flexWrap="wrap"   // Para que baje de línea en celulares
          >
            
            {/* Tarjeta 1 */}
            <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#e3f2fd", flex: 1, minWidth: "200px" }}>
              <Typography variant="h6">Ventas de Hoy</Typography>
              <Typography variant="h4">$ 0.00</Typography>
            </Paper>

            {/* Tarjeta 2 */}
            <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#e8f5e9", flex: 1, minWidth: "200px" }}>
              <Typography variant="h6">Productos</Typography>
              <Typography variant="h4">0</Typography>
            </Paper>

            {/* Tarjeta 3 */}
            <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#fff3e0", flex: 1, minWidth: "200px" }}>
              <Typography variant="h6">Usuario Activo</Typography>
              <Typography variant="h6">{usuario}</Typography>
            </Paper>

          </Box>
        </Container>
      </Box>
    </Box>
  );
};