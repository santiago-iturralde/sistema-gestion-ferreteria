import { 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Box, Typography, Divider, Button 
} from "@mui/material";
import { 
  Dashboard as DashboardIcon, 
  Inventory as InventoryIcon, 
  ShoppingCart as ShoppingCartIcon, 
  Group as GroupIcon,
  ExitToApp as LogoutIcon,
  ReceiptLong as ReceiptLongIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { LocalShipping } from "@mui/icons-material";

export const Sidebar = () => {
  const navigate = useNavigate();
  const usuario = localStorage.getItem("usuario") || "Usuario";
  
  // LEEMOS EL ROL DEL LOCALSTORAGE
  const rolUsuario = Number(localStorage.getItem("rol"));
  // Validamos: ¿Es Admin (ID 1)?
  const esAdmin = rolUsuario === 1;

  const anchoMenu = 240;

  const handleLogout = () => {
    localStorage.clear(); // Borramos todo al salir
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
          backgroundColor: "#1e1e2d", 
          color: "#ffffff",
        },
      }}
    >
      <Box p={3} textAlign="center">
        <Typography variant="h6" fontWeight="bold">
          GESTIÓN PRO
        </Typography>
        <Typography variant="caption" color="gray">
          {usuario}
        </Typography>
        {/* Etiqueta visual para saber qué soy */}
        <Typography variant="caption" display="block" color="cyan" mt={1}>
           {esAdmin ? "ADMINISTRADOR" : "VENDEDOR"}
        </Typography>
      </Box>
      
      <Divider sx={{ backgroundColor: "gray" }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemIcon> <DashboardIcon sx={{ color: "white" }} /> </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/productos")}>
              <ListItemIcon> <InventoryIcon sx={{ color: "white" }} /> </ListItemIcon>
              <ListItemText primary="Productos" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/venta")}>
            <ListItemIcon> <ShoppingCartIcon sx={{ color: "white" }} /> </ListItemIcon>
            <ListItemText primary="Ventas" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/ventas/historial")}>
            <ListItemIcon> <ReceiptLongIcon sx={{ color: "white" }} /> </ListItemIcon>
            <ListItemText primary="Historial de ventas" />
          </ListItemButton>
        </ListItem>

        {/* --- NUEVO BOTÓN CLIENTES --- */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate ("/clientes")}>
              <ListItemIcon> <PersonIcon sx={{ color: "white" }} /> </ListItemIcon>
              <ListItemText primary="Clientes / Deudas" />
          </ListItemButton>
        </ListItem>

        {/* --- CONDICIONAL: Solo mostramos Usuarios si es Admin --- */}
        {esAdmin && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/usuarios")}>
              <ListItemIcon> <GroupIcon sx={{ color: "white" }} /> </ListItemIcon>
              <ListItemText primary="Usuarios" />
            </ListItemButton>
          </ListItem>
        )}

        {esAdmin && (
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/compras")}>
          <ListItemIcon> <LocalShipping sx={{ color: "white" }} /> </ListItemIcon>
        <ListItemText primary="Compras y Stock" />
        </ListItemButton>
        </ListItem>
        )}


      </List>

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