import * as React from 'react'
import { useCallback } from 'react'
import { Play, Pause, Square, X, Volume2, Loader2, AlertCircle, Sparkles, Cloud, SkipBack, SkipForward, Download } from 'lucide-react'
import { usePdfStore } from '../../store/usePdfStore'

interface VoicePanelProps {
  speech: any
}

export const VoicePanel: React.FC<VoicePanelProps> = ({ speech }) => {
  const { 
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
    exportAudio 
  } = speech
  
  const { continuousMode, setContinuousMode, toggleVoicePanel, ttsProvider, pageNum, numPages, setPageNum } = usePdfStore()

  const handleStop = useCallback(() => {
    stop()
    setContinuousMode(false)
  }, [stop, setContinuousMode])

  const handleExport = useCallback(() => {
    exportAudio?.()
  }, [exportAudio])

  const isExportDisabled = ttsProvider === 'browser' || (!isPlaying && !isPaused) || !exportAudio

  const handleSkipPrev = useCallback(() => {
    if (pageNum > 1) setPageNum(pageNum - 1)
  }, [pageNum, setPageNum])

  const handleSkipNext = useCallback(() => {
    if (pageNum < numPages) setPageNum(pageNum + 1)
  }, [pageNum, numPages, setPageNum])

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voice = voices.find((v: any) => v.name === e.target.value)
    if (voice) setCurrentVoice(voice)
  }

  const getPageText = () => {
    const textLayer = document.getElementById('pdf-text-layer')
    return textLayer?.innerText?.trim() || ''
  }

  const handleStart = () => {
    setContinuousMode(true)
    const text = getPageText()
    if (text) speak(text)
  }

  const isOpenAI = ttsProvider === 'openai'
  const isGoogle = ttsProvider === 'google'

  const getIcon = () => {
    if (isOpenAI) return <Sparkles size={16} />
    if (isGoogle) return <Cloud size={16} />
    return <Volume2 size={16} />
  }

  const getIconBg = () => {
    if (isOpenAI) return 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
    if (isGoogle) return 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
    return 'bg-primary-50 text-primary-600'
  }

  const getTitle = () => {
    if (isOpenAI) return 'OpenAI Voice'
    if (isGoogle) return 'Google Voice'
    return 'Voice Engine'
  }

  const getVoiceLabel = () => {
    if (isOpenAI) return 'AI Voice'
    if (isGoogle) return 'Google Voice'
    return 'Browser Voice'
  }

  const getInfoMessage = () => {
    if (isOpenAI) return 'Ultra-realistic voices. $0.003/1k chars.'
    if (isGoogle) return 'Neural2 voices. Free tier available!'
    return null
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${getIconBg()}`}>
            {getIcon()}
          </div>
          <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
            {getTitle()}
          </span>
        </div>
        <button 
          onClick={toggleVoicePanel}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          title="Close Panel"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center gap-2 p-4 bg-indigo-50 text-indigo-600 rounded-xl">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs font-bold">Generating audio...</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
              {getVoiceLabel()}
            </label>
            <select 
              value={currentVoice?.name || ''} 
              onChange={handleVoiceChange}
              disabled={isLoading}
              className="w-full p-2.5 rounded-lg border-2 border-slate-100 bg-white outline-none text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
            >
              <option value="" disabled>Select a voice...</option>
              {voices.map((voice: any) => (
                <option key={voice.id || voice.name} value={voice.name}>
                  {voice.name}
                </option>
              ))}
            </select>
            {!isOpenAI && !isGoogle && voices.length === 0 && (
              <p className="text-[10px] text-slate-400">Loading voices...</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Speed</label>
              <span className="text-sm font-black text-primary-600">{rate.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min={isOpenAI ? "0.25" : isGoogle ? "0.25" : "0.5"} 
              max={isOpenAI ? "2.0" : isGoogle ? "4.0" : "2.5"} 
              step="0.05" 
              value={rate} 
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary-600 outline-none" 
            />
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 border-t bg-slate-50/30">
        <button 
          onClick={handleStart}
          disabled={(isPlaying && !isPaused) || isLoading}
          className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl font-bold hover:from-primary-700 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Play size={16} fill="currentColor" />
          )}
          Start Reading
        </button>

        <div className="flex items-center gap-2">
          {isPlaying && !isPaused ? (
            <button onClick={pause} className="flex-1 py-2.5 bg-amber-500 text-white rounded-lg font-bold flex items-center justify-center gap-2">
              <Pause size={16} fill="currentColor" /> Pause
            </button>
          ) : (
            <button onClick={isPaused ? resume : undefined} disabled={!isPaused} className="flex-1 py-2.5 bg-primary-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50">
              <Play size={16} fill="currentColor" /> Resume
            </button>
          )}
          <button onClick={handleStop} className="px-4 bg-slate-100 text-slate-400 rounded-lg hover:text-red-500 transition-all">
            <Square size={16} fill="currentColor" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleSkipPrev} disabled={pageNum <= 1} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-all disabled:opacity-40 flex items-center justify-center gap-1">
            <SkipBack size={14} /> Prev
          </button>
          <button onClick={handleSkipNext} disabled={pageNum >= numPages} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-all disabled:opacity-40 flex items-center justify-center gap-1">
            Next <SkipForward size={14} />
          </button>
        </div>

        <button 
          onClick={handleExport}
          disabled={isExportDisabled}
          className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Download size={14} />
          Save Audio (Free)
        </button>
      </div>

      {continuousMode && (
        <div className="px-4 pb-4">
          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Reading
              </p>
              <p className="text-[10px] font-bold text-indigo-600">Page {pageNum} of {numPages}</p>
            </div>
            <div className="h-1.5 bg-indigo-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${(pageNum / numPages) * 100}%` }} />
            </div>
          </div>
        </div>
      )}

      {getInfoMessage() && (
        <div className={`px-4 pb-4 ${isOpenAI ? 'bg-purple-50' : isGoogle ? 'bg-green-50' : ''}`}>
          <p className={`text-[9px] font-medium ${isOpenAI ? 'text-purple-600' : isGoogle ? 'text-green-600' : 'text-slate-500'}`}>
            {getInfoMessage()}
          </p>
        </div>
      )}
    </div>
  )
}