import { useState } from "react";
import { createAsset } from "./assetServices";

function AssetCreate( {onCreated} ){
    const [name, setName] = useState ("");

    const handleSubmit = async (e) =>{
        e.preventDefault();
        await createAsset({name});
        setName("");
        onCreated()
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Asset Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
            />
            <button>Create</button>
        </form>
    );
}

export default AssetCreate;