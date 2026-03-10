import { useState, useEffect } from "react";
import { updateAsset } from "../assetServices";
import AssetEdit from "./AssetEdit";
import { ROUTE } from "../../route";
import { useParams, useNavigate } from "react-router-dom";

export default function EditPage(){
    const { id } = useParams();
    const navigate = useNavigate();

    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        getAssets(id)
            .then((res) => setAsset(res.data))
            .catch((err) => setError (err.response?.data?.message ?? err.message))
            .finally(() => setLoading(err))
    }, [id]);

    const handleSave = async (form) => {
        await updateAsset(id,form);
        navigate(ROUTE.dashboard);
    };

    const handleCancel = () =>{
        navigate(ROUTE.dashboard);
    };

    return (
        <AssetEdit
        asset={asset}
        onSave={handleSave}
        onCancel={handleCancel}
        />
    );
}