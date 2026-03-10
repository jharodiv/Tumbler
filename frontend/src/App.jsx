import { BrowserRouter, Routes, Route } from "react-router-dom";
import {ROUTE} from "./route";
import Login from "./auth/Login";
import ProtectedRoute from "./auth/protectedRoute";
import Registration from "./auth/registration";
import Dashboard from "./assetsDashboard/Temporary/DashboardList";
import EditPage from "./assetsDashboard/Temporary/EditPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE.login} element={<Login />} />
        <Route path={ROUTE.registration} element={<Registration />} />
        <Route path={ROUTE.editAssets} element={<EditPage />}></Route>
        <Route
          path={ROUTE.dashboard}
          element={
            <ProtectedRoute>
              <Dashboard></Dashboard>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
