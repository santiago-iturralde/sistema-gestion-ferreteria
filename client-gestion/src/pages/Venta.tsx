import { useEffect, useState } from "react";
import { 
  Box, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Typography, TextField, 
  MenuItem, IconButton, Dialog, DialogContent, DialogTitle, Divider 
} from "@mui/material";
import { Search, ShoppingCart, CameraAlt, Print, Close, Person, CreditCard, Delete } from "@mui/icons-material";
import axios from "axios";
import { Sidebar } from "../components/Sidebar";
import { Scanner } from "../components/Scanner";

export const Venta = () => {
  // --- ESTADOS DE DATOS ---
  const [productos, setProductos] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [clientes, setClientes] = useState([]); 
  
  // --- ESTADOS DE LA VENTA ---
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState("");
  const [carrito, setCarrito] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [total, setTotal] = useState(0);

  // --- DATOS DEL PAGO ---
  const [idCliente, setIdCliente] = useState(""); 
  const [metodoPago, setMetodoPago] = useState("Efectivo");

  // --- ESTADO CÁMARA ---
  const [mostrarScanner, setMostrarScanner] = useState(false);

  // --- ESTADO DEL TICKET ---
  const [ticketOpen, setTicketOpen] = useState(false);
  const [datosTicket, setDatosTicket] = useState<any>(null);

  // 1. Cargar Datos Iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const [resProd, resSuc, resCli] = await Promise.all([
            axios.get("https://sistema-gestion-ferreteria-demo.onrender.com/producto", config),
            axios.get("https://sistema-gestion-ferreteria-demo.onrender.com/sucursal", config),
            axios.get("https://sistema-gestion-ferreteria-demo.onrender.com/cliente", config) 
        ]);

        setProductos(resProd.data);
        setSucursales(resSuc.data);
        setClientes(resCli.data);
      } catch (e) { console.error(e); }
    };
    cargarDatos();
  }, []);

  // 2. Calcular Total
  useEffect(() => {
    const cuenta = carrito.reduce((acc, item) => acc + (item.precio_venta * item.cantidad), 0);
    setTotal(cuenta);
  }, [carrito]);

  // --- FUNCIONES DEL CARRITO ---
  const agregarAlCarrito = (producto: any) => {
    if (!sucursalSeleccionada) {
      alert("¡Primero seleccioná desde qué sucursal estás vendiendo!");
      return;
    }

    const stockEnSucursal = producto.stocks.find((s: any) => s.sucursal.id_sucursal === Number(sucursalSeleccionada));
    const cantidadDisponible = stockEnSucursal ? stockEnSucursal.cantidad : 0;
    const itemEnCarrito = carrito.find(item => item.id_producto === producto.id_producto);
    const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;

    if (cantidadEnCarrito + 1 > cantidadDisponible) {
      alert(`¡No hay suficiente stock! Quedan ${cantidadDisponible} unidades.`);
      return;
    }

    if (itemEnCarrito) {
      const nuevoCarrito = carrito.map(item => 
        item.id_producto === producto.id_producto ? { ...item, cantidad: item.cantidad + 1 } : item
      );
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito(carrito.filter(item => item.id_producto !== id));
  };

  // --- FUNCIÓN COBRAR ---
  const handleCobrar = async () => {
    if (carrito.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      
      let nombreClienteFinal = "Consumidor Final";
      if (idCliente) {
          const cli: any = clientes.find((c: any) => c.id_cliente === Number(idCliente));
          if (cli) nombreClienteFinal = cli.nombre_completo;
      }

      const ventaData = {
        id_sucursal: Number(sucursalSeleccionada),
        id_usuario: 1, 
        cliente_nombre: nombreClienteFinal,
        id_cliente: idCliente ? Number(idCliente) : null,
        metodo_pago: metodoPago,
        items: carrito.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad
        }))
      };

      const resVenta = await axios.post("https://sistema-gestion-ferreteria-demo.onrender.com/venta", ventaData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const sucEncontrada = sucursales.find((s: any) => s.id_sucursal === Number(sucursalSeleccionada));
      const nombreSucursal = (sucEncontrada as any)?.nombre_sucursal || "Sucursal";

      setDatosTicket({
        id_venta: resVenta.data.id_venta,
        fecha: new Date().toLocaleString(),
        sucursal: nombreSucursal, 
        cliente: nombreClienteFinal,
        metodo: metodoPago,
        items: [...carrito], 
        total: total
      });

      setTicketOpen(true);

      setCarrito([]); 
      setBusqueda("");
      setIdCliente(""); 
      setMetodoPago("Efectivo"); 

      const resProd = await axios.get("https://sistema-gestion-ferreteria-demo.onrender.com/producto", { headers: { Authorization: `Bearer ${token}` } });
      const resCli = await axios.get("https://sistema-gestion-ferreteria-demo.onrender.com/cliente", { headers: { Authorization: `Bearer ${token}` } });
      setProductos(resProd.data);
      setClientes(resCli.data);

    } catch (error) {
      alert("Error al procesar venta. Revisá el stock.");
      console.error(error);
    }
  };

  const cerrarTicket = () => {
    setTicketOpen(false);
    setDatosTicket(null);
  };

  const imprimirTicket = () => {
    window.print(); 
  };

  const productosFiltrados = productos.filter((p: any) => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    (p.cod_barras && p.cod_barras.includes(busqueda))
  );

  return (
    <Box display="flex">
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, height: "100vh", overflow: "hidden", bgcolor: "#f4f6f8" }}>
        
        {/* ENCABEZADO */}
        <Paper sx={{ p: 2, mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" fontWeight="bold">Punto de Venta</Typography>
          <TextField
            select label="Sucursal de Venta" size="small" sx={{ width: 250 }}
            value={sucursalSeleccionada}
            onChange={(e: any) => setSucursalSeleccionada(e.target.value)}
          >
            {sucursales.map((suc: any) => (
              <MenuItem key={suc.id_sucursal} value={suc.id_sucursal}>{suc.nombre_sucursal}</MenuItem>
            ))}
          </TextField>
        </Paper>

        <Box display="flex" gap={2} sx={{ height: "85%" }}>
          {/* IZQUIERDA: PRODUCTOS */}
          <Box sx={{ flex: 7, display: "flex", flexDirection: "column", height: "100%" }}>
            <Paper sx={{ p: 2, mb: 2, display: "flex", gap: 1 }}>
              <TextField 
                fullWidth placeholder="Buscar producto o escanear..." 
                value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                InputProps={{ startAdornment: <Search color="action" /> }}
              />
              <Button variant="contained" color="secondary" onClick={() => setMostrarScanner(true)}>
                <CameraAlt />
              </Button>
            </Paper>

            <TableContainer component={Paper} sx={{ flexGrow: 1 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell align="right">Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productosFiltrados.slice(0, 10).map((prod: any) => {
                    const stock = prod.stocks.find((s: any) => s.sucursal.id_sucursal === Number(sucursalSeleccionada));
                    const cant = stock ? stock.cantidad : 0;
                    return (
                      <TableRow key={prod.id_producto}>
                        <TableCell>{prod.nombre}</TableCell>
                        <TableCell>${prod.precio_venta}</TableCell>
                        <TableCell>
                          <Typography color={cant > 0 ? "success.main" : "error"} fontWeight="bold">{cant} u.</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Button 
                            variant="contained" size="small" disabled={cant <= 0 || !sucursalSeleccionada}
                            onClick={() => agregarAlCarrito(prod)}
                          >
                            Agregar
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* DERECHA: TICKET Y PAGO */}
          <Box sx={{ flex: 5, height: "100%" }}>
            <Paper sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2 }}>
              <Typography variant="h6" mb={2} display="flex" alignItems="center" gap={1}>
                <ShoppingCart /> Ticket de Venta
              </Typography>
              
              <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2, bgcolor: "#f9f9f9", borderRadius: 1, p: 1 }}>
                {carrito.map((item, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1} borderBottom="1px dashed #ddd" pb={1}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">{item.nombre}</Typography>
                      <Typography variant="caption">{item.cantidad} x ${item.precio_venta}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body1" fontWeight="bold" mr={1}>${item.cantidad * item.precio_venta}</Typography>
                      <IconButton size="small" color="error" onClick={() => eliminarDelCarrito(item.id_producto)}><Delete fontSize="small" /></IconButton>
                    </Box>
                  </Box>
                ))}
                {carrito.length === 0 && <Typography align="center" color="textSecondary" mt={4}>Carrito vacío</Typography>}
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* --- ZONA DE PAGO (SIN GRID, USANDO BOX VERTICAL) --- */}
              <Box display="flex" flexDirection="column" gap={2} mb={2}>
                  <TextField 
                      select label="Cliente" fullWidth size="small"
                      value={idCliente}
                      onChange={(e) => setIdCliente(e.target.value)}
                      InputProps={{ startAdornment: <Person fontSize="small" color="action" sx={{ mr: 1 }} /> }}
                  >
                      <MenuItem value="">Consumidor Final</MenuItem>
                      {clientes.map((c: any) => (
                          <MenuItem key={c.id_cliente} value={c.id_cliente}>
                              {c.nombre_completo} {c.saldo_deudor > 0 ? `(Debe: $${c.saldo_deudor})` : ""}
                          </MenuItem>
                      ))}
                  </TextField>

                  <TextField 
                      select label="Método de Pago" fullWidth size="small"
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      InputProps={{ startAdornment: <CreditCard fontSize="small" color="action" sx={{ mr: 1 }} /> }}
                  >
                      <MenuItem value="Efectivo">Efectivo</MenuItem>
                      <MenuItem value="Débito">Tarjeta Débito</MenuItem>
                      <MenuItem value="Crédito">Tarjeta Crédito</MenuItem>
                      <MenuItem value="Transferencia">Transferencia</MenuItem>
                      {/* SOLO MOSTRAMOS ESTO SI ELIGIÓ UN CLIENTE REGISTRADO */}
                      {idCliente && <MenuItem value="Cuenta Corriente" sx={{ color: "red", fontWeight: "bold" }}>Cuenta Corriente (Fiado)</MenuItem>}
                  </TextField>
              </Box>

              <Paper sx={{ p: 2, bgcolor: "#1e1e2d", color: "white", borderRadius: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="h5">TOTAL:</Typography>
                  <Typography variant="h5" fontWeight="bold">${total}</Typography>
                </Box>
                <Button 
                  fullWidth variant="contained" color="success" size="large"
                  disabled={carrito.length === 0} onClick={handleCobrar}
                >
                  COBRAR
                </Button>
              </Paper>
            </Paper>
          </Box>
        </Box>

        {/* DIALOG SCANNER */}
        <Dialog open={mostrarScanner} onClose={() => setMostrarScanner(false)}>
          <DialogTitle>Escanear Producto</DialogTitle>
          <DialogContent>
             {mostrarScanner && <Scanner onScan={(codigo) => { setBusqueda(codigo); setMostrarScanner(false); }} />}
             <Button onClick={() => setMostrarScanner(false)} fullWidth sx={{mt:2}}>Cancelar</Button>
          </DialogContent>
        </Dialog>

        {/* --- DIALOG TICKET DE COMPRA --- */}
        <Dialog open={ticketOpen} onClose={cerrarTicket} maxWidth="xs" fullWidth>
          <DialogContent sx={{ p: 4, backgroundColor: "#fff" }}>
            {datosTicket && (
              <Box sx={{ fontFamily: '"Courier New", Courier, monospace', textAlign: "center" }}>
                <Typography variant="h6" fontWeight="bold">FERRETERÍA EL TORNILLO</Typography>
                <Typography variant="caption" display="block">Av. Siempre Viva 742</Typography>
                <Divider sx={{ my: 2, borderStyle: "dashed" }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Fecha: {datosTicket.fecha}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Venta #: {datosTicket.id_venta}</Typography>
                </Box>
                <Box textAlign="left" mt={1}>
                    <Typography variant="body2">Cliente: <b>{datosTicket.cliente}</b></Typography>
                    <Typography variant="body2">Pago: {datosTicket.metodo}</Typography>
                </Box>
                <Divider sx={{ my: 2, borderStyle: "dashed" }} />
                <Box textAlign="left">
                  {datosTicket.items.map((item: any, i: number) => (
                    <Box key={i} display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{item.cantidad} x {item.nombre.substring(0, 15)}...</Typography>
                      <Typography variant="body2" fontWeight="bold">${item.cantidad * item.precio_venta}</Typography>
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ my: 2, borderStyle: "dashed" }} />
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography variant="h5" fontWeight="bold">TOTAL</Typography>
                  <Typography variant="h5" fontWeight="bold">${datosTicket.total}</Typography>
                </Box>
                <Box mt={4} display="flex" gap={2} className="no-print">
                  <Button variant="outlined" startIcon={<Print />} onClick={imprimirTicket} fullWidth>Imprimir</Button>
                  <Button variant="contained" startIcon={<Close />} onClick={cerrarTicket} fullWidth>Cerrar</Button>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

      </Box>
    </Box>
  );
};