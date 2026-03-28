import * as React from 'react'
import { Play, Pause, Square, Speaker, X, Volume2 } from 'lucide-react'
import { usePdfStore } from '../../store/usePdfStore'

interface VoicePanelProps {
  speech: any // We can use ReturnType<typeof useSpeech> but for simplicity using any or defining interface
}

export const VoicePanel: React.FC<VoicePanelProps> = ({ speech }) => {
  const { 
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
  } = speech
  
  const { selectedText, isReading, setIsReading, toggleVoicePanel } = usePdfStore()

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voice = voices.find((v: any) => v.name === e.target.value)
    if (voice) setCurrentVoice(voice)
  }

  const handleReadSelection = () => {
    if (selectedText) {
      setIsReading(false) // Disable auto-read if user plays selection
      speak(selectedText)
    }
  }

  const handleReadPage = () => {
    const textLayer = document.querySelector('.select-text')
    if (textLayer) {
      const text = (textLayer as HTMLElement).innerText || ''
      if (text.trim()) {
        setIsReading(true) // Enable continuous reading
        speak(text)
      }
    }
  }

  const handleStop = () => {
    stop()
    setIsReading(false)
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden animate-in slide-in-from-right duration-500">
      {/* Mini Header for Voice Panel */}
      <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
              <div className="bg-primary-50 p-1.5 rounded-lg text-primary-600">
                  <Volume2 size={16} />
              </div>
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Voice Engine</span>
          </div>
          <button 
              onClick={toggleVoicePanel}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              title="Close Panel"
          >
              <X size={14} />
          </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
      <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Voice Engine</label>
            <select 
              value={currentVoice?.name || ''} 
              onChange={handleVoiceChange}
              className="w-full p-3 rounded-xl border-2 border-slate-100 bg-white outline-none text-sm font-semibold transition-all shadow-sm"
            >
              <option value="" disabled>Select a voice...</option>
              {voices.map((voice: any) => (
                <option key={voice.name} value={voice.name}>{voice.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-3">
             <div className="flex justify-between items-center">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Speed</label>
                <span className="text-sm font-black text-primary-600">{rate.toFixed(1)}x</span>
             </div>
             <input 
               type="range" 
               min="0.5" 
               max="2.5" 
               step="0.1" 
               value={rate} 
               onChange={(e) => setRate(parseFloat(e.target.value))}
               className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary-600 outline-none" 
             />
          </div>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <button 
          onClick={handleReadPage}
          disabled={isPlaying && !isPaused}
          className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <Play size={20} fill="currentColor" />
          Read Page
        </button>

        <button 
          onClick={handleReadSelection}
          disabled={!selectedText || (isPlaying && !isPaused)}
          className="w-full py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-xl font-bold hover:border-primary-500 hover:text-primary-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
        >
          <Speaker size={16} />
          Play Selection
        </button>
        
        <div className="flex gap-2">
           {isPlaying && !isPaused ? (
             <button onClick={pause} className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"><Pause size={18} fill="currentColor" /> Pause</button>
           ) : (
             <button onClick={isPaused ? resume : undefined} disabled={!isPaused} className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"><Play size={18} fill="currentColor" /> Resume</button>
           )}
           <button onClick={handleStop} className="px-5 bg-slate-100 text-slate-400 rounded-xl hover:text-red-500 transition-all"><Square size={18} fill="currentColor" /></button>
        </div>
      </div>

      {isReading && (
        <div className="mt-auto p-4 bg-primary-50 rounded-2xl border border-primary-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-[10px] text-primary-600 font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            Continuous Reading Active
          </p>
          <p className="text-[9px] text-primary-400 font-bold mt-1">Pages will advance automatically.</p>
        </div>
      )}
    </div>
    </div>
  )
}
