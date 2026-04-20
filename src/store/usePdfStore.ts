import { create } from 'zustand'

const STORAGE_KEYS = {
  openAIApiKey: 'pdfreaderX_openAIApiKey',
  googleApiKey: 'pdfreaderX_googleApiKey',
  ttsProvider: 'pdfreaderX_ttsProvider',
  speechRate: 'pdfreaderX_speechRate',
  speechVoiceName: 'pdfreaderX_speechVoiceName',
  bookmarks: 'pdfreaderX_bookmarks',
}

const encryptKey = (key: string): string => {
  if (!key) return ''
  const encoded = btoa(key)
  return 'enc:' + encoded
}

const decryptKey = (encrypted: string): string => {
  if (!encrypted || !encrypted.startsWith('enc:')) return encrypted
  try {
    return atob(encrypted.slice(4))
  } catch {
    return ''
  }
}

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

const saveToStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export const OPENAI_VOICES = [
  { id: 'alloy', name: 'Alloy' },
  { id: 'echo', name: 'Echo' },
  { id: 'fable', name: 'Fable' },
  { id: 'onyx', name: 'Onyx' },
  { id: 'nova', name: 'Nova' },
  { id: 'shimmer', name: 'Shimmer' },
] as const

export const GOOGLE_TTS_VOICES = [
  { id: 'en-US-Standard-A', name: 'Standard A (US)', languageCode: 'en-US', neural: false },
  { id: 'en-US-Standard-B', name: 'Standard B (US)', languageCode: 'en-US', neural: false },
  { id: 'en-US-Standard-C', name: 'Standard C (US)', languageCode: 'en-US', neural: false },
  { id: 'en-US-Standard-D', name: 'Standard D (US)', languageCode: 'en-US', neural: false },
  { id: 'en-US-Standard-E', name: 'Standard E (US)', languageCode: 'en-US', neural: false },
  { id: 'en-US-Standard-F', name: 'Standard F (US)', languageCode: 'en-US', neural: false },
  { id: 'en-US-Standard-G', name: 'Standard G (US)', languageCode: 'en-US', neural: false },
  { id: 'en-US-Standard-H', name: 'Standard H (US)', languageCode: 'en-US', neural: false },
  { id: 'en-US-Standard-I', name: 'Standard I (US)', languageCode: 'en-US', neural: false },
  { id: 'en-US-Standard-J', name: 'Standard J (US)', languageCode: 'en-US', neural: false },
  { id: 'en-US-Neural2-A', name: 'Neural2 A (US)', languageCode: 'en-US', neural: true },
  { id: 'en-US-Neural2-C', name: 'Neural2 C (US)', languageCode: 'en-US', neural: true },
  { id: 'en-US-Neural2-D', name: 'Neural2 D (US)', languageCode: 'en-US', neural: true },
  { id: 'en-US-Neural2-E', name: 'Neural2 E (US)', languageCode: 'en-US', neural: true },
  { id: 'en-US-Neural2-F', name: 'Neural2 F (US)', languageCode: 'en-US', neural: true },
  { id: 'en-US-Neural2-G', name: 'Neural2 G (US)', languageCode: 'en-US', neural: true },
  { id: 'en-US-Neural2-H', name: 'Neural2 H (US)', languageCode: 'en-US', neural: true },
  { id: 'en-US-Neural2-I', name: 'Neural2 I (US)', languageCode: 'en-US', neural: true },
  { id: 'en-US-Neural2-J', name: 'Neural2 J (US)', languageCode: 'en-US', neural: true },
  { id: 'en-GB-Standard-A', name: 'Standard A (UK)', languageCode: 'en-GB', neural: false },
  { id: 'en-GB-Standard-B', name: 'Standard B (UK)', languageCode: 'en-GB', neural: false },
  { id: 'en-GB-Standard-C', name: 'Standard C (UK)', languageCode: 'en-GB', neural: false },
  { id: 'en-GB-Standard-D', name: 'Standard D (UK)', languageCode: 'en-GB', neural: false },
  { id: 'en-GB-Standard-F', name: 'Standard F (UK)', languageCode: 'en-GB', neural: false },
  { id: 'en-GB-Neural2-A', name: 'Neural2 A (UK)', languageCode: 'en-GB', neural: true },
  { id: 'en-GB-Neural2-B', name: 'Neural2 B (UK)', languageCode: 'en-GB', neural: true },
  { id: 'en-GB-Neural2-C', name: 'Neural2 C (UK)', languageCode: 'en-GB', neural: true },
  { id: 'en-GB-Neural2-D', name: 'Neural2 D (UK)', languageCode: 'en-GB', neural: true },
  { id: 'en-GB-Neural2-F', name: 'Neural2 F (UK)', languageCode: 'en-GB', neural: true },
] as const

