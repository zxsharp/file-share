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

  if(expired.length === 0){
    return 0;
  }

  const ids = expired.map(file => file.id);
  const fileUrls = expired.map(file => file.fileUrl);

  try{
      // this won't throw error
      await del(fileUrls);

      await prisma.url.deleteMany({ 
        where: { 
            id: {
              in: ids
            }
        } 
      }) 
  }
  catch(err) {
    console.log("failed to delete", err);
    console.log(expired);
    return null;
  }

  return expired.length;
}