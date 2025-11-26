import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Productos } from "./pages/Productos"; 
import { NuevoProducto } from "./pages/NuevoProducto"; 
import { ActualizarStock } from "./pages/ActualizarStock";
import { SeleccionarProducto } from "./pages/SeleccionarProducto";
import { Venta } from "./pages/Venta";
import { ReporteVentas } from "./pages/ReporteVentas";
import { Usuarios } from "./pages/Usuarios"; // Importar
import { Compras } from "./pages/Compras";
import { Clientes } from "./pages/Clientes";

// El componente de seguridad
const RutaPrivada = ({ children }: { children: any }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas Protegidas */}
        <Route path="/" element={<RutaPrivada><Dashboard /></RutaPrivada>} />
        
        {/* --- NUEVA RUTA DE PRODUCTOS --- */}
        <Route path="/productos" element={<RutaPrivada><Productos /></RutaPrivada>} />

        {/* --- NUEVA RUTA DE AGREGAR PRODUCTOS--- */}
        <Route path="/productos/nuevo" element={<RutaPrivada><NuevoProducto /></RutaPrivada>} />

        {/* Ruta para CREAR (Vacía) */}
        <Route path="/productos/nuevo" element={<RutaPrivada><NuevoProducto /></RutaPrivada>} />

        {/* Ruta para EDITAR (Con ID variable) */}
        <Route path="/productos/editar/:id" element={<RutaPrivada><NuevoProducto /></RutaPrivada>} />

        {/* NUEVA RUTA DE STOCK */}
        <Route path="/stock/actualizar/:id" element={<RutaPrivada><ActualizarStock /></RutaPrivada>} />

        {/* Ruta Intermedia: Buscar para ajustar */}
        <Route path="/stock/seleccion" element={<RutaPrivada><SeleccionarProducto /></RutaPrivada>} />

        <Route path="/venta" element={<RutaPrivada><Venta /></RutaPrivada>} />

        {/* Ruta de Historial */}
        <Route path="/ventas/historial" element={<RutaPrivada><ReporteVentas /></RutaPrivada>} />

        <Route path="/usuarios" element={<RutaPrivada><Usuarios /></RutaPrivada>} />

        <Route path="/compras" element={<RutaPrivada><Compras /></RutaPrivada>} />

        <Route path="/clientes" element={<RutaPrivada><Clientes /></RutaPrivada>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;