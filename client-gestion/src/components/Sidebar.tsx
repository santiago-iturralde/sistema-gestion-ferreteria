//clase del menu principal desplegable del dashboard

import { 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Box, Typography, Divider, Button 
} from "@mui/material";
import { 
  Dashboard as DashboardIcon, 
  Inventory as InventoryIcon, 
  ShoppingCart as ShoppingCartIcon, 
  Group as GroupIcon,
  ExitToApp as LogoutIcon 
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();
  const usuario = localStorage.getItem("usuario") || "Usuario";
  const anchoMenu = 240; // Ancho del menú en píxeles

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: anchoMenu,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: anchoMenu,
          boxSizing: "border-box",
          backgroundColor: "#1e1e2d", // Color oscuro profesional
          color: "#ffffff",
        },
      }}
    >
      {/* Cabecera del Menú */}
      <Box p={3} textAlign="center">
        <Typography variant="h6" fontWeight="bold">
          GESTIÓN PRO
        </Typography>
        <Typography variant="caption" color="gray">
          {usuario}
        </Typography>
      </Box>
      
      <Divider sx={{ backgroundColor: "gray" }} />

      {/* Lista de Opciones */}
      <List>
        {/* Opción 1: Dashboard */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemIcon> <DashboardIcon sx={{ color: "white" }} /> </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItemButton>
        </ListItem>

        {/* Opción 2: Productos (Inventario) */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/productos")}>
              <ListItemIcon> <InventoryIcon sx={{ color: "white" }} /> </ListItemIcon>
              <ListItemText primary="Productos" />
          </ListItemButton>
        </ListItem>

        {/* Opción 3: Ventas */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => alert("Próximamente: Ventas")}>
            <ListItemIcon> <ShoppingCartIcon sx={{ color: "white" }} /> </ListItemIcon>
            <ListItemText primary="Ventas" />
          </ListItemButton>
        </ListItem>

        {/* Opción 4: Usuarios (Solo debería verlo el Admin) */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => alert("Próximamente: Usuarios")}>
            <ListItemIcon> <GroupIcon sx={{ color: "white" }} /> </ListItemIcon>
            <ListItemText primary="Usuarios" />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Botón de Salir al final */}
      <Box mt="auto" p={2}>
        <Button 
          variant="contained" 
          color="error" 
          fullWidth 
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Salir
        </Button>
      </Box>
    </Drawer>
  );
};