import { prisma } from '@/lib/prisma';
import { PutBlobResult } from '@vercel/blob';
import { customAlphabet } from 'nanoid';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

export async function createUrlEntry(blob: PutBlobResult, maxRetries = 5){
    
    for(let attempt = 0; attempt <= maxRetries; attempt++){
        const id = nanoid();
        try {
            await prisma.url.create({
                data: {
                id: id,
                fileUrl: blob.url,
                downloadUrl: blob.downloadUrl,
                expire: new Date(Date.now() + 60 * 60 * 1000) // expires in 1 hour
                }
            })

            // return if entry created successfully otherwise loop continues
            return; 
        }
        catch (err) {
        // Only handle known unique constraint violations
            if (
                err instanceof PrismaClientKnownRequestError &&
                err.code === 'P2002'
            ) {
                const target = (err.meta?.target as string[]) ?? [];
                // If collision is on id, retry with new id
                if (target.includes('id')) {
                    if (attempt === maxRetries){
                        throw new Error('Could not generate unique id after retries');
                    }
                    continue;
                }
            }
            // Any other error: rethrow error
            throw err;
        }
    }
}