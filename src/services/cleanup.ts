import { prisma } from '@/lib/prisma'
import { del } from '@vercel/blob'

export async function cleanupExpiredFiles() {

  const now = new Date();
  let expired;

  try{
    expired = await prisma.url.findMany({
        where: {
        expire: {
            lte: now,
        },
        },
        select: {
            id: true,
            fileUrl: true
        }
    })
  }
  catch(err){
    console.log("unable to find any expired files", err);
    return null;
  }

  for (const file of expired) {
    try {
      
      // this won't throw error
      await del(file.fileUrl) 

      await prisma.url.delete({ 
        where: { 
            id: file.id 
        } 
      }) 
      console.log(`Deleted file: ${file.fileUrl}`)
    } catch (err) {
      console.log(`Failed to delete ${file.fileUrl}:`, err);
      return null;
    }
  }

  return expired.length;
}