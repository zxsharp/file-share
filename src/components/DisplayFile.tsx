import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type PutBlobResult } from "@vercel/blob"
import {QRCodeCanvas} from 'qrcode.react'

export default function DisplayFile({ url, downloadUrl, pathname }: PutBlobResult) {
    return <div className="min-h-screen">
        <div className="flex flex-col justify-center items-center min-h-screen bg-background gap-4">
            <Card>
                <CardContent className="space-y-5">
                    <div>url - {url}</div>
                    <div>download url - {downloadUrl}</div>
                    <div>file - {pathname}</div>
                </CardContent>
            </Card>
            <Card>
                <CardTitle>url</CardTitle>
                <CardContent>
                    <QRCodeCanvas value={url} size={200} />
                </CardContent>
            </Card>
            <Card>
                <CardTitle>Download url</CardTitle>
                <CardContent>
                    <QRCodeCanvas value={downloadUrl} size={200} />
                </CardContent>
            </Card>
        </div>
    </div>
}