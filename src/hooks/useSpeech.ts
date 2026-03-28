import { useState, useCallback, useEffect, useRef } from 'react'
import { usePdfStore } from '../store/usePdfStore'

export interface VoiceOption {
  name: string
  lang: string
}

export const useSpeech = () => {
  const { 
    speechRate,
    setSpeechRate,
    speechVoiceName,
    setSpeechVoiceName,
    isReading,
    pageNum,
    setPageNum,
    numPages
  } = usePdfStore()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  
  const synth = window.speechSynthesis
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  
  const currentVoice = voices.find(v => v.name === speechVoiceName) || null
  const rate = speechRate
  const setRate = setSpeechRate
  const setCurrentVoice = (voice: SpeechSynthesisVoice | null) => setSpeechVoiceName(voice?.name || null)

  const loadVoices = useCallback(() => {
    const availableVoices = synth.getVoices()
    if (availableVoices.length === 0) return

    setVoices(availableVoices)
    
    // Default voice selection logic
    if (!speechVoiceName) {
        const preferred = availableVoices.find(v => v.name.toLowerCase().includes('andrew') && v.lang.startsWith('en'))
        const fallback = availableVoices.find(v => v.lang.startsWith('en'))
        const defaultVoice = preferred || fallback || availableVoices[0] || null
        if (defaultVoice) setCurrentVoice(defaultVoice)
    }
  }, [synth, speechVoiceName])

  useEffect(() => {
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => synth.cancel()
  }, [loadVoices, synth])

  const stop = useCallback(() => {
    synth.cancel()
    setIsPlaying(false)
    setIsPaused(false)
  }, [synth])

  const pause = useCallback(() => {
    synth.pause()
    setIsPaused(true)
  }, [synth])

  const resume = useCallback(() => {
    synth.resume()
    setIsPaused(false)
  }, [synth])

  const lastCharIndex = useRef(0)
  const fullTextRef = useRef('')

  const speak = useCallback((text: string) => {
    if (text !== fullTextRef.current.substring(lastCharIndex.current)) {
      lastCharIndex.current = 0
      fullTextRef.current = text
    }

    stop()
    if (!text) return

    const utterance = new SpeechSynthesisUtterance(text)
    if (currentVoice) utterance.voice = currentVoice
    utterance.rate = rate
    
    utterance.onstart = () => setIsPlaying(true)
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
         const offset = fullTextRef.current.length - text.length
         lastCharIndex.current = offset + event.charIndex
      }
    }
    utterance.onend = () => {
      setIsPlaying(false)
      if (isReading && pageNum < numPages) {
        setPageNum(pageNum + 1)
      }
    }
    utterance.onerror = () => setIsPlaying(false)

    utteranceRef.current = utterance
    synth.speak(utterance)
  }, [currentVoice, rate, synth, stop, isReading, pageNum, numPages, setPageNum])

  useEffect(() => {
    if (isPlaying && !isPaused) {
       const remainingText = fullTextRef.current.substring(lastCharIndex.current)
       if (remainingText.length > 5) speak(remainingText)
    }
  }, [rate])

  return {
    isPlaying,
    isPaused,
    voices,
    currentVoice,
    setCurrentVoice,
    rate,
    setRate,
    speak,
    pause,
    resume,
    stop
  }
}
