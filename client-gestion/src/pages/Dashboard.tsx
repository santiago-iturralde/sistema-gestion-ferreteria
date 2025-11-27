import { useEffect, useState } from "react";
import { 
  Box, Container, Paper, Typography, Card, CardContent, 
  List, ListItem, ListItemIcon, ListItemText, Divider, Button 
} from "@mui/material";
import { 
  AttachMoney, ShoppingCart, Warning, TrendingUp, ArrowForward 
} from "@mui/icons-material";
import axios from "axios";
import { Sidebar } from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

// IMPORTAMOS LOS GRÁFICOS
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState<any>(null);

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://sistema-gestion-ferreteria-demo.onrender.com/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDatos(res.data);
      } catch (error) { console.error(error); }
    };
    cargarDashboard();
  }, []);

  if (!datos) return <Box display="flex"><Sidebar /><Box p={3}>Cargando...</Box></Box>;

  return (
    <Box display="flex">
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
        <Container maxWidth="lg">
          
          <Typography variant="h4" mb={4} fontWeight="bold" color="text.primary">
            Panel de Control
          </Typography>

          {/* 1. TARJETAS */}
          <Box display="flex" gap={3} flexWrap="wrap" mb={4}>
            <Card sx={{ flex: 1, minWidth: 250, boxShadow: 3 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box p={2} borderRadius="50%" bgcolor="#e8f5e9">
                  <AttachMoney sx={{ fontSize: 40, color: "#2e7d32" }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">Ventas de Hoy</Typography>
                  <Typography variant="h4" fontWeight="bold" color="#2e7d32">$ {datos.ventas_hoy_total}</Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, minWidth: 250, boxShadow: 3 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box p={2} borderRadius="50%" bgcolor="#e3f2fd">
                  <ShoppingCart sx={{ fontSize: 40, color: "#1565c0" }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">Tickets Emitidos</Typography>
                  <Typography variant="h4" fontWeight="bold" color="#1565c0">{datos.ventas_hoy_cantidad}</Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, minWidth: 250, boxShadow: 3 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box p={2} borderRadius="50%" bgcolor="#fff3e0">
                  <TrendingUp sx={{ fontSize: 40, color: "#ef6c00" }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">Rendimiento</Typography>
                  <Typography variant="h6" fontWeight="bold" color="#ef6c00">En actividad ⚡</Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* --- NUEVO: 2. GRÁFICO DE VENTAS --- */}
          <Paper elevation={3} sx={{ p: 3, mb: 4, height: 400 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">Tendencia de Ventas (Últimos 7 días)</Typography>
            <Box sx={{ width: "100%", height: "90%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datos.ventas_grafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `$ ${value}`} />
                  <Bar dataKey="total" fill="#1976d2" radius={[4, 4, 0, 0]} name="Ventas ($)" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* 3. ALERTAS DE STOCK */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Warning color="error" />
              <Typography variant="h6" fontWeight="bold">
                Alertas de Stock Bajo ({datos.alertas_stock.length})
              </Typography>
            </Box>
            <Divider />
            <List>
              {datos.alertas_stock.length === 0 ? (
                <Typography p={2} color="textSecondary">¡Todo en orden! No falta mercadería.</Typography>
              ) : (
                datos.alertas_stock.map((prod: any) => (
                  <ListItem key={prod.id} divider>
                    <ListItemIcon><Warning color="error" fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary={<Typography fontWeight="bold" color="error">{prod.nombre.toUpperCase()}</Typography>}
                      secondary={`Stock actual: ${prod.stock_actual} u. (Mínimo: ${prod.stock_minimo} u.)`} 
                    />
                    <Button variant="outlined" color="error" size="small" endIcon={<ArrowForward />} onClick={() => navigate(`/stock/actualizar/${prod.id}`)}>
                      Reponer
                    </Button>
                  </ListItem>
                ))
              )}
            </List>
          </Paper>

        </Container>
      </Box>
    </Box>
  );
};