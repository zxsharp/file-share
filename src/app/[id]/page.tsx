import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { findUrlEntry } from '@/db/findUrlEntry';
import { Link } from 'lucide-react';

export default async function IdPage({ params }: { params: { id: string } }) {
  // direct db call, no api route needed as this will run on Server
  const entry = await findUrlEntry(params.id); 
  
  return <>
    
    {entry ? 
      (<div className="min-h-screen">
          <div className="flex flex-col justify-center items-center min-h-screen bg-background gap-4">
              <Card>
                  <CardHeader>File Name</CardHeader>
                  <CardContent className="space-y-5 text-blue-400 underline">
                      <a href={`${entry.fileUrl}`}>{entry.fileName}</a>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>File Size</CardHeader>
                  <CardContent className="space-y-5">
                      <div>{entry.fileSize.toFixed(2)} MB</div>
                  </CardContent>
              </Card>
              <Button
              asChild
              >
                <a href={`${entry.downloadUrl}`}>Download</a>
              </Button>
          </div>
      </div>)  
      :
      (<div>Not found</div>)
    }
    
  </>

  
  
}