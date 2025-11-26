import { useEffect, useState } from "react";
import { 
  Box, Button, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Typography, 
  Dialog, DialogTitle, DialogContent, TextField, MenuItem, Divider, IconButton, Autocomplete, createFilterOptions 
} from "@mui/material";
import { Add, LocalShipping, Store, Close, Inventory } from "@mui/icons-material";
import axios from "axios";
import { Sidebar } from "../components/Sidebar";

interface ItemCarrito {
  id_producto: string | number;
  nombre: string;
  cantidad: number;
  precio_costo: number;
}

const filter = createFilterOptions<any>();

export const Compras = () => {
  // --- ESTADOS DE DATOS ---
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [productos, setProductos] = useState([]);

  // --- MODALES ---
  const [openNuevaCompra, setOpenNuevaCompra] = useState(false);
  const [openGestionProv, setOpenGestionProv] = useState(false);
  const [openGestionSuc, setOpenGestionSuc] = useState(false);
  const [openNuevoProd, setOpenNuevoProd] = useState(false); 

  // --- FORMULARIOS ---
  const [compraForm, setCompraForm] = useState({ id_proveedor: "", id_sucursal: "" });
  const [carritoCompra, setCarritoCompra] = useState<ItemCarrito[]>([]);

  const [itemForm, setItemForm] = useState<any>({ 
    productoSeleccionado: null,
    cantidad: 1, 
    precio_costo: 0 
  });

  const [provForm, setProvForm] = useState({ razon_social: "", cuit: "", telefono: "" });
  const [sucForm, setSucForm] = useState({ nombre_sucursal: "", direccion: "", telefono: "" });
  
  // FORMULARIO PRODUCTO RÁPIDO (Alineado con tu NuevoProducto.tsx)
  const [prodForm, setProdForm] = useState({ 
    nombre: "", 
    codigo: "", 
    id_proveedor: "", // <--- REEMPLAZA A CATEGORÍA
    precio_venta: 0,
    stock_minimo: 5 // Valor por defecto
  });

  // --- CARGA DE DATOS ---
  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [resCompras, resProv, resSuc, resProd] = await Promise.all([
        axios.get("http://localhost:3000/compra", config),
        axios.get("http://localhost:3000/proveedor", config),
        axios.get("http://localhost:3000/sucursal", config),
        axios.get("http://localhost:3000/producto", config)
      ]);

      setCompras(resCompras.data);
      setProveedores(resProv.data);
      setSucursales(resSuc.data);
      setProductos(resProd.data);
    } catch (error) { console.error("Error cargando datos", error); }
  };

  useEffect(() => { cargarDatos(); }, []);

  // --- CARRITO ---
  const agregarAlCarrito = () => {
    if (!itemForm.productoSeleccionado || !itemForm.productoSeleccionado.id_producto) return;
    
    setCarritoCompra([
      ...carritoCompra, 
      { 
        id_producto: itemForm.productoSeleccionado.id_producto,
        cantidad: Number(itemForm.cantidad),
        precio_costo: Number(itemForm.precio_costo),
        nombre: itemForm.productoSeleccionado.nombre 
      }
    ]);
    setItemForm({ productoSeleccionado: null, cantidad: 1, precio_costo: 0 });
  };

  const confirmarCompra = async () => {
    if (carritoCompra.length === 0) return alert("El carrito está vacío");
    if (!compraForm.id_proveedor || !compraForm.id_sucursal) return alert("Falta Proveedor o Sucursal");

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/compra", {
        id_proveedor: Number(compraForm.id_proveedor),
        id_sucursal: Number(compraForm.id_sucursal),
        id_usuario: 1, 
        items: carritoCompra
      }, { headers: { Authorization: `Bearer ${token}` } });

      alert("¡Compra registrada correctamente!");
      setOpenNuevaCompra(false);
      setCarritoCompra([]);
      setCompraForm({ id_proveedor: "", id_sucursal: "" });
      cargarDatos(); 
    } catch (error) {
      console.error(error);
      alert("Error al procesar la compra");
    }
  };

  // --- CREAR PRODUCTO NUEVO (SIN CATEGORÍA, CON PROVEEDOR) ---
  const crearProductoRapido = async () => {
    // Validamos que tenga nombre, código y proveedor (según tu lógica actual)
    if(!prodForm.nombre || !prodForm.codigo || !prodForm.id_proveedor) return alert("Completá nombre, código y proveedor");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:3000/producto", {
        nombre: prodForm.nombre,
        cod_barras: prodForm.codigo, // Usamos cod_barras como en tu NuevoProducto.tsx
        precio_venta: Number(prodForm.precio_venta),
        stock_minimo_alerta: Number(prodForm.stock_minimo),
        // Proveedor obligatorio según tu sistema
        proveedor: Number(prodForm.id_proveedor),
        
        precio_costo: 0, // Se define en la compra
        activo: true,
        empresa: 1
      }, { headers: { Authorization: `Bearer ${token}` } });

      alert("Producto creado!");
      
      const resProd = await axios.get("http://localhost:3000/producto", { headers: { Authorization: `Bearer ${token}` } });
      const nuevosProductos = resProd.data;
      setProductos(nuevosProductos);

      const nuevoProducto = nuevosProductos.find((p:any) => p.id_producto === res.data.id_producto);
      
      setItemForm({ 
        ...itemForm, 
        productoSeleccionado: nuevoProducto,
        precio_costo: 0 
      });

      setOpenNuevoProd(false);
      // Limpiamos form pero mantenemos el proveedor si es el mismo de la compra para agilizar
      setProdForm({ nombre: "", codigo: "", id_proveedor: compraForm.id_proveedor, precio_venta: 0, stock_minimo: 5 });

    } catch (error) {
      console.error(error);
      alert("Error al crear producto. Verificá si el código ya existe.");
    }
  };

  // --- GESTIÓN AUXILIARES ---
  const guardarProveedor = async () => { 
      try {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:3000/proveedor", { ...provForm, empresa: 1 }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("Proveedor guardado");
        setProvForm({ razon_social: "", cuit: "", telefono: "" });
        cargarDatos();
        } catch (error) { alert("Error al guardar proveedor"); }
  };
  const guardarSucursal = async () => { 
      try {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:3000/sucursal", { ...sucForm, empresa: 1 }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("Sucursal guardada");
        setSucForm({ nombre_sucursal: "", direccion: "", telefono: "" });
        cargarDatos();
        } catch (error) { alert("Error al guardar sucursal"); }
  };


  return (
    <Box display="flex">
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" display="flex" alignItems="center" gap={1}>
              <LocalShipping fontSize="large" /> Gestión de Compras
            </Typography>
            <Box display="flex" gap={2}>
              <Button variant="outlined" startIcon={<LocalShipping />} onClick={() => setOpenGestionProv(true)}>Ver Proveedores</Button>
              <Button variant="outlined" startIcon={<Store />} onClick={() => setOpenGestionSuc(true)}>Ver Sucursales</Button>
              <Button variant="contained" startIcon={<Add />} onClick={() => setOpenNuevaCompra(true)}>Nueva Compra</Button>
            </Box>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#1e1e2d" }}>
                  <TableCell sx={{ color: "white" }}>Fecha</TableCell>
                  <TableCell sx={{ color: "white" }}>Proveedor</TableCell>
                  <TableCell sx={{ color: "white" }}>Destino</TableCell>
                  <TableCell sx={{ color: "white" }}>Total</TableCell>
                  <TableCell sx={{ color: "white" }}>Items</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {compras.map((c: any) => (
                  <TableRow key={c.id_compra}>
                    <TableCell>{new Date(c.fecha).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{c.proveedor ? c.proveedor.razon_social : "?"}</TableCell>
                    <TableCell>{c.sucursal ? c.sucursal.nombre_sucursal : "?"}</TableCell>
                    <TableCell sx={{ color: "green", fontWeight: "bold" }}>$ {c.total}</TableCell>
                    <TableCell>{c.detalles ? c.detalles.length : 0}</TableCell>
                  </TableRow>
                ))}
                {compras.length === 0 && <TableRow><TableCell colSpan={5} align="center">Sin historial.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ===================================================================== */}
          {/* MODAL 1: NUEVA COMPRA */}
          {/* ===================================================================== */}
          <Dialog open={openNuevaCompra} onClose={() => setOpenNuevaCompra(false)} maxWidth="md" fullWidth>
            <DialogTitle>Nueva Entrada de Mercadería</DialogTitle>
            <DialogContent>
              <Box mt={2} display="flex" gap={2}>
                <TextField select label="Proveedor de la Compra" fullWidth value={compraForm.id_proveedor} onChange={(e) => setCompraForm({...compraForm, id_proveedor: e.target.value})}>
                  {proveedores.map((p: any) => <MenuItem key={p.id_proveedor} value={p.id_proveedor}>{p.razon_social}</MenuItem>)}
                </TextField>
                <TextField select label="Sucursal Destino" fullWidth value={compraForm.id_sucursal} onChange={(e) => setCompraForm({...compraForm, id_sucursal: e.target.value})}>
                  {sucursales.map((s: any) => <MenuItem key={s.id_sucursal} value={s.id_sucursal}>{s.nombre_sucursal}</MenuItem>)}
                </TextField>
              </Box>

              <Divider sx={{ my: 3 }}><Typography color="textSecondary">PRODUCTOS</Typography></Divider>

              <Box display="flex" gap={2} alignItems="center" mb={2}>
                
                {/* --- BUSCADOR INTELIGENTE --- */}
                <Autocomplete
                  sx={{ flex: 2 }}
                  value={itemForm.productoSeleccionado}
                  
                  onChange={(event, newValue) => {
                    if (newValue && newValue.inputValue) {
                        // SI ES NUEVO: Abrimos modal para crear
                        setOpenNuevoProd(true);
                        // Pre-cargamos el nombre que escribió y el proveedor de la compra (si ya eligió uno)
                        setProdForm({ 
                            ...prodForm, 
                            nombre: newValue.inputValue,
                            id_proveedor: compraForm.id_proveedor // Sugiérele el mismo proveedor de la compra
                        }); 
                    } else {
                        setItemForm({ 
                            ...itemForm, 
                            productoSeleccionado: newValue,
                            precio_costo: newValue ? Number(newValue.precio_costo || 0) : 0
                        });
                    }
                  }}

                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    const isExisting = options.some((option) => option.nombre.toLowerCase() === inputValue.toLowerCase());
                    if (inputValue !== '' && !isExisting) {
                      filtered.push({
                        inputValue,
                        nombre: `AGREGAR NUEVO: "${inputValue}"`,
                        esNuevo: true 
                      });
                    }
                    return filtered;
                  }}

                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  options={productos}
                  getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    if (option.inputValue) return option.inputValue;
                    return option.nombre;
                  }}
                  renderOption={(props, option) => (
                    <li {...props} style={{ color: option.esNuevo ? 'blue' : 'inherit', fontWeight: option.esNuevo ? 'bold' : 'normal' }}>
                      {option.nombre}
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} label="Buscar o Crear Producto..." />}
                />

                <TextField label="Cant." type="number" sx={{ width: 80 }} value={itemForm.cantidad} onChange={(e) => setItemForm({...itemForm, cantidad: Number(e.target.value)})} />
                <TextField label="Costo Unit." type="number" sx={{ width: 100 }} value={itemForm.precio_costo} onChange={(e) => setItemForm({...itemForm, precio_costo: Number(e.target.value)})} />
                <Button variant="contained" onClick={agregarAlCarrito}>OK</Button>
              </Box>

              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f5f5f5", maxHeight: 200, overflow: "auto" }}>
                {carritoCompra.map((item, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" mb={1} borderBottom="1px solid #ddd" pb={1}>
                    <Typography>{item.cantidad} x <b>{item.nombre}</b></Typography>
                    <Typography fontWeight="bold">${item.cantidad * item.precio_costo}</Typography>
                  </Box>
                ))}
                {carritoCompra.length === 0 && <Typography align="center" color="textSecondary">Lista vacía</Typography>}
              </Paper>
              
              <Box mt={2} textAlign="right">
                <Typography variant="h6">Total: $ {carritoCompra.reduce((acc, item) => acc + (item.cantidad * item.precio_costo), 0)}</Typography>
              </Box>

              <Box mt={3} display="flex" gap={2} justifyContent="flex-end">
                <Button onClick={() => setOpenNuevaCompra(false)}>Cancelar</Button>
                <Button variant="contained" color="success" onClick={confirmarCompra}>CONFIRMAR</Button>
              </Box>
            </DialogContent>
          </Dialog>

          {/* MODAL PROVEEDORES */}
          <Dialog open={openGestionProv} onClose={() => setOpenGestionProv(false)} maxWidth="md" fullWidth>
            <DialogTitle display="flex" justifyContent="space-between">Listado de Proveedores <IconButton onClick={() => setOpenGestionProv(false)}><Close /></IconButton></DialogTitle>
            <DialogContent>
              <Box display="flex" gap={2} mb={3} mt={1} p={2} bgcolor="#f0f4c3" borderRadius={2}>
                <TextField label="Razón Social" size="small" fullWidth value={provForm.razon_social} onChange={(e) => setProvForm({...provForm, razon_social: e.target.value})} />
                <TextField label="CUIT" size="small" value={provForm.cuit} onChange={(e) => setProvForm({...provForm, cuit: e.target.value})} />
                <TextField label="Teléfono" size="small" value={provForm.telefono} onChange={(e) => setProvForm({...provForm, telefono: e.target.value})} />
                <Button variant="contained" color="success" onClick={guardarProveedor}>Guardar</Button>
              </Box>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead><TableRow><TableCell>Nombre</TableCell><TableCell>CUIT</TableCell><TableCell>Tel</TableCell></TableRow></TableHead>
                    <TableBody>
                        {proveedores.map((p:any) => <TableRow key={p.id_proveedor}><TableCell>{p.razon_social}</TableCell><TableCell>{p.cuit}</TableCell><TableCell>{p.telefono}</TableCell></TableRow>)}
                    </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
          </Dialog>

          {/* MODAL SUCURSALES */}
          <Dialog open={openGestionSuc} onClose={() => setOpenGestionSuc(false)} maxWidth="md" fullWidth>
            <DialogTitle display="flex" justifyContent="space-between">Listado de Sucursales <IconButton onClick={() => setOpenGestionSuc(false)}><Close /></IconButton></DialogTitle>
            <DialogContent>
              <Box display="flex" gap={2} mb={3} mt={1} p={2} bgcolor="#e1bee7" borderRadius={2}>
                <TextField label="Nombre" size="small" fullWidth value={sucForm.nombre_sucursal} onChange={(e) => setSucForm({...sucForm, nombre_sucursal: e.target.value})} />
                <TextField label="Dirección" size="small" fullWidth value={sucForm.direccion} onChange={(e) => setSucForm({...sucForm, direccion: e.target.value})} />
                <TextField label="Teléfono" size="small" value={sucForm.telefono} onChange={(e) => setSucForm({...sucForm, telefono: e.target.value})} />
                <Button variant="contained" color="secondary" onClick={guardarSucursal}>Guardar</Button>
              </Box>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead><TableRow><TableCell>Nombre</TableCell><TableCell>Dir</TableCell><TableCell>Tel</TableCell></TableRow></TableHead>
                    <TableBody>
                        {sucursales.map((s:any) => <TableRow key={s.id_sucursal}><TableCell>{s.nombre_sucursal}</TableCell><TableCell>{s.direccion}</TableCell><TableCell>{s.telefono}</TableCell></TableRow>)}
                    </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
          </Dialog>

          {/* MODAL 4: CREACIÓN AUTOMÁTICA DE PRODUCTO (SIN CATEGORÍA, CON PROVEEDOR) */}
          <Dialog open={openNuevoProd} onClose={() => setOpenNuevoProd(false)} maxWidth="sm" fullWidth>
            <DialogTitle display="flex" alignItems="center" gap={1}>
                <Inventory /> Completar Datos del Nuevo Producto
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="textSecondary" mb={2}>
                    Estás creando <b>"{prodForm.nombre}"</b>.
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField label="Nombre" fullWidth value={prodForm.nombre} onChange={(e) => setProdForm({...prodForm, nombre: e.target.value})} />
                    <TextField label="Código de Barras" fullWidth value={prodForm.codigo} onChange={(e) => setProdForm({...prodForm, codigo: e.target.value})} />
                    
                    {/* AQUÍ ESTABA LA CATEGORÍA, AHORA ES PROVEEDOR */}
                    <TextField 
                        select label="Proveedor Principal" fullWidth 
                        value={prodForm.id_proveedor} 
                        onChange={(e) => setProdForm({...prodForm, id_proveedor: e.target.value})}
                        helperText="A quién se lo compras habitualmente"
                    >
                        {proveedores.map((p: any) => (
                            <MenuItem key={p.id_proveedor} value={p.id_proveedor}>{p.razon_social}</MenuItem>
                        ))}
                    </TextField>

                    <TextField label="Precio Venta (Público)" type="number" fullWidth value={prodForm.precio_venta} onChange={(e) => setProdForm({...prodForm, precio_venta: Number(e.target.value)})} />
                    
                    <Button variant="contained" color="primary" onClick={crearProductoRapido} size="large">
                        Guardar y Usar
                    </Button>
                </Box>
            </DialogContent>
          </Dialog>

        </Container>
      </Box>
    </Box>
  );
};