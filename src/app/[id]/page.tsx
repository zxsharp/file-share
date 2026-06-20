import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { findUrlEntry } from '@/db/findUrlEntry';
import { ExternalLink, FileText, Download, AlertCircle } from 'lucide-react';
import { Navbar } from "@/components/navbar";
import { GridPattern } from "@/components/grid-pattern";

type PropsType = {
  params: Promise<{id: string}>
}

export default async function IdPage({ params }: PropsType) {
  
  const {id} = await params;
  
  // direct db call, no api route needed as this will run on Server
  const entry = await findUrlEntry(id); 
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <GridPattern className="flex-1 flex flex-col pt-32 pb-20 px-4">
        {entry ? (
          <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto gap-6 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
            <div className="flex flex-col items-center text-center space-y-3 mb-2">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-2 shadow-inner">
                    <FileText className="w-8 h-8" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Ready to Download</h1>
                <p className="text-muted-foreground text-lg">Your file is ready. Click the button below to start.</p>
            </div>

            <Card className="w-full backdrop-blur-xl border-dashed border-2 border-primary/20 shadow-2xl hover:shadow-[0_0_40px_rgba(var(--primary),0.3)] transition-all duration-500 rounded-2xl bg-card/60 relative overflow-hidden group">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-primary/30 opacity-0 group-hover:opacity-40 blur-[80px] transition-opacity duration-500 pointer-events-none" />
                
                <CardHeader className="text-center pb-2 pt-6 relative z-10">
                    <CardTitle className="text-xl font-semibold">File Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-2 pb-6 relative z-10">
                    <div className="flex flex-col p-5 bg-muted/50 rounded-xl border border-border/50 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-muted-foreground">Name:</span>
                            <a 
                                className='flex items-center gap-1.5 text-primary font-semibold hover:text-blue-500 transition-colors text-right break-all'
                                href={`${entry.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {entry.fileName}
                                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                            </a>
                        </div>
                        <div className="h-px w-full bg-border/80" />
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-muted-foreground">Size:</span>
                            <span className="text-sm font-semibold">{entry.fileSize.toFixed(2)} MB</span>
                        </div>
                    </div>

                    <Button
                        asChild
                        className="w-full h-12 text-base font-semibold shadow-xl shadow-primary/20 transition-all rounded-xl hover:shadow-primary/40 hover:-translate-y-0.5 group/btn"
                    >
                        <a href={`${entry.downloadUrl}`}>
                            <Download className="mr-2 h-5 w-5 transition-transform group-hover/btn:-translate-y-1" />
                            Download File
                        </a>
                    </Button>
                </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto gap-4 relative z-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center text-destructive mb-2">
                <AlertCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">File Not Found</h1>
            <p className="text-muted-foreground text-center">The file you are looking for does not exist or has been deleted.</p>
            <Button asChild className="mt-4 rounded-xl px-8" variant="outline">
                <a href="/">Return Home</a>
            </Button>
          </div>
        )}
      </GridPattern>
    </div>
  );
}