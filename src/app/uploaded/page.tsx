"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { Link2, ScanQrCode, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { GridPattern } from "@/components/grid-pattern";
import { motion } from "framer-motion";

export default function Uploaded() {
    const router = useRouter();

    const shortId = useStore((state) => state.shortId);
    const blob = useStore((state) => state.blob);
    const setBlob = useStore((state) => state.setBlob);

    useEffect(() => {
        if(!blob){
            router.replace('/');
        }
    }, [blob, router]);

    if(!blob){
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <GridPattern className="flex-1 flex flex-col pt-32 pb-20 px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center w-full max-w-xl mx-auto gap-6 relative z-10"
                >
                    <div className="flex flex-col items-center text-center space-y-3 mb-2">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-2 shadow-inner">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Upload Successful</h1>
                        <p className="text-muted-foreground text-lg">Your file is securely stored and ready to share.</p>
                    </div>

                    <Card className="w-full backdrop-blur-xl border-dashed border-2 border-primary/20 shadow-2xl hover:shadow-[0_0_40px_rgba(var(--primary),0.3)] transition-all duration-500 rounded-2xl bg-card/60 relative overflow-hidden group">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-primary/30 opacity-0 group-hover:opacity-40 blur-[80px] transition-opacity duration-500 pointer-events-none" />
                        
                        <CardHeader className="text-center pb-2 pt-6 relative z-10">
                            <CardTitle className="text-xl font-semibold">Share Link</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-2 pb-6 relative z-10">
                            {shortId && (
                                <div className="flex justify-center">
                                    <Link 
                                        className="flex items-center gap-2 text-primary font-semibold hover:text-blue-500 bg-primary/10 hover:bg-primary/20 px-5 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                                        href={`/${shortId}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        <Link2 className="w-5 h-5" />
                                        /{shortId}
                                    </Link>
                                </div>
                            )}

                            <div className="flex flex-col items-center justify-center p-6 bg-background/50 rounded-xl border border-border/50 space-y-4">
                                <CardDescription className="flex items-center text-base gap-2 font-medium text-foreground/80">
                                    <ScanQrCode className="w-5 h-5 text-primary" /> Scan to Download
                                </CardDescription>
                                <div className="p-3 bg-white rounded-2xl shadow-sm border">
                                    <QRCodeCanvas value={blob.downloadUrl} size={160} />
                                </div>
                            </div>

                            <Button 
                                variant="outline"
                                className="w-full h-12 rounded-xl transition-all hover:bg-muted/50 group/btn border-2"
                                onClick={() => {
                                    setBlob(null);
                                    router.push('/');
                                }}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover/btn:-translate-x-1" />
                                Upload Another File
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </GridPattern>
        </div>
    );
}