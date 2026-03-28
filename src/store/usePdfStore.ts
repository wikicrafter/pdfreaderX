import { create } from 'zustand'

interface PdfState {
  file: string | ArrayBuffer | null
  pageNum: number
  numPages: number
  zoom: number
  rotation: number
  isSideBarOpen: boolean
  selectedText: string
  pdfDoc: any | null
  speechRate: number
  speechVoiceName: string | null
  thumbnailCache: Record<number, string>
  isReading: boolean
  searchResults: Array<{ page: number, snippet: string }>
  isSearching: boolean
  maxPageSeen: number
  bookmarks: number[]
  isVoicePanelOpen: boolean
  
  // Actions
  setFile: (file: string | ArrayBuffer | null) => void
  setPdfDoc: (doc: any | null) => void
  setPageNum: (pageNum: number) => void
  setNumPages: (numPages: number) => void
  setZoom: (zoom: number) => void
  setRotation: (rotation: number) => void
  toggleSideBar: () => void
  toggleVoicePanel: () => void
  setSelectedText: (text: string) => void
  setSpeechRate: (rate: number) => void
  setSpeechVoiceName: (name: string | null) => void
  setThumbnail: (page: number, dataUrl: string) => void
  setIsSearching: (isSearching: boolean) => void
  setSearchResults: (results: Array<{ page: number, snippet: string }>) => void
  setIsReading: (isReading: boolean) => void
  updateProgress: (page: number) => void
  toggleBookmark: (page: number) => void
}

export const usePdfStore = create<PdfState>((set) => ({
  file: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  pageNum: 1,
  numPages: 0,
  zoom: 1.0,
  rotation: 0,
  isSideBarOpen: typeof window !== 'undefined' ? window.innerWidth > 1280 : false,
  selectedText: '',
  pdfDoc: null,
  speechRate: 1.0,
  speechVoiceName: null,
  thumbnailCache: {},
  isReading: false,
  searchResults: [],
  isSearching: false,
  maxPageSeen: 1,
  bookmarks: [],
  isVoicePanelOpen: typeof window !== 'undefined' ? window.innerWidth > 1280 : false,

  setFile: (file) => set({ 
    file, 
    pageNum: 1, 
    pdfDoc: null, 
    thumbnailCache: {}, 
    isReading: false, 
    searchResults: [],
    maxPageSeen: 1,
    bookmarks: [],
    isVoicePanelOpen: typeof window !== 'undefined' ? window.innerWidth > 1280 : false
  }),
  setPdfDoc: (pdfDoc) => set({ pdfDoc }),
  setPageNum: (pageNum) => set((state) => {
    const nextPager = Math.max(1, Math.min(pageNum, state.numPages || 1))
    return { 
      pageNum: nextPager,
      maxPageSeen: Math.max(state.maxPageSeen, nextPager)
    }
  }),
  setNumPages: (numPages) => set({ numPages }),
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(zoom, 5.0)) }),
  setRotation: (rotation) => set({ rotation: (rotation % 360 + 360) % 360 }),
  toggleSideBar: () => set((state) => ({ isSideBarOpen: !state.isSideBarOpen })),
  toggleVoicePanel: () => set((state) => ({ isVoicePanelOpen: !state.isVoicePanelOpen })),
  setSelectedText: (selectedText) => set({ selectedText }),
  setSpeechRate: (speechRate) => set({ speechRate }),
  setSpeechVoiceName: (speechVoiceName) => set({ speechVoiceName }),
  setThumbnail: (page, dataUrl) => set((state) => ({
    thumbnailCache: { ...state.thumbnailCache, [page]: dataUrl }
  })),
  setIsSearching: (isSearching) => set({ isSearching }),
  setSearchResults: (searchResults) => set({ searchResults }),
  setIsReading: (isReading) => set({ isReading }),
  updateProgress: (page) => set((state: any) => ({ 
    maxPageSeen: Math.max(state.maxPageSeen, page) 
  })),
  toggleBookmark: (page) => set((state: any) => ({
    bookmarks: state.bookmarks.includes(page)
      ? state.bookmarks.filter((p: number) => p !== page)
      : [...state.bookmarks, page].sort((a: number, b: number) => a - b)
  })),
}))
