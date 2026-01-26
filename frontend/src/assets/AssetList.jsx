import { useEffect, useState } from "react";
import api from "../api/axios";
import AssetCreate from "../assets/AssetCreate";


function AssetList()
{
    const [assets, setAssets] = useState([]);

    const loadAssets = () =>
    {
        api.get("assets/")
            .then((res) => {
                console.log("Assets from backend", res.data);
                setAssets(res.data);
            })
            .catch((err) => {
                console.error(err);
                alert("Unauthorized or failed to load assets");
            });
    };

    useEffect(() => {
        loadAssets();
    }, []);

    return (
        <>
        <AssetCreate onCreated={loadAssets} />
        <ul>
            {assets.map((asset) => (
            <li key={asset.id}>{asset.name}</li>
            ))}
        </ul>
        </>
    );
}


export default AssetList;