"use client"
import { useEffect, useRef, useState } from "react";
import { upload } from '@vercel/blob/client';
import { BlobRequestAbortedError } from '@vercel/blob'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FilePlus2, FileText, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { motion } from "framer-motion";

export default function Home() {

  const router = useRouter();

  const shortId = useStore((state) => state.shortId);
  const blob = useStore((state) => state.blob);

  const setShortId = useStore((state) => state.setShortId);
  const setBlob = useStore((state) => state.setBlob);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragCounter, setDragCounter] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const abortRef = useRef<AbortController | null>(null);
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if(!selectedFile) return;
    setFile(selectedFile);
  }

  async function handleUploadButtonClick(){
    if (!file) return;

    // not so strict client side check (can be easily bypassed)
    if((file.size / 1024 / 1024) > 100){
      setFile(null);
      alert("Max Limit is 100MB, try compressing the file :(");
      return;
    }

    // cleanup if there's already any request
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);

    let newBlob;
    try{
      newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        onUploadProgress: (progressEvent) => {
          if(abortRef.current === controller){
            setUploadProgress(progressEvent.percentage)
          }
        },
        abortSignal: controller.signal,
        clientPayload: (file.size / 1024 / 1024).toString()
      });
    }
    catch(err){
      if (err instanceof BlobRequestAbortedError) {
        // Handle abort
          setIsLoading(false);
          setUploadProgress(0);
          alert("Upload canceled");
          return;
      }
    }

    if(!newBlob){
      alert("unable to upload :(");
      setIsLoading(false);
      setUploadProgress(0);
      return;
    }

    try {
      const res = await axios.post("/api/shorten", { 
        blob: newBlob,
        fileSize: (file.size / 1024 / 1024),
        fileName: file.name
      });
      if(!res.data.shortId){
        throw new Error("unable to provide short url");
      }
      setShortId(res.data.shortId);
    } 
    catch (error) {
      console.error("Failed to shorten URL");
    }

    setBlob(newBlob);
    setIsLoading(false);
  }

  const cancelUploadRequest = () => {
    abortRef.current?.abort();
    setIsLoading(false);
    setUploadProgress(0);
  }

  // routing to /uploaded
  useEffect(() => {
    if(blob){
      router.push("/uploaded");
    }
  }, [shortId, blob])

  function handleChooseButtonClick() {
    if (hiddenFileInput.current) {
      (hiddenFileInput.current as HTMLInputElement).click();
    }
  }

  useEffect(() => {
    const preventDefault = (e: DragEvent) => {
      e.preventDefault();
    };

    // Prevent default drag behaviors on document
    document.addEventListener('dragenter', preventDefault);
    document.addEventListener('dragover', preventDefault);
    document.addEventListener('dragleave', preventDefault);
    document.addEventListener('drop', preventDefault);

    return () => {
      document.removeEventListener('dragenter', preventDefault);
      document.removeEventListener('dragover', preventDefault);
      document.removeEventListener('dragleave', preventDefault);
      document.removeEventListener('drop', preventDefault);
    };
  }, []);

  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    setIsDragging(false);
    setDragCounter(0);

    const droppedFile = e.dataTransfer.files?.[0];
    if(droppedFile) {
      setFile(droppedFile);
    }
  }

  function handleDragEnter() {
    setDragCounter(dragCounter + 1);
    setIsDragging(true);
  }

  function handleDragLeave() {
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragging(false);
      }
      return newCounter;
    });
  }


  return (
    <div 
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className="min-h-screen flex flex-col bg-background"
    >
      <Navbar />

      {/* show top level background when dragging */}
      {(isDragging) && 
        <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm pointer-events-none flex justify-center items-center text-4xl font-extrabold text-primary transition-all duration-300">
          Drop file to upload
        </div>
      }

      <Hero />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        className="px-4 pb-20 flex justify-center items-start flex-1 -mt-10 relative z-20 w-full"
      >
        <Card
          className="w-full max-w-xl backdrop-blur-xl border-dashed border-2 border-primary/20 shadow-2xl hover:shadow-[0_0_40px_rgba(var(--primary),0.3)] transition-all duration-500 rounded-2xl bg-card/60 relative overflow-hidden group"
        >
          {/* Central radial glow similar to grid bg */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-primary/30 opacity-0 group-hover:opacity-40 blur-[80px] transition-opacity duration-500 pointer-events-none" />
          <CardHeader className="text-center pb-2 pt-4 relative z-10">
            <div className="flex justify-center mb-2 text-primary transition-transform duration-500 group-hover:scale-110 drop-shadow-md">
              <FilePlus2 className="size-12 opacity-80 transition-transform duration-300 hover:rotate-12"/>
            </div>
            <CardTitle className="text-xl font-bold">Upload a File</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">Drag and drop or choose a file to upload</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-2 relative z-10">
            
            <div className="flex justify-center">
              <Button 
                onClick={handleChooseButtonClick}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 cursor-pointer rounded-full px-8 transition-all duration-300 group/btn"
              >
                <File className="mr-2 h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-1 group-hover/btn:scale-110" /> Choose File
              </Button>
              <Input 
                type="file"
                name="img"
                ref={hiddenFileInput}
                onChange={handleFileChange}
                className="hidden"
              />
              
            </div>
            
            {file && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border transition-all hover:bg-muted/80 hover:border-primary/30 group/file">
                  <div className="p-2 bg-primary/10 rounded-lg transition-transform duration-300 group-hover/file:scale-110 group-hover/file:rotate-6">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                  </div>
                </div>
                <div className="text-red-400 font-medium text-sm mt-2 px-1">
                      {((file.size / 1024 / 1024) > 100) && "File size is over 100MB"}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col gap-2 p-4 bg-muted/30 rounded-xl border animate-in fade-in">
                <div className="flex gap-3 items-center">
                  <Progress
                    className="h-2 flex-1"
                    value={uploadProgress}
                  />
                  <Button 
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    onClick={cancelUploadRequest}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground px-1">
                  <span>Uploading...</span>
                  <span className="font-medium text-primary">{Math.round(uploadProgress)}%</span>
                </div>
              </div> 
            )} 
              
            <Button
              disabled={!file || isLoading || ((file?.size ?? 0) / 1024 / 1024 > 100)}
              onClick={handleUploadButtonClick}
              className="w-full cursor-pointer h-12 text-base font-semibold shadow-xl shadow-primary/20 transition-all rounded-xl hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              {isLoading ? 'Processing...': 'Upload Now'}
            </Button>
          </CardContent>
        </Card>
        
      </motion.div>
      
    </div>
  );
}
