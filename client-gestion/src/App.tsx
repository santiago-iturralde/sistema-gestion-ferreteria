import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";

// Corrección: Usamos 'any' o 'React.ReactElement' para evitar líos con TypeScript ahora mismo
const RutaPrivada = ({ children }: { children: any }) => {
  const token = localStorage.getItem("token");
  // Si hay token, mostramos el hijo (Dashboard). Si no, mandamos al Login.
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública: Login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida: Dashboard */}
        <Route
          path="/"
          element={
            <RutaPrivada>
              <Dashboard />
            </RutaPrivada>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;