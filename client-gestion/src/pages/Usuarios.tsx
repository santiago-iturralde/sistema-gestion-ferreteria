import { useEffect, useState } from "react";
import { 
  Box, Button, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Typography, IconButton, 
  Dialog, DialogTitle, DialogContent, TextField, MenuItem, Chip 
} from "@mui/material";
import { Add, Delete, Person, Badge } from "@mui/icons-material";
import axios from "axios";
import { Sidebar } from "../components/Sidebar";

export const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: 2 // Por defecto Vendedor
  });

  const cargarUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://sistema-gestion-ferreteria-demo.onrender.com/usuario", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Diagnóstico en consola (ahora deberías ver 'nombre_rol' aquí)
      console.log("Usuarios cargados:", res.data);
      setUsuarios(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleCrear = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://sistema-gestion-ferreteria-demo.onrender.com/usuario", {
        nombre: form.nombre,
        email: form.email,
        password: form.password,
        rol: Number(form.rol),
        empresa: 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Usuario creado correctamente");
      setOpenModal(false);
      setForm({ nombre: "", email: "", password: "", rol: 2 });
      cargarUsuarios(); 
    } catch (error) {
      console.error(error);
      alert("Error al crear usuario. Revisá los datos.");
    }
  };

  const handleBorrar = async (id: number) => {
    if (window.confirm("¿Seguro querés eliminar a este usuario?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://sistema-gestion-ferreteria-demo.onrender.com/usuario/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        cargarUsuarios();
      } catch (error) { console.error(error); }
    }
  };

  const getNombreRol = (usuario: any) => {
    if (!usuario.rol) return "SIN ROL";
    
    // AHORA SÍ: El backend manda 'nombre_rol', y nosotros leemos 'nombre_rol'
    if (usuario.rol.nombre_rol) return usuario.rol.nombre_rol.toUpperCase();
    
    return "ROL DESCONOCIDO"; 
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" display="flex" alignItems="center" gap={1}>
              <Badge fontSize="large" /> Gestión de Usuarios
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpenModal(true)}>
              Nuevo Usuario
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1e1e2d" }}>
                  <TableCell sx={{ color: "white" }}>Nombre</TableCell>
                  <TableCell sx={{ color: "white" }}>Email</TableCell>
                  <TableCell sx={{ color: "white" }}>Rol</TableCell>
                  <TableCell sx={{ color: "white" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((u: any) => (
                  <TableRow key={u.id_usuario}>
                    <TableCell sx={{ fontWeight: "bold" }}>
                    {u.nombre_completo} 
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={getNombreRol(u)} 
                        // Si es ID 1 (ADMIN), lo pintamos azul. Si no, gris.
                        color={u.rol && u.rol.id_rol === 1 ? "primary" : "default"} 
                        size="small" 
                        icon={<Person />}
                      />
                    </TableCell>

                    <TableCell>
                      <IconButton color="error" onClick={() => handleBorrar(u.id_usuario)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {usuarios.length === 0 && (
                   <TableRow>
                     <TableCell colSpan={4} align="center">
                       No hay usuarios cargados aún.
                     </TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={openModal} onClose={() => setOpenModal(false)}>
            <DialogTitle>Registrar Nuevo Empleado</DialogTitle>
            <DialogContent sx={{ width: 400, display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
              <TextField label="Nombre Completo" fullWidth value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} />
              <TextField label="Email (Usuario)" fullWidth value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
              <TextField label="Contraseña" type="password" fullWidth value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
              
              <TextField select label="Rol" fullWidth value={form.rol} onChange={(e) => setForm({...form, rol: Number(e.target.value)})}>
                <MenuItem value={1}>Administrador (Dueño)</MenuItem>
                <MenuItem value={2}>Vendedor (Empleado)</MenuItem>
              </TextField>

              <Button variant="contained" color="success" onClick={handleCrear} sx={{ mt: 2 }}>
                Guardar Usuario
              </Button>
            </DialogContent>
          </Dialog>

        </Container>
      </Box>
    </Box>
  );
};