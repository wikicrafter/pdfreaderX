import { useState, useCallback, useEffect, useRef } from 'react'
import { usePdfStore, OPENAI_VOICES, GOOGLE_TTS_VOICES } from '../store/usePdfStore'

interface BaseSpeechReturn {
    isPlaying: boolean
    isPaused: boolean
    isLoading?: boolean
    error?: string | null
    voices: any[]
    currentVoice: any
    setCurrentVoice: (voice: any) => void
    rate: number
    setRate: (rate: number) => void
    speak: (text: string) => void
    pause: () => void
    resume: () => void
    stop: () => void
    getCurrentPage: () => number
    exportAudio?: () => boolean | null
  }

export const useSpeech = (): BaseSpeechReturn => {
  const { 
    ttsProvider,
    openAIApiKey,
    googleApiKey,
    speechRate,
    setSpeechRate,
    speechVoiceName,
    setSpeechVoiceName,
    continuousMode,
    incrementPage
  } = usePdfStore()

  // Browser TTS state
  const [browserIsPlaying, setBrowserIsPlaying] = useState(false)
  const [browserIsPaused, setBrowserIsPaused] = useState(false)
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([])
  
  // OpenAI TTS state
  const [openaiIsPlaying, setOpenaiIsPlaying] = useState(false)
  const [openaiIsPaused, setOpenaiIsPaused] = useState(false)
  const [openaiIsLoading, setOpenaiIsLoading] = useState(false)
  const [openaiError, setOpenaiError] = useState<string | null>(null)

  // Google TTS state
  const [googleIsPlaying, setGoogleIsPlaying] = useState(false)
  const [googleIsPaused, setGoogleIsPaused] = useState(false)
  const [googleIsLoading, setGoogleIsLoading] = useState(false)
  const [googleError, setGoogleError] = useState<string | null>(null)

  const synth = window.speechSynthesis
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastCharIndex = useRef(0)
  const fullTextRef = useRef('')
  const continuousPageRef = useRef<number>(0)

  const getPdfText = () => {
    const textLayer = document.getElementById('pdf-text-layer')
    if (textLayer) {
      const text = textLayer.innerText?.trim()
      if (text) return text
    }
    return ''
  }

  // Browser voices
  const currentBrowserVoice = browserVoices.find(v => v.name === speechVoiceName) || null

  // Load browser voices
  const loadBrowserVoices = useCallback(() => {
    const availableVoices = synth.getVoices()
    if (availableVoices.length === 0) return

    setBrowserVoices(availableVoices)
    
    if (!speechVoiceName || ttsProvider === 'browser') {
        const preferred = availableVoices.find(v => v.name.toLowerCase().includes('andrew') && v.lang.startsWith('en'))
        const fallback = availableVoices.find(v => v.lang.startsWith('en'))
        const defaultVoice = preferred || fallback || availableVoices[0] || null
        if (defaultVoice) setSpeechVoiceName(defaultVoice.name)
    }
  }, [synth, speechVoiceName, ttsProvider, setSpeechVoiceName])

  useEffect(() => {
    loadBrowserVoices()
    window.speechSynthesis.onvoiceschanged = loadBrowserVoices
    return () => synth.cancel()
  }, [loadBrowserVoices, synth])

  // Browser TTS functions
  const browserStop = useCallback(() => {
    synth.cancel()
    setBrowserIsPlaying(false)
    setBrowserIsPaused(false)
  }, [synth])

  const browserPause = useCallback(() => {
    synth.pause()
    setBrowserIsPaused(true)
  }, [synth])

  const browserResume = useCallback(() => {
    synth.resume()
    setBrowserIsPaused(false)
  }, [synth])

  const browserSpeak = useCallback((text: string) => {
    if (text !== fullTextRef.current.substring(lastCharIndex.current)) {
      lastCharIndex.current = 0
      fullTextRef.current = text
    }

    browserStop()
    if (!text) return

    const utterance = new SpeechSynthesisUtterance(text)
    if (currentBrowserVoice) utterance.voice = currentBrowserVoice
    utterance.rate = speechRate
    
    utterance.onstart = () => setBrowserIsPlaying(true)
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
         const offset = fullTextRef.current.length - text.length
lastCharIndex.current = offset + event.charIndex
       }
    }
    utterance.onend = () => {
        setBrowserIsPlaying(false)
        if (continuousMode) {
          continuousPageRef.current = usePdfStore.getState().pageNum
          const { pageNum, numPages } = usePdfStore.getState()
          if (pageNum < numPages) {
            incrementPage()
            setTimeout(() => {
              const text = getPdfText()
              if (text) browserSpeak(text)
            }, 300)
          }
        }
      }
    utterance.onerror = () => setBrowserIsPlaying(false)

    utteranceRef.current = utterance
    synth.speak(utterance)
  }, [currentBrowserVoice, speechRate, browserStop, continuousMode])

  // OpenAI TTS functions
  const openaiAudioUrlRef = useRef<string | null>(null)
  const openaiAudioBlobRef = useRef<Blob | null>(null)

  const openaiStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (openaiAudioUrlRef.current) {
      URL.revokeObjectURL(openaiAudioUrlRef.current)
      openaiAudioUrlRef.current = null
    }
    setOpenaiIsPlaying(false)
    setOpenaiIsPaused(false)
  }, [])

  const openaiPause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setOpenaiIsPaused(true)
    }
  }, [])

  const openaiResume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play()
      setOpenaiIsPaused(false)
    }
  }, [])

  const openaiSpeak = useCallback(async (text: string) => {
    if (!text || !openAIApiKey) return

    openaiStop()
    const currentVoice = OPENAI_VOICES.find(v => v.name === speechVoiceName) || OPENAI_VOICES[0]
    if (!currentVoice) return

    setOpenaiIsLoading(true)
    setOpenaiError(null)

    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: currentVoice.id,
          input: text,
          speed: speechRate
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `API error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      openaiAudioBlobRef.current = audioBlob
      const audioUrl = URL.createObjectURL(audioBlob)
      openaiAudioUrlRef.current = audioUrl

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => setOpenaiIsPlaying(true)
      audio.onpause = () => setOpenaiIsPaused(true)
      audio.onended = () => {
        setOpenaiIsPlaying(false)
        if (continuousMode) {
          continuousPageRef.current = usePdfStore.getState().pageNum
          const { pageNum, numPages } = usePdfStore.getState()
          if (pageNum < numPages) {
            incrementPage()
            setTimeout(() => {
              const text = getPdfText()
              if (text) openaiSpeak(text)
            }, 300)
          }
        }
      }
      audio.onerror = () => {
        setOpenaiError('Audio playback failed')
        setOpenaiIsPlaying(false)
      }

      audio.play()
    } catch (err: any) {
      setOpenaiError(err.message || 'Failed to generate speech')
    } finally {
      setOpenaiIsLoading(false)
    }
  }, [openAIApiKey, speechVoiceName, speechRate, openaiStop, continuousMode])

  const googleAudioUrlRef = useRef<string | null>(null)
  const googleAudioBlobRef = useRef<Blob | null>(null)

  // Google TTS functions
  const googleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (googleAudioUrlRef.current) {
      URL.revokeObjectURL(googleAudioUrlRef.current)
      googleAudioUrlRef.current = null
    }
    setGoogleIsPlaying(false)
    setGoogleIsPaused(false)
  }, [])

  const googlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setGoogleIsPaused(true)
    }
  }, [])

  const googleResume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play()
      setGoogleIsPaused(false)
    }
  }, [])

  const googleSpeak = useCallback(async (text: string) => {
    if (!text || !googleApiKey) return

    googleStop()
    const currentVoice = GOOGLE_TTS_VOICES.find(v => v.name === speechVoiceName) || GOOGLE_TTS_VOICES.find(v => v.neural) || GOOGLE_TTS_VOICES[0]
    if (!currentVoice) return

    setGoogleIsLoading(true)
    setGoogleError(null)

    try {
      // Google TTS requires base64 encoding for SSML, but we'll use plain text
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: { text: text },
          voice: { 
            languageCode: currentVoice.languageCode, 
            name: currentVoice.id 
          },
          audioConfig: { 
            audioEncoding: 'MP3',
            speakingRate: speechRate,
            pitch: 0,
            volumeGainDb: 0
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.audioContent) {
        throw new Error('No audio content returned')
      }

      // Convert base64 to blob
      const binaryString = atob(data.audioContent)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const audioBlob = new Blob([bytes], { type: 'audio/mp3' })
      googleAudioBlobRef.current = audioBlob
      const audioUrl = URL.createObjectURL(audioBlob)
      googleAudioUrlRef.current = audioUrl

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => setGoogleIsPlaying(true)
      audio.onpause = () => setGoogleIsPaused(true)
      audio.onended = () => {
        setGoogleIsPlaying(false)
        if (continuousMode) {
          continuousPageRef.current = usePdfStore.getState().pageNum
          const { pageNum, numPages } = usePdfStore.getState()
          if (pageNum < numPages) {
            incrementPage()
            setTimeout(() => {
              const text = getPdfText()
              if (text) googleSpeak(text)
            }, 300)
          }
        }
      }
      audio.onerror = () => {
        setGoogleError('Audio playback failed')
        setGoogleIsPlaying(false)
      }

      audio.play()
    } catch (err: any) {
      setGoogleError(err.message || 'Failed to generate speech')
    } finally {
      setGoogleIsLoading(false)
    }
  }, [googleApiKey, speechVoiceName, speechRate, googleStop, continuousMode])

  // Unified interface
  const isPlaying = ttsProvider === 'openai' ? openaiIsPlaying : ttsProvider === 'google' ? googleIsPlaying : browserIsPlaying
  const isPaused = ttsProvider === 'openai' ? openaiIsPaused : ttsProvider === 'google' ? googleIsPaused : browserIsPaused
  const isLoading = ttsProvider === 'openai' ? openaiIsLoading : ttsProvider === 'google' ? googleIsLoading : false
  const error = ttsProvider === 'openai' ? openaiError : ttsProvider === 'google' ? googleError : null
  
  let voices: any[] = []
  let currentVoice: any = null
  
  if (ttsProvider === 'openai') {
    voices = [...OPENAI_VOICES]
    currentVoice = OPENAI_VOICES.find(v => v.name === speechVoiceName)
  } else if (ttsProvider === 'google') {
    voices = [...GOOGLE_TTS_VOICES]
    currentVoice = GOOGLE_TTS_VOICES.find(v => v.name === speechVoiceName)
  } else {
    voices = browserVoices
    currentVoice = currentBrowserVoice
  }
  
  const rate = speechRate
  const setRate = setSpeechRate

  const setCurrentVoice = (voice: any) => {
    if (voice) {
      setSpeechVoiceName(voice.name || voice.id || null)
    }
  }

  const speak = useCallback((text: string) => {
    // Always stop any playing audio first
    browserStop()
    openaiStop()
    googleStop()
    if (ttsProvider === 'openai') {
      openaiSpeak(text)
    } else if (ttsProvider === 'google') {
      googleSpeak(text)
    } else {
      browserSpeak(text)
    }
}, [ttsProvider, openaiSpeak, googleSpeak, browserSpeak])

  const stop = useCallback(() => {
    if (ttsProvider === 'openai') {
      openaiStop()
    } else if (ttsProvider === 'google') {
      googleStop()
    } else {
      browserStop()
    }
  }, [ttsProvider, openaiStop, googleStop, browserStop])

  const pause = useCallback(() => {
    if (ttsProvider === 'openai') {
      openaiPause()
    } else if (ttsProvider === 'google') {
      googlePause()
    } else {
      browserPause()
    }
  }, [ttsProvider, openaiPause, googlePause, browserPause])

  const resume = useCallback(() => {
    if (ttsProvider === 'openai') {
      openaiResume()
    } else if (ttsProvider === 'google') {
      googleResume()
    } else {
      browserResume()
    }
  }, [ttsProvider, openaiResume, googleResume, browserResume])

  const getCurrentPage = useCallback(() => {
    return continuousPageRef.current || usePdfStore.getState().pageNum
  }, [])

  const exportAudio = useCallback(() => {
    let blob: Blob | null = null
    let filename = `page-${usePdfStore.getState().pageNum}`
    
    if (ttsProvider === 'browser') {
      return null // Browser uses Web Speech API - no blob to export
    } else if (ttsProvider === 'openai') {
      blob = openaiAudioBlobRef.current
    } else if (ttsProvider === 'google') {
      blob = googleAudioBlobRef.current
    }
    
    if (!blob) return null
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    return true
  }, [ttsProvider])

  useEffect(() => {
    browserStop()
    openaiStop()
    googleStop()
  }, [ttsProvider])

  useEffect(() => {
    return () => {
      browserStop()
      openaiStop()
      googleStop()
    }
  }, [browserStop, openaiStop, googleStop])

  return {
    isPlaying,
    isPaused,
    isLoading,
    error,
    voices,
    currentVoice,
    setCurrentVoice,
    rate,
    setRate,
    speak,
    pause,
    resume,
    stop,
    getCurrentPage,
    exportAudio
  }
}