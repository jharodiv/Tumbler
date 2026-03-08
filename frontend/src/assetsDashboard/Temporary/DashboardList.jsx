import { useState, useEffect, useContext } from "react";
import { getAssets } from "../assetServices";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../auth/authContext";
import { ROUTE } from "../../route";
import AssetView from "./AssetView";
import { useNavigate } from "react-router-dom";

export default function DashboardList({ onEdit }) {
    const [assets,   setAssets]   = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);
    const [search,   setSearch]   = useState("");
    const [filter,   setFilter]   = useState("all");
    const [selected, setSelected] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const  { logoutUser } = useContext(AuthContext);

    const token = localStorage.getItem("access");
    const user  = token ? jwtDecode(token) : null;

    const navigate = useNavigate();

    useEffect(() => {
        getAssets()
            .then((res) => setAssets(res.data))
            .catch((err) => setError(err.response?.data?.message ?? err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = () => {
        logoutUser();   
    };

    const visible = assets.filter((a) => {
        if (!user) return false;
        if (filter !== "all" && a.status !== filter) return false;
        const q = search.toLowerCase();
        if (q && !a.name?.toLowerCase().includes(q) && !a.asset_tag?.toLowerCase().includes(q)) return false;
        return true;
    });

    const handleEdit = (asset) =>{
        navigate(ROUTE.editAssets(asset.id));
    }

    return (
            <AssetView
                user={user}
                onEdit={handleEdit}
                onLogout={handleLogout}
                assets={assets}
                loading={loading}
                error={error}
                search={search}
                setSearch={setSearch}
                filter={filter}
                setFilter={setFilter}
                selected={selected}
                setSelected={setSelected}
                deleting={deleting}
                visible={visible}
            />  
    );
}