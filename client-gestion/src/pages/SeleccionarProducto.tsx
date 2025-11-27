import { useEffect, useState } from "react";
import { 
  Box, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Typography, 
  TextField, InputAdornment, Button, Chip, Stack 
} from "@mui/material"; 
import { Search, ArrowForward, Store, Warehouse } from "@mui/icons-material"; 
import axios from "axios";
import { Sidebar } from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export const SeleccionarProducto = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://sistema-gestion-ferreteria-demo.onrender.com/producto", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProductos(res.data);
      } catch (error) { console.error(error); }
    };
    cargarProductos();
  }, []);

  const productosFiltrados = productos.filter((prod: any) => {
    const termino = busqueda.toLowerCase();
    return (
      prod.nombre.toLowerCase().includes(termino) ||
      (prod.cod_barras && prod.cod_barras.includes(termino))
    );
  });

  return (
    <Box display="flex">
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          
          <Typography variant="h4" mb={3}>¿Qué producto querés ajustar?</Typography>

          {/* Buscador Grande */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <TextField
              fullWidth autoFocus
              variant="outlined" 
              label="Buscar por nombre o código..."
              value={busqueda} 
              onChange={(e) => setBusqueda(e.target.value)}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }}
            />
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1e1e2d" }}>
                  <TableCell sx={{ color: "white" }}>Producto</TableCell>
                  <TableCell sx={{ color: "white" }}>Stock Actual</TableCell>
                  <TableCell sx={{ color: "white", textAlign: "right" }}>Acción</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {productosFiltrados.map((prod: any) => (
                  <TableRow key={prod.id_producto} hover>
                    <TableCell>
                      <Typography fontWeight="bold">{prod.nombre}</Typography>
                      <Typography variant="caption">{prod.cod_barras}</Typography>
                    </TableCell>
                    
                    <TableCell>
                       <Stack direction="row" spacing={1} flexWrap="wrap">
                        {prod.stocks && prod.stocks.length > 0 ? (
                          prod.stocks.map((item: any) => (
                            <Chip 
                              key={item.id_stock}
                              icon={item.sucursal.nombre_sucursal.toLowerCase().includes('deposito') ? <Warehouse/> : <Store/>}
                              label={`${item.sucursal.nombre_sucursal}: ${item.cantidad}`}
                              size="small" variant="outlined"
                            />
                          ))
                        ) : <Chip label="0" size="small" />}
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      {/* BOTÓN PARA SELECCIONAR */}
                      <Button 
                        variant="contained" 
                        color="success" 
                        endIcon={<ArrowForward />}
                        onClick={() => navigate(`/stock/actualizar/${prod.id_producto}`)}
                      >
                        Seleccionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Button variant="text" onClick={() => navigate("/productos")} sx={{ mt: 2 }}>
            Volver al listado
          </Button>

        </Container>
      </Box>
    </Box>
  );
};