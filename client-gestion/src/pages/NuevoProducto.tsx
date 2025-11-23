import { useEffect, useState } from "react";
import { 
  Box, Button, Container, TextField, Typography, Paper, MenuItem, 
  InputAdornment, IconButton, Dialog, DialogTitle, DialogContent 
} from "@mui/material";
import { CameraAlt } from "@mui/icons-material"; // <--- Icono de cámara
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Scanner } from "../components/Scanner"; // <--- Importamos el Scanner que creamos antes

export const NuevoProducto = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [proveedores, setProveedores] = useState([]);
  const [editando, setEditando] = useState(false);

  // --- ESTADO PARA LA CÁMARA ---
  const [mostrarScanner, setMostrarScanner] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    cod_barras: "",
    precio_costo: "",
    precio_venta: "",
    stock_minimo: 5,
    id_proveedor: ""
  });

  // 1. Cargar Proveedores y Datos
  useEffect(() => {
    const cargarDatos = async () => {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const resProv = await axios.get("http://localhost:3000/proveedor", config);
        setProveedores(resProv.data);

        if (id) {
          setEditando(true);
          const resProd = await axios.get(`http://localhost:3000/producto/${id}`, config);
          const p = resProd.data;
          
          setForm({
            nombre: p.nombre,
            descripcion: p.descripcion || "",
            cod_barras: p.cod_barras || "",
            precio_costo: p.precio_costo,
            precio_venta: p.precio_venta,
            stock_minimo: p.stock_minimo_alerta,
            id_proveedor: p.proveedor ? p.proveedor.id_proveedor : ""
          });
        }
      } catch (error) {
        console.error("Error cargando datos", error);
      }
    };
    cargarDatos();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- FUNCIÓN: CUANDO LA CÁMARA LEE EL CÓDIGO ---
  const handleScanSuccess = (codigo: string) => {
    setForm({ ...form, cod_barras: codigo }); // Escribe el código en el input
    setMostrarScanner(false); // Cierra la cámara
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const data = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      cod_barras: form.cod_barras,
      precio_costo: Number(form.precio_costo),
      precio_venta: Number(form.precio_venta),
      stock_minimo_alerta: Number(form.stock_minimo),
      proveedor: form.id_proveedor,
      empresa: 1
    };

    try {
      if (editando) {
        await axios.patch(`http://localhost:3000/producto/${id}`, data, config);
        alert("¡Producto actualizado correctamente!");
      } else {
        await axios.post("http://localhost:3000/producto", data, config);
        alert("¡Producto creado correctamente!");
      }
      navigate("/productos");
    } catch (error) {
      alert("Error al guardar");
      console.error(error);
    }
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" mb={3}>
              {editando ? "Editar Producto" : "Nuevo Producto"}
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={3}>
                
                <TextField 
                  fullWidth label="Nombre del Producto *" name="nombre" 
                  value={form.nombre} onChange={handleChange} required 
                />

                <TextField 
                  fullWidth multiline rows={2} label="Descripción" name="descripcion" 
                  value={form.descripcion} onChange={handleChange} 
                />

                <Box display="flex" gap={2}>
                  {/* --- INPUT DE CÓDIGO DE BARRAS CON CÁMARA --- */}
                  <TextField 
                    fullWidth 
                    label="Código de Barras" 
                    name="cod_barras" 
                    value={form.cod_barras} 
                    onChange={handleChange} 
                    sx={{ flex: 1 }} 
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setMostrarScanner(true)} color="primary">
                            <CameraAlt />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />

                  <TextField 
                    fullWidth select label="Proveedor *" name="id_proveedor" 
                    value={form.id_proveedor} onChange={handleChange} required sx={{ flex: 1 }}
                  >
                    {proveedores.map((prov: any) => (
                      <MenuItem key={prov.id_proveedor} value={prov.id_proveedor}>
                        {prov.razon_social}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box display="flex" gap={2}>
                  <TextField 
                    fullWidth label="Precio Costo" type="number" name="precio_costo" 
                    value={form.precio_costo} onChange={handleChange} sx={{ flex: 1 }}
                  />
                  <TextField 
                    fullWidth label="Precio Venta *" type="number" name="precio_venta" 
                    value={form.precio_venta} onChange={handleChange} required sx={{ flex: 1 }}
                  />
                </Box>

                <Box>
                  <Button variant="contained" type="submit" size="large" color={editando ? "success" : "primary"}>
                    {editando ? "Guardar Cambios" : "Crear Producto"}
                  </Button>
                  <Button variant="text" color="error" onClick={() => navigate("/productos")} sx={{ ml: 2 }}>
                    Cancelar
                  </Button>
                </Box>

              </Box>
            </form>

            {/* --- VENTANA EMERGENTE DEL SCANNER --- */}
            <Dialog open={mostrarScanner} onClose={() => setMostrarScanner(false)}>
              <DialogTitle>Escanear Código</DialogTitle>
              <DialogContent>
                {mostrarScanner && <Scanner onScan={handleScanSuccess} />}
                <Button onClick={() => setMostrarScanner(false)} color="error" fullWidth sx={{ mt: 2 }}>
                  Cancelar
                </Button>
              </DialogContent>
            </Dialog>

          </Paper>
        </Container>
      </Box>
    </Box>
  );
};