import { useEffect, useState } from "react";
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material"; // <--- Íconos nuevos
import axios from "axios";
import { Sidebar } from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export const Productos = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);

  // Cargar la lista
  const cargarProductos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/producto", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(response.data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // --- FUNCIÓN DE BORRAR ---
  const handleDelete = async (id: number) => {
    // 1. Preguntamos primero (Confirmación)
    if (window.confirm("¿Estás seguro de que querés eliminar este producto?")) {
      try {
        const token = localStorage.getItem("token");
        // 2. Llamamos al Backend para que lo borre
        await axios.delete(`http://localhost:3000/producto/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // 3. Recargamos la lista para que desaparezca visualmente
        cargarProductos(); 
      } catch (error) {
        console.error("Error al borrar", error);
        alert("Hubo un error al intentar borrar.");
      }
    }
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">Inventario de Productos</Typography>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              color="primary"
              onClick={() => navigate("/productos/nuevo")}
            >
              Nuevo Producto
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1e1e2d" }}>
                  <TableCell sx={{ color: "white" }}>Nombre</TableCell>
                  <TableCell sx={{ color: "white" }}>Descripción</TableCell>
                  <TableCell sx={{ color: "white" }}>Código</TableCell>
                  <TableCell sx={{ color: "white" }}>Precio Venta</TableCell>
                  <TableCell sx={{ color: "white" }}>Proveedor</TableCell>
                  <TableCell sx={{ color: "white" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {productos.map((prod: any) => (
                  <TableRow key={prod.id_producto}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{prod.nombre}</TableCell>
                    <TableCell>{prod.descripcion || "-"}</TableCell>
                    <TableCell>{prod.cod_barras || "-"}</TableCell>
                    <TableCell>$ {prod.precio_venta}</TableCell>
                    <TableCell>{prod.proveedor ? prod.proveedor.razon_social : "Sin Prov."}</TableCell>
                    
                    {/* --- COLUMNA DE ACCIONES NUEVA --- */}
                    <TableCell>
                      <IconButton size="small" color="primary" onClick={() => navigate(`/productos/editar/${prod.id_producto}`)}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(prod.id_producto)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                    
                  </TableRow>
                ))}

                {productos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No hay productos cargados</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

        </Container>
      </Box>
    </Box>
  );
};