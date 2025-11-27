import { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography, Paper, MenuItem } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export const ActualizarStock = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Capturamos el ID del producto de la URL
  
  const [producto, setProducto] = useState<any>(null);
  const [sucursales, setSucursales] = useState([]);
  
  // Formulario
  const [form, setForm] = useState({
    id_sucursal: "",
    cantidad: ""
  });

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        // 1. Traemos el nombre del producto para mostrarlo
        const resProd = await axios.get(`https://sistema-gestion-ferreteria-demo.onrender.com/producto/${id}`, config);
        setProducto(resProd.data);

        // 2. Traemos las sucursales para el desplegable
        const resSuc = await axios.get("https://sistema-gestion-ferreteria-demo.onrender.com/sucursal", config);
        setSucursales(resSuc.data);
      } catch (error) {
        console.error("Error cargando datos", error);
      }
    };
    cargarDatos();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://sistema-gestion-ferreteria-demo.onrender.com/stock/actualizar", {
        id_producto: Number(id),
        id_sucursal: Number(form.id_sucursal),
        cantidad: Number(form.cantidad)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("¡Stock actualizado correctamente!");
      navigate("/productos"); // Volver a la lista
    } catch (error) {
      alert("Error al actualizar stock");
      console.error(error);
    }
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="sm"> {/* Usamos 'sm' para que el formulario sea angosto y centrado */}
          
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" mb={1}>Ajuste de Stock</Typography>
            
            {/* Mostramos claramente qué producto es */}
            <Typography variant="h4" color="primary" fontWeight="bold" mb={3}>
              {producto ? producto.nombre : "Cargando..."}
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={3}>
                
                {/* Selección de Sucursal */}
                <TextField 
                  select 
                  fullWidth 
                  label="Seleccionar Sucursal" 
                  value={form.id_sucursal} 
                  onChange={(e) => setForm({ ...form, id_sucursal: e.target.value })} 
                  required
                >
                  {sucursales.map((suc: any) => (
                    <MenuItem key={suc.id_sucursal} value={suc.id_sucursal}>
                      {suc.nombre_sucursal}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Ingreso de Cantidad */}
                <TextField 
                  fullWidth 
                  type="number" 
                  label="Cantidad Real Física (Total)" 
                  helperText="Ingresá la cantidad total que contaste en el estante."
                  value={form.cantidad} 
                  onChange={(e) => setForm({ ...form, cantidad: e.target.value })} 
                  required 
                />

                {/* Botones */}
                <Box mt={2}>
                  <Button variant="contained" color="success" type="submit" size="large" fullWidth>
                    Confirmar Ajuste
                  </Button>
                  <Button 
                    variant="text" 
                    color="inherit" 
                    onClick={() => navigate("/productos")} 
                    fullWidth 
                    sx={{ mt: 1 }}
                  >
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