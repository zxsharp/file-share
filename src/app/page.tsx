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
      className="min-h-screen"
    >

      {/* show top level background when dragging */}
      {(isDragging) && 
        <div className="fixed inset-0 z-[9999] bg-foreground/70 pointer-events-none flex justify-center text-3xl text-card/70 " />
      }

      
      <div  
        className={`px-2 flex justify-center items-center min-h-screen bg-background`}
      >
        <Card
          className="w-full max-w-lg bg-card border-dashed border-4">
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <FilePlus2 className="size-20"/>
            </div>
            <CardTitle>Drop your file here</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            
            <div className="flex justify-center">
              <Button 
                onClick={handleChooseButtonClick}
                className="bg-primary cursor-pointer rounded-none"
              >
                <File /> Choose File
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
              <>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                  </div>
                </div>
                <div className="text-red-400 font-medium">
                      {((file.size / 1024 / 1024) > 100) && "File size is over 100MB"}
                </div>
              </>
            )}

            {isLoading && (
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-1 items-center">
                  <Progress
                  className="h-4"
                  value={uploadProgress}
                  />
                  <Button 
                  className="rounded-full text-foreground bg-ring/10 hover:bg-ring/20 cursor-pointer"
                  onClick={cancelUploadRequest}
                  >
                    <X />
                  </Button>
                </div>
                <div className="flex justify-center text-primary">
                  {uploadProgress} % ...
                </div>
              </div> 
            )} 
              
            <Button
              disabled={!file || isLoading}
              onClick={handleUploadButtonClick}
              className="w-full cursor-pointer"
            >
              {isLoading ? 'Uploading...': 'Upload'}
            </Button>
          </CardContent>
        </Card>
        
      </div>
      
    </div>
  );
}
