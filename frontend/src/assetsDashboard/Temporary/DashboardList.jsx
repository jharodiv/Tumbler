import { useState, useEffect } from "react";
import { getAssets, deleteAsset } from "../assetServices";
import { jwtDecode } from "jwt-decode";
import AssetView from "./AssetView";

export default function DashboardList({ onEdit }) {
    const [assets,   setAssets]   = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);
    const [search,   setSearch]   = useState("");
    const [filter,   setFilter]   = useState("all");
    const [selected, setSelected] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const token = localStorage.getItem("access_token");
    const user = token ? jwtDecode(token):null;

    useEffect(() => {
        getAssets()
        .then((res) => setAssets(res.data))
        .catch((err) => setError(err.response?.data?.message ?? err.message))
        .finally(() => setLoading(false));
    }, []);

    const visible = assets.filter((a) => {
        if (!user) return false;

        if(!user.is_staff && user.is_admin){
            if(filter !== "all" && a.status !== filter) return false;

            const q = search.toLowerCase();
            if (q && !a.name?.toLowerCase().includes(q) && !a.asset_tag?.toLowerCase().includes(q)) return false;
            return true
        }

        return false; //Non admin users shows nothing "FOR NOW" 
        // Will add logic for normal users later on
    });

    async function handleDelete(id) {
        setDeleting(id);
        try {
        await deleteAsset(id);
        setAssets((prev) => prev.filter((a) => a.id !== id));
        if (selected?.id === id) setSelected(null);
        } catch (err) {
        alert(err.response?.data?.message ?? "Delete failed");
        } finally {
        setDeleting(null);
        }
    }

    return(
        <AssetView
            user={user}
            onEdit={onEdit}
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
            handleDelete={handleDelete}
            visible={visible}
        ></AssetView>
    );
}