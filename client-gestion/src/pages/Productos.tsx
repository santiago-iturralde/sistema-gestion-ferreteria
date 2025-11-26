import { useEffect, useState } from "react";
import { 
  Box, Button, Container, Paper, Table, TableBody, TableCell, // <--- AHORA SÍ ESTÁ EL BUTTON
  TableContainer, TableHead, TableRow, Typography, IconButton, 
  TextField, InputAdornment, Chip, Stack, Dialog, DialogContent, DialogTitle 
} from "@mui/material"; 
import { Delete, Edit, Search, Store, Warehouse, CameraAlt } from "@mui/icons-material"; 
import axios from "axios";
import { Sidebar } from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Scanner } from "../components/Scanner"; 

export const Productos = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  
  // --- ESTADO PARA LA CÁMARA ---
  const [mostrarScanner, setMostrarScanner] = useState(false);

  const cargarProductos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/producto", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductos(response.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que querés eliminar este producto?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/producto/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        cargarProductos(); 
      } catch (error) { console.error(error); }
    }
  };

  // --- FUNCIÓN AL ESCANEAR ---
  const handleScanSuccess = (codigo: string) => {
    setBusqueda(codigo);      // Pone el código en el buscador
    setMostrarScanner(false); // Cierra la cámara
  };

  const productosFiltrados = productos.filter((prod: any) => {
    const termino = busqueda.toLowerCase();
    return (
      prod.nombre.toLowerCase().includes(termino) ||
      (prod.cod_barras && prod.cod_barras.includes(termino)) || 
      (prod.descripcion && prod.descripcion.toLowerCase().includes(termino))
    );
  });

  return (
    <Box display="flex">
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          
          {/* CABECERA LIMPIA (Solo Título) */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" fontWeight="bold">Inventario</Typography>
          </Box>

          {/* BARRA DE BÚSQUEDA + CÁMARA */}
          <Paper sx={{ p: 2, mb: 3, display: "flex", gap: 1 }}>
            <TextField
              fullWidth variant="outlined" placeholder="Buscar por nombre, código..." 
              value={busqueda} 
              onChange={(e) => setBusqueda(e.target.value)}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Search color="action" /></InputAdornment>) }}
            />
            
            {/* BOTÓN PARA ABRIR CÁMARA */}
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={() => setMostrarScanner(true)}
              sx={{ minWidth: "50px", px: 1 }}
              title="Escanear con cámara"
            >
              <CameraAlt />
            </Button>
          </Paper>

          {/* VENTANA FLOTANTE DEL SCANNER */}
          <Dialog open={mostrarScanner} onClose={() => setMostrarScanner(false)}>
            <DialogTitle>Escanear Código</DialogTitle>
            <DialogContent>
               {mostrarScanner && <Scanner onScan={handleScanSuccess} />}
               <Button onClick={() => setMostrarScanner(false)} color="error" fullWidth sx={{ mt: 2 }}>
                 Cancelar
               </Button>
            </DialogContent>
          </Dialog>

          {/* TABLA DE PRODUCTOS */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1e1e2d" }}>
                  <TableCell sx={{ color: "white" }}>Nombre</TableCell>
                  <TableCell sx={{ color: "white" }}>Descripción</TableCell>
                  <TableCell sx={{ color: "white", minWidth: "180px" }}>Disponibilidad</TableCell>
                  <TableCell sx={{ color: "white" }}>Precio Venta</TableCell>
                  <TableCell sx={{ color: "white" }}>Proveedor</TableCell>
                  <TableCell sx={{ color: "white" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {productosFiltrados.map((prod: any) => (
                  <TableRow key={prod.id_producto}>
                    <TableCell>
                      <Typography fontWeight="bold">{prod.nombre}</Typography>
                      <Typography variant="caption" color="textSecondary">{prod.cod_barras}</Typography>
                    </TableCell>
                    
                    <TableCell>{prod.descripcion || "-"}</TableCell>

                    <TableCell>
                      <Stack direction="column" spacing={1}>
                        {prod.stocks && prod.stocks.length > 0 ? (
                          prod.stocks.map((item: any) => (
                            <Chip 
                              key={item.id_stock}
                              icon={item.sucursal.nombre_sucursal.toLowerCase().includes('deposito') ? <Warehouse/> : <Store/>}
                              label={`${item.sucursal.nombre_sucursal}: ${item.cantidad} u.`}
                              color={item.cantidad > 5 ? "success" : item.cantidad > 0 ? "warning" : "error"}
                              variant="outlined" size="small" sx={{ justifyContent: "flex-start" }} 
                            />
                          ))
                        ) : <Chip label="Sin Stock" size="small" disabled />}
                      </Stack>
                    </TableCell>

                    <TableCell>$ {prod.precio_venta}</TableCell>
                    <TableCell>{prod.proveedor ? prod.proveedor.razon_social : "-"}</TableCell>
                    
                    <TableCell>
                      <IconButton color="primary" onClick={() => navigate(`/productos/editar/${prod.id_producto}`)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(prod.id_producto)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </Container>
      </Box>
    </Box>
  );
};