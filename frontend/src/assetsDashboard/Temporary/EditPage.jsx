    import { useState, useEffect } from "react";
    import { updateAsset, getAssets } from "../assetServices";
    import AssetEdit from "./AssetEdit";
    import { ROUTE } from "../../route";
    import { useParams, useNavigate } from "react-router-dom";

    export default function EditPage(){
        const { id } = useParams();
        const navigate = useNavigate();

        const [asset,     setAsset]     = useState(null);
        const [loading,   setLoading]   = useState(true);
        const [error,     setError]     = useState(null);
        const [form,      setForm]      = useState(null);
        const [isDirty,   setIsDirty]   = useState(false);
        const [errors,    setErrors]    = useState({});
        const [saveState, setSaveState] = useState("idle")
        useEffect(() =>{
            getAssets(id)
            .then((res) =>{
                const data = res.data;
                setAsset(data);
                setForm({
                    name : data.name,
                    asset_tag : data.asset_tag,
                    status : data.status,
                    owner : data.owner ?? "",
                    assigned_to: data.assigned_to ?? "",
                });
            })
            .catch((err) => setError(err.response?.data?.message ?? err.message))
            .finally(() =>setLoading(false));
        }, [id]);

        const handleSave = async () => {
            const err = validate(form);
            if(Object.keys(err).length) {setErrors(err); return; }
            setSaveState("saving");

            try{
                await updateAsset(id,form);
                navigate(ROUTE.dashboard);
            }
            catch (err){
                setError(err.response?.data?.message ?? err.message);
                setSaveState("idle");
            }
        };

        const handleCancel = () =>{
            if(isDirty && !window.confirm("Discard Unsaved Changes?")) return;
            navigate(ROUTE.dashboard);
        };

        const handleChange = (field) => (e) => {
            setForm((prev) => ({...prev, [field]: e.target.value}));
            setIsDirty(true);
        }

        if (loading) return <div>Loading.....</div>
        if (error) return <div>Error{error}</div>
        if (!asset || !form) return null

        const ownerOption = asset.owners?.map((o) => (
            {
                value: o.id,
                label: o.name
            }
        ))

        const userOption = [
            {
                value: "",
                label: "--Unassigned--"
            },
            ...(asset.users?.map((u) => (
                {
                    value: u.id,
                    label: u.name
                }
            )) ?? []),
        ];

        return (
            <AssetEdit
                asset={asset}
                form={form}                
                errors={errors}             
                isDirty={isDirty}           
                saveState={saveState}       
                onSave={handleSave}
                onCancel={handleCancel}
                ownerOptions={ownerOption}  
                userOptions={userOption}  
                onChange={handleChange}
            />
        );
    }