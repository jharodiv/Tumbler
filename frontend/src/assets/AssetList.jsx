import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import AssetCreate from "../assets/AssetCreate";
import { AuthContext } from "../auth/authContext";


function AssetList()
{
    const [assets, setAssets] = useState([]);
    const { accessToken } = useContext(AuthContext);

    const loadAssets = async () =>{
        try{
            const res = await api.get("/assets/");
            setAssets(res.data);
        } catch (err){
            console.error(err);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("access");
        if(token){
            loadAssets(); //Only Runs when token exist
        }
    }, [accessToken]);

        return (
            <>
                <AssetCreate onCreated={loadAssets} />
                <ul>
                    {assets.length === 0 ? <li>No assets yet</li> :
                    assets.map((asset) => <li key={asset.id}>{asset.name}</li>)}
                </ul>
            </>
        );
}


export default AssetList;