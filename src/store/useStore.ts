import { PutBlobResult } from "@vercel/blob";
import { create } from "zustand";

export interface StoreInterface {
  shortId: string;
  blob: PutBlobResult | null;
  setShortId: (shortId: string) => void;
  setBlob: (blob: PutBlobResult | null) => void;
  reset: () => void;
}

export const useStore = create<StoreInterface>((set) => ({
  shortId: "",
  blob: null,
  setShortId: (shortId: string) => set({ shortId }),
  setBlob: (blob: PutBlobResult | null) => set({ blob }),
  reset: () => set({ shortId: "", blob: null }),
}));
