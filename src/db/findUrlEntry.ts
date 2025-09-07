import { prisma } from '@/lib/prisma';

export async function findUrlEntry(id: string) {
    try {
        const entry = await prisma.url.findUnique({
            where: {
                id
            }
        })

        return entry;
    }
    catch(err){
        console.log(err);
        return null;
    }
}