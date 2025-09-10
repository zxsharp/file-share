"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { Link2, ScanQrCode } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect } from "react";

export default function Uploaded() {
    const router = useRouter();

    const shortId = useStore((state) => state.shortId);
    const blob = useStore((state) => state.blob);
    const setBlob = useStore((state) => state.setBlob);

    useEffect(() => {
        if(!blob){
            router.replace('/');
        }
    }, [blob]);

    if(!blob){
        return null;
    }

    return <div className="min-h-screen">
        <div className="flex flex-col justify-center items-center min-h-screen bg-background gap-4">
            <Button onClick={() => {
                setBlob(null);
                router.push('/')
            }}>
                Back
            </Button>
            {(shortId) &&
                <Card>
                    <CardContent className="space-y-5">
                        <div>
                            <Link 
                            className="flex items-center gap-2 text-blue-400 hover:underline"
                            href={`/${shortId}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                                <Link2 />
                                /{shortId}
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            }
            <Card>
                <CardHeader>
                    <CardDescription className="flex text-lg gap-1.5">
                        Scan <ScanQrCode /> to Download
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <QRCodeCanvas value={blob!.downloadUrl} size={200} />
                </CardContent>
            </Card>
        </div>
    </div>
}