import { createUrlEntry } from "@/db/createUrlEntry";
import { del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const {blob, fileName, fileSize} = await request.json();
    let shortId;

    try{
        const entry = await createUrlEntry(blob, fileSize, fileName);
        shortId = entry!.id;
    }
    catch(err){
        console.log(err);
        // deleting blob if unable to create it's entry in postgres
        await del(blob.url);
    }

    if(!shortId){
        return NextResponse.json({shortId: null})
    }

    return NextResponse.json({shortId})
}

