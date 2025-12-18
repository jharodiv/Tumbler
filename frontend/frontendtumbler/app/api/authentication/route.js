import { NextResponse } from "next/server";

export async function POST(request){
    try{
        const { username, password } = await request.json();


        const res = await fetch("http://127.0.0.1:8000/login/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password}),
        });


        const data = await res.json();


        if (!res.ok)
        {
            return NextResponse.json(
                {
                    details: data.detail || "Login failed"
                },
                {
                    status: res.status
                }
            );
        }
        return NextResponse.json(data);
    }
    catch (err)
    {
        return NextResponse.json(
            {
                details: "Internal server error"
            },
            {
                status: 500
            }
        );
    }
}