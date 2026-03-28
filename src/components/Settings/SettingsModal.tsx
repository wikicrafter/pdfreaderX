import { X, Speaker, Info } from 'lucide-react'
import { useSpeech } from '../../hooks/useSpeech'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { voices, currentVoice, setCurrentVoice, rate, setRate } = useSpeech()
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary-100 text-primary-600 rounded-xl"><Speaker size={20} /></div>
             <div><h2 className="text-lg font-black text-slate-900 tracking-tight">Audio Settings</h2></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400"><X size={20} /></button>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Voice Selection</label>
            <select 
              value={currentVoice?.name || ''} 
              onChange={(e) => {
                const voice = voices.find(v => v.name === e.target.value)
                if (voice) setCurrentVoice(voice)
              }}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 outline-none text-sm font-semibold transition-all"
            >
              <option value="" disabled>Choose a voice...</option>
              {voices.map(voice => (
                <option key={voice.name} value={voice.name}>{voice.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center"><label className="text-xs font-black text-slate-500 uppercase tracking-widest">Reading Speed</label><div className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm font-black">{rate.toFixed(1)}x</div></div>
             <input type="range" min="0.5" max="2.5" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary-600 outline-none" />
          </div>

          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-4">
             <Info className="text-indigo-500 shrink-0" size={18} />
             <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">Speed changes are applied instantly. Quality may vary based on browser engine.</p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t flex justify-end">
           <button onClick={onClose} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm tracking-tight hover:bg-slate-800 transition-all">Done</button>
        </div>
      </div>
    </div>
  )
}
