import { useEffect, useState } from "react";
import api from "../api/axios";


function AssetList()
{
    const [assets, setAssets] = useState([]);

    useEffect(() =>
    {
        api.get("assets/")
            .then((res) => setAssets(res.data))
            .catch(() => alert("Unauthorized"));
    }, []);

    return (
        <ul>
        {assets.map((asset) => (
            <li key={asset.id}>{asset.name}</li>
        ))}
        </ul>
    );
}


export default AssetList;