export type OpenAIVoiceId = typeof OPENAI_VOICES[number]['id']
export type GoogleTtsVoiceId = typeof GOOGLE_TTS_VOICES[number]['id']

export interface OpenAIVoice {
  id: string
  name: string
  preview_url?: string
}

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
  continuousMode: boolean
  searchResults: Array<{ page: number, snippet: string }>
  isSearching: boolean
  maxPageSeen: number
  bookmarks: number[]
  isVoicePanelOpen: boolean
  openAIApiKey: string | null
  googleApiKey: string | null
  ttsProvider: 'browser' | 'openai' | 'google'
  
  // Actions
  setFile: (file: string | ArrayBuffer | null) => void
  setPdfDoc: (doc: any | null) => void
  setPageNum: (pageNum: number) => void
  incrementPage: () => void
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
  setContinuousMode: (continuous: boolean) => void
  updateProgress: (page: number) => void
  toggleBookmark: (page: number) => void
  setOpenAIApiKey: (key: string | null) => void
  setGoogleApiKey: (key: string | null) => void
  setTtsProvider: (provider: 'browser' | 'openai' | 'google') => void
  resetApiKeys: () => void
}

export const usePdfStore = create<PdfState>((set) => ({
  file: '/quotes.pdf',
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
  continuousMode: false,
  searchResults: [],
  isSearching: false,
  maxPageSeen: 1,
  bookmarks: [],
  isVoicePanelOpen: typeof window !== 'undefined' ? window.innerWidth > 1280 : false,
  openAIApiKey: (() => {
    const stored = loadFromStorage(STORAGE_KEYS.openAIApiKey, '')
    return stored ? decryptKey(stored) : ''
  })(),
  googleApiKey: (() => {
    const stored = loadFromStorage(STORAGE_KEYS.googleApiKey, '')
    return stored ? decryptKey(stored) : ''
  })(),
  ttsProvider: loadFromStorage(STORAGE_KEYS.ttsProvider, 'browser'),

  setFile: (file) => set({ 
    file, 
    pageNum: 1, 
    pdfDoc: null, 
    thumbnailCache: {}, 
    isReading: false, 
    continuousMode: false,
    searchResults: [],
    maxPageSeen: 1,
bookmarks: loadFromStorage(STORAGE_KEYS.bookmarks, [] as number[]),
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
  incrementPage: () => set((state) => {
    if (state.pageNum < state.numPages) {
      const next = state.pageNum + 1
      return { 
        pageNum: next,
        maxPageSeen: Math.max(state.maxPageSeen, next)
      }
    }
    return {}
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
  setContinuousMode: (continuousMode) => set({ continuousMode }),
  updateProgress: (page) => set((state: any) => ({ 
    maxPageSeen: Math.max(state.maxPageSeen, page) 
  })),
  toggleBookmark: (page) => set((state: any) => {
    const newBookmarks = state.bookmarks.includes(page)
      ? state.bookmarks.filter((p: number) => p !== page)
      : [...state.bookmarks, page].sort((a: number, b: number) => a - b)
    saveToStorage(STORAGE_KEYS.bookmarks, newBookmarks)
    return { bookmarks: newBookmarks }
  }),
  setOpenAIApiKey: (openAIApiKey) => {
    saveToStorage(STORAGE_KEYS.openAIApiKey, encryptKey(openAIApiKey || ''))
    set({ openAIApiKey })
  },
  setGoogleApiKey: (googleApiKey) => {
    saveToStorage(STORAGE_KEYS.googleApiKey, encryptKey(googleApiKey || ''))
    set({ googleApiKey })
  },
  setTtsProvider: (ttsProvider) => {
    saveToStorage(STORAGE_KEYS.ttsProvider, ttsProvider)
    set({ ttsProvider })
  },
  resetApiKeys: () => {
    localStorage.removeItem(STORAGE_KEYS.openAIApiKey)
    localStorage.removeItem(STORAGE_KEYS.googleApiKey)
    set({ openAIApiKey: null, googleApiKey: null, ttsProvider: 'browser' })
  },
}))
