import { useEffect, useState } from "react";
import { 
  Box, Container, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Typography, 
  Dialog, DialogContent, Divider, Button 
} from "@mui/material";
import { Print, Close, ReceiptLong, Description } from "@mui/icons-material"; 
import axios from "axios";
import { Sidebar } from "../components/Sidebar";

export const ReporteVentas = () => {
  const [ventas, setVentas] = useState([]);
  
  // Estados para el Ticket
  const [ticketOpen, setTicketOpen] = useState(false);
  const [datosTicket, setDatosTicket] = useState<any>(null);

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://sistema-gestion-ferreteria-demo.onrender.com/venta", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVentas(res.data);
      } catch (error) {
        console.error("Error cargando ventas", error);
      }
    };
    cargarVentas();
  }, []);

  const verDetalle = (venta: any) => {
    setDatosTicket({
      id_venta: venta.id_venta,
      fecha: new Date(venta.fecha).toLocaleString(),
      sucursal: venta.sucursal ? venta.sucursal.nombre_sucursal : "Sucursal",
      total: venta.total,
      items: venta.detalles.map((d: any) => ({
        cantidad: d.cantidad,
        nombre: d.producto.nombre, 
        precio_venta: d.precio_unitario,
        subtotal: d.subtotal
      }))
    });
    setTicketOpen(true);
  };

  const imprimirTicket = () => window.print();

  return (
    <Box display="flex">
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          
          <Typography variant="h4" mb={3} display="flex" alignItems="center" gap={1}>
            <ReceiptLong fontSize="large" /> Historial de Ventas
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1e1e2d" }}>
                  <TableCell sx={{ color: "white" }}>Ticket #</TableCell>
                  <TableCell sx={{ color: "white" }}>Fecha y Hora</TableCell>
                  <TableCell sx={{ color: "white" }}>Sucursal</TableCell>
                  <TableCell sx={{ color: "white" }}>Cliente</TableCell>
                  <TableCell sx={{ color: "white" }}>Total</TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center" }}>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ventas.map((v: any) => (
                  <TableRow key={v.id_venta} hover>
                    
                    {/* --- CORRECCIÓN AQUÍ: Usamos sx={{ fontWeight: 'bold' }} --- */}
                    <TableCell sx={{ fontWeight: "bold" }}>#{v.id_venta}</TableCell>
                    
                    <TableCell>{new Date(v.fecha).toLocaleString()}</TableCell>
                    <TableCell>
                      {v.sucursal ? v.sucursal.nombre_sucursal : "-"}
                    </TableCell>
                    <TableCell>{v.cliente_nombre}</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "green" }}>
                      $ {v.total}
                    </TableCell>
                    
                    <TableCell align="center">
                      <Button 
                        variant="outlined" 
                        size="small" 
                        startIcon={<Description />} 
                        onClick={() => verDetalle(v)}
                        sx={{ textTransform: "none" }} 
                      >
                        Ver Ticket
                      </Button>
                    </TableCell>

                  </TableRow>
                ))}
                {ventas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No hay ventas registradas aún.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* --- DIALOG TICKET --- */}
          <Dialog open={ticketOpen} onClose={() => setTicketOpen(false)} maxWidth="xs" fullWidth>
            <DialogContent sx={{ p: 4, backgroundColor: "#fff" }}>
              {datosTicket && (
                <Box sx={{ fontFamily: '"Courier New", Courier, monospace', textAlign: "center" }}>
                  
                  <Typography variant="h6" fontWeight="bold">FERRETERÍA EL TORNILLO</Typography>
                  <Typography variant="caption" display="block">REIMPRESIÓN DE COMPROBANTE</Typography>
                  
                  <Divider sx={{ my: 2, borderStyle: "dashed" }} />
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">{datosTicket.fecha}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Ticket #: {datosTicket.id_venta}</Typography>
                    <Typography variant="body2">{datosTicket.sucursal}</Typography>
                  </Box>

                  <Divider sx={{ my: 2, borderStyle: "dashed" }} />

                  <Box textAlign="left">
                    {datosTicket.items.map((item: any, i: number) => (
                      <Box key={i} display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">
                          {item.cantidad} x {item.nombre.substring(0, 15)}...
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          ${item.subtotal}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Divider sx={{ my: 2, borderStyle: "dashed" }} />

                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography variant="h5" fontWeight="bold">TOTAL</Typography>
                    <Typography variant="h5" fontWeight="bold">${datosTicket.total}</Typography>
                  </Box>

                  <Box mt={4} display="flex" gap={2} className="no-print">
                    <Button variant="outlined" startIcon={<Print />} onClick={imprimirTicket} fullWidth>
                      Imprimir
                    </Button>
                    <Button variant="contained" startIcon={<Close />} onClick={() => setTicketOpen(false)} fullWidth>
                      Cerrar
                    </Button>
                  </Box>

                </Box>
              )}
            </DialogContent>
          </Dialog>

        </Container>
      </Box>
    </Box>
  );
};