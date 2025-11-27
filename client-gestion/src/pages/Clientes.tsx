import { useEffect, useState } from "react";
import { 
  Box, Button, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Typography, IconButton, 
  Dialog, DialogTitle, DialogContent, TextField, Chip, InputAdornment 
} from "@mui/material";
import { Add, Delete, Person, MoneyOff, AttachMoney } from "@mui/icons-material";
import axios from "axios";
import { Sidebar } from "../components/Sidebar";

export const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  
  // Modal Nuevo Cliente
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ nombre_completo: "", telefono: "", direccion: "" });

  // Modal Pagar Deuda
  const [openPago, setOpenPago] = useState(false);
  const [pagoForm, setPagoForm] = useState({ id_cliente: 0, nombre: "", monto: "" });

  const cargarClientes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://sistema-gestion-ferreteria-demo.onrender.com/cliente", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientes(res.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { cargarClientes(); }, []);

  // Crear Cliente
  const handleCrear = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://sistema-gestion-ferreteria-demo.onrender.com/cliente", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenModal(false);
      setForm({ nombre_completo: "", telefono: "", direccion: "" });
      cargarClientes();
    } catch (error) { alert("Error al crear cliente"); }
  };

  // Borrar Cliente
  const handleBorrar = async (id: number) => {
    if(window.confirm("¿Borrar cliente?")) {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://sistema-gestion-ferreteria-demo.onrender.com/cliente/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            cargarClientes();
        } catch (error) { alert("No se pudo borrar"); }
    }
  }

  // Abrir Modal de Pago
  const abrirPago = (cliente: any) => {
    setPagoForm({ id_cliente: cliente.id_cliente, nombre: cliente.nombre_completo, monto: "" });
    setOpenPago(true);
  };

  // Confirmar Pago
  const handleRegistrarPago = async () => {
    if(!pagoForm.monto || Number(pagoForm.monto) <= 0) return alert("Ingrese un monto válido");

    try {
      const token = localStorage.getItem("token");
      await axios.post("https://sistema-gestion-ferreteria-demo.onrender.com/cliente/pagar", {
        id_cliente: pagoForm.id_cliente,
        monto: Number(pagoForm.monto)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Pago registrado correctamente. Saldo actualizado.");
      setOpenPago(false);
      cargarClientes(); // Recargar la tabla para ver el nuevo saldo
    } catch (error) {
      console.error(error);
      alert("Error al registrar el pago");
    }
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" display="flex" alignItems="center" gap={1}>
              <Person fontSize="large"/> Clientes y Cuentas Corrientes
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpenModal(true)}>
              Nuevo Cliente
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#1e1e2d" }}>
                  <TableCell sx={{ color: "white" }}>Nombre</TableCell>
                  <TableCell sx={{ color: "white" }}>Teléfono</TableCell>
                  <TableCell sx={{ color: "white" }}>Dirección</TableCell>
                  <TableCell sx={{ color: "white" }}>Estado de Cuenta</TableCell>
                  <TableCell sx={{ color: "white" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((c: any) => (
                  <TableRow key={c.id_cliente}>
                    <TableCell sx={{ fontWeight: "bold" }}>{c.nombre_completo}</TableCell>
                    <TableCell>{c.telefono || "-"}</TableCell>
                    <TableCell>{c.direccion || "-"}</TableCell>
                    <TableCell>
                        {Number(c.saldo_deudor) > 0 ? (
                            <Chip 
                                icon={<MoneyOff />} 
                                label={`DEBE: $${c.saldo_deudor}`} 
                                color="error" 
                                variant="filled"
                            />
                        ) : (
                            <Chip label="Al día" color="success" variant="outlined" size="small" />
                        )}
                    </TableCell>
                    <TableCell>
                        {/* BOTÓN PAGAR DEUDA (Solo si debe) */}
                        {Number(c.saldo_deudor) > 0 && (
                          <Button 
                                variant="contained" 
                                color="success" 
                                size="small"
                                onClick={() => abrirPago(c)} 
                                startIcon={<AttachMoney />}
                              >
                                SALDAR DEUDA
                              </Button>
                        )}
                        
                        <IconButton color="error" onClick={() => handleBorrar(c.id_cliente)} title="Borrar Cliente">
                            <Delete/>
                        </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {clientes.length === 0 && <TableRow><TableCell colSpan={5} align="center">No hay clientes cargados.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>

          {/* MODAL NUEVO CLIENTE */}
          <Dialog open={openModal} onClose={() => setOpenModal(false)}>
            <DialogTitle>Nuevo Cliente</DialogTitle>
            <DialogContent>
              <Box display="flex" flexDirection="column" gap={2} mt={1} width={300}>
                <TextField label="Nombre Completo *" fullWidth value={form.nombre_completo} onChange={(e) => setForm({...form, nombre_completo: e.target.value})} />
                <TextField label="Teléfono" fullWidth value={form.telefono} onChange={(e) => setForm({...form, telefono: e.target.value})} />
                <TextField label="Dirección" fullWidth value={form.direccion} onChange={(e) => setForm({...form, direccion: e.target.value})} />
                <Button variant="contained" onClick={handleCrear}>Guardar</Button>
              </Box>
            </DialogContent>
          </Dialog>

          {/* MODAL REGISTRAR PAGO */}
          <Dialog open={openPago} onClose={() => setOpenPago(false)}>
            <DialogTitle>Registrar Pago</DialogTitle>
            <DialogContent>
              <Box display="flex" flexDirection="column" gap={2} mt={1} width={300}>
                <Typography variant="body1">
                    Cliente: <b>{pagoForm.nombre}</b>
                </Typography>
                <TextField 
                    label="Monto que entrega" 
                    type="number" 
                    fullWidth 
                    autoFocus
                    value={pagoForm.monto} 
                    onChange={(e) => setPagoForm({...pagoForm, monto: e.target.value})} 
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                /> 
                <Button variant="contained" color="success" size="large" onClick={handleRegistrarPago}>
                    CONFIRMAR PAGO
                </Button>
              </Box>
            </DialogContent>
          </Dialog>

        </Container>
      </Box>
    </Box>
  );
};