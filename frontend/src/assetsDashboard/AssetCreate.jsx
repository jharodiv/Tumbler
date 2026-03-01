import { useState } from "react";
import { createAsset } from "./assetServices";
import styles from "./AssetsList.module.css";

function AssetCreate( {onCreated} ){
    const [name, setName] = useState ("");
    const [assetTag, setAssetTag] = useState("");
    const [status, setStatus] = useState("available");

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            await createAsset({
            name,
            asset_tag: assetTag,
            status
        });
        setName("");
        onCreated()

        } catch (error){
            console.error("400 details", error.response?.data);
        }
    };

    return (
        <div className={styles.container}>
        {/* Create Asset */}
        <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Create Asset</h2>
            <form onSubmit={handleSubmit}>
            <input
                className={styles.input}
                placeholder="Asset Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className={styles.input}
                placeholder="Asset Tag"
                value={assetTag}
                onChange={(e) => setAssetTag(e.target.value)}
            />
            <select name="Asset Availability" 
            value={status}
            onChange={(e) => setStatus(e.target.value)}>
                <option value="available"> Available </option>
                <option value="assigned">Assigned</option>
            </select>
            <button className={styles.button} type="submit">
                Create Asset
            </button>
            </form>
        </div>
        </div>
    );
}

export default AssetCreate;