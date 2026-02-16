import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import AssetList from "./assets/AssetList";
import ProtectedRoute from "./auth/protectedRoute";
import Registration from "./auth/registration";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <AssetList></AssetList>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
