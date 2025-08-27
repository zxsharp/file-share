import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {QRCodeCanvas} from 'qrcode.react'

export default function DisplayFile({blob}: any) {
    return <div className="min-h-screen">
        <div className="flex flex-col justify-center items-center min-h-screen bg-background gap-4">
            <Card>
                <CardContent className="space-y-5">
                    <div>url - {blob.url}</div>
                    <div>download url - {blob.download}</div>
                    <div>file - {blob.pathname}</div>
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