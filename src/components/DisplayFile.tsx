import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link2 } from 'lucide-react';
import { type PutBlobResult } from "@vercel/blob"
import {QRCodeCanvas} from 'qrcode.react'
import Link from 'next/link'

type PropsType = {
    blob: PutBlobResult,
    shortId: string
}

export default function DisplayFile({blob, shortId}: PropsType) {
    return <div className="min-h-screen">
        <div className="flex flex-col justify-center items-center min-h-screen bg-background gap-4">
            <Card>
                <CardContent className="space-y-5">
                    <div>
                        <Link href={`/${shortId}`} className="flex items-center gap-2 text-blue-400">
                            <Link2 />
                            {shortId}
                        </Link>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardTitle>url</CardTitle>
                <CardContent>
                    <QRCodeCanvas value={blob.url} size={200} />
                </CardContent>
            </Card>
            <Card>
                <CardTitle>Download url</CardTitle>
                <CardContent>
                    <QRCodeCanvas value={blob.downloadUrl} size={200} />
                </CardContent>
            </Card>
        </div>
    </div>
}