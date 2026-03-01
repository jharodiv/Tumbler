import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import styles from "./AssetsList.module.css";
import AssetCreate from "./AssetCreate";
import { AuthContext } from "../auth/authContext";


function AssetList()
{
    const [assets, setAssets] = useState([]);
    const { accessToken } = useContext(AuthContext);

    const loadAssets = async () =>{
        try{
            const res = await api.get("/assets/");
            setAssets(res.data.results ?? res.data);
            console.log("Assets: ", assets);
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
            <AssetCreate onCreated={loadAssets}></AssetCreate>
            <div className={styles.assetList}>
                {assets.length == 0? (
                    <p>No assets</p>
                ) : (
                    assets.map(
                        (asset) => (
                            <div key={asset.id} className={styles.assetCard}>
                                <div className={styles.assetName}>{asset.name}</div>
                                <div className={styles.assetInfo}>Tag: {asset.asset_tag}</div>
                                <div className={styles.assetInfo}>Status: {asset.status}</div>
                            </div>
                        )
                    )
                )}
            </div>
            </>
        );
}

export default AssetList;