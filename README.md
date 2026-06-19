# File Share 🚀

A fast, simple, and elegant file sharing web application built with modern web technologies. This application allows users to upload files, generate shareable links with short URLs and QR codes, and automatically cleans up expired files.

## Features ✨

- **Drag and Drop Uploads**: Intuitive file uploading interface.
- **Up to 100MB Files**: Easily share large files up to 100 megabytes.
- **Short Links**: Automatically generates a unique, shortened URL for each uploaded file.
- **Auto-Cleanup**: Automatically removes files after they expire, optimizing storage.
- **Modern UI**: Styled with Tailwind CSS v4 and Framer Motion for beautiful interactions.
- **Progress Tracking**: Real-time upload progress with the ability to cancel an ongoing upload.

## Tech Stack 🛠️

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router and React 19.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) components, and [Lucide React](https://lucide.dev/) icons.
- **Animations**: [Framer Motion](https://motion.dev/).
- **Database**: [Neon Postgres (Serverless)](https://neon.tech/) managed via [Prisma ORM](https://www.prisma.io/).
- **Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) for efficient and fast file hosting.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand).
- **Utilities**: `axios`, `nanoid`, `qrcode.react`.

## Getting Started 💻

### Prerequisites

- Node.js (v20+ recommended)
- `pnpm` (The project uses `pnpm` based on the lockfile)
- A Neon database URL
- Vercel Blob access

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/zxsharp/file-share.git
   cd file-share
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` (or modify the existing `.env`) file in the root of the project with the necessary keys:
   ```env
   DATABASE_URL="postgresql://user:password@hostname/db_name?sslmode=require"
   BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
   ```

4. **Initialize Database:**
   Generate the Prisma client and push the schema to your Neon database:
   ```bash
   pnpm dlx prisma db push
   ```

5. **Start the Development Server:**
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture 🏗️

- `src/app/page.tsx`: Main upload interface handling drag & drop and blob uploads.
- `src/app/api/upload`: API route for securely generating upload URLs for Vercel Blob.
- `src/app/api/shorten`: API route for persisting file metadata and generating short IDs using Prisma.
- `src/app/api/cleanup`: Background API/service to purge expired files and reclaim Blob storage.
- `src/app/[id]`: Dynamic route mapping a short ID back to a file for downloading.
- `src/services/cleanup.ts`: Core logic for identifying and destroying expired records and blobs.

## License 📄

This project is open-source and available under the [MIT License](LICENSE).
