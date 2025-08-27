"use client"
import { useEffect, useRef, useState } from "react";
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FilePlus2, FileText, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DisplayFile from "@/components/DisplayFile";

export default function Home() {

  const [file, setFile] = useState<File | null>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null)
  const [showUrl, setShowUrl] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragCounter, setDragCounter] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if(!selectedFile) return;
    setFile(selectedFile);
  }

  async function handleUploadButtonClick(){
    if (!file) return;

    if((file.size / 1024 / 1024) > 100){
      alert("Max Limit is 100MB because 1GB is all vercel blob is granting in free tier :(");
      return;
    }

    setIsLoading(true);

    const newBlob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: '/api/upload',
    });

    console.log(newBlob);

    setBlob(newBlob);
    
    setIsLoading(false);
    setShowUrl(true);
  }

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
    if(droppedFile && !showUrl) {
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
      {(isDragging && !showUrl) && 
        <div className="fixed inset-0 z-[9999] bg-foreground/70 pointer-events-none flex justify-center text-3xl text-card/70 " />
      }

      {showUrl ||
        <div  
          className={`flex justify-center items-center min-h-screen bg-background`}
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
              {showUrl || 
                <div className="flex justify-center">
                  <Button 
                    onClick={handleChooseButtonClick}
                    className="bg-zinc-700 cursor-pointer rounded-none"
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
              }
              {file && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <FileText className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
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
      }

      {showUrl && <DisplayFile blob={blob}/>}

    </div>
  );
}
