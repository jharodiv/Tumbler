import { useState } from "react";
import { createAsset } from "./assetServices";

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
        <form onSubmit={handleSubmit}>
            <input placeholder="Asset Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
            />
            <input placeholder="Asset Tag" value={assetTag} onChange={e => setAssetTag(e.target.value)}/>
            <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
            </select>
            <button>Create</button>
        </form>
    );
}

export default AssetCreate;