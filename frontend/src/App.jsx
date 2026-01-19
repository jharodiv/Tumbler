import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import AssetList from "./assets/AssetList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/assets" element={<AssetList/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
