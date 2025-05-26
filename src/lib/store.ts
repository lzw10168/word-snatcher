import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WordState {
  words: string[]
  addWord: (word: string) => void
  removeWord: (word: string) => void
  platform: "shanbay" | "bbdc" | "momo" | "baicizhan" | null
  setPlatform: (
    platform: "shanbay" | "bbdc" | "momo" | "baicizhan" | null
  ) => void
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
}

export const useStore = create<WordState>()(
  persist(
    (set) => ({
      words: [],
      addWord: (word) => set((state) => ({ words: [...state.words, word] })),
      removeWord: (word) =>
        set((state) => ({ words: state.words.filter((w) => w !== word) })),
      platform: "bbdc",
      setPlatform: (platform) => set({ platform }),
      theme: "light",
      setTheme: (theme) => set({ theme })
    }),
    {
      name: "word-snatcher-storage"
    }
  )
)
