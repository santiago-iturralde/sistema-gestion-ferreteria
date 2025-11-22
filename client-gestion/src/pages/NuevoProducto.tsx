import { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography, Paper, MenuItem } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"; // <--- Agregamos useParams para leer la URL
import { Sidebar } from "../components/Sidebar";

export const NuevoProducto = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // <--- Capturamos el ID de la URL (si existe)
  const [proveedores, setProveedores] = useState([]);
  const [editando, setEditando] = useState(false); // Bandera para saber modo

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    cod_barras: "",
    precio_costo: "",
    precio_venta: "",
    stock_minimo: 5,
    id_proveedor: ""
  });

  // 1. Cargar Proveedores y Datos del Producto (si es edición)
  useEffect(() => {
    const cargarDatos = async () => {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        // A. Cargar lista de proveedores siempre
        const resProv = await axios.get("http://localhost:3000/proveedor", config);
        setProveedores(resProv.data);

        // B. Si hay ID, cargar los datos del producto para editar
        if (id) {
          setEditando(true);
          const resProd = await axios.get(`http://localhost:3000/producto/${id}`, config);
          const p = resProd.data;
          
          // Rellenar el formulario con lo que vino del backend
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
  }, [id]); // Se ejecuta cuando cambia el ID

  // 2. Manejar cambios en inputs
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 3. Guardar (Crear o Actualizar)
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    // Preparamos el objeto a enviar
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
        // MODO EDICIÓN: Usamos PUT o PATCH y la URL con ID
        await axios.patch(`http://localhost:3000/producto/${id}`, data, config);
        alert("¡Producto actualizado correctamente!");
      } else {
        // MODO CREACIÓN: Usamos POST
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
            {/* Título dinámico */}
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
                  <TextField 
                    fullWidth label="Código de Barras" name="cod_barras" 
                    value={form.cod_barras} onChange={handleChange} sx={{ flex: 1 }} 
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
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};