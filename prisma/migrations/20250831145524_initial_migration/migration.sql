-- CreateTable
CREATE TABLE "public"."Url" (
    "id" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Url_fileUrl_key" ON "public"."Url"("fileUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Url_downloadUrl_key" ON "public"."Url"("downloadUrl");
