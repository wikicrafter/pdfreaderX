import { X, Speaker, Info, Key, Loader2, CheckCircle, AlertCircle, Trash2 } from 'lucide-react'
import { useSpeech } from '../../hooks/useSpeech'
import { useState } from 'react'
import { usePdfStore, OPENAI_VOICES, GOOGLE_TTS_VOICES } from '../../store/usePdfStore'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { voices, currentVoice, setCurrentVoice, rate, setRate } = useSpeech()
  const { ttsProvider, setTtsProvider, openAIApiKey, setOpenAIApiKey, googleApiKey, setGoogleApiKey, resetApiKeys } = usePdfStore()
  
  const [apiKeyInput, setApiKeyInput] = useState(openAIApiKey || '')
  const [googleKeyInput, setGoogleKeyInput] = useState(googleApiKey || '')
  const [isValidating, setIsValidating] = useState(false)
  const [keyError, setKeyError] = useState<string | null>(null)
  const [googleKeyError, setGoogleKeyError] = useState<string | null>(null)
  const [googleKeySuccess, setGoogleKeySuccess] = useState(false)

  const validateOpenAIKey = async () => {
    if (!apiKeyInput.trim()) return
    
    setIsValidating(true)
    setKeyError(null)

    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKeyInput.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: 'alloy',
          input: 'Test',
          speed: 1.0
        }
      )})

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || 'Invalid API key')
      }

      await response.blob()
      setOpenAIApiKey(apiKeyInput.trim())
      setTtsProvider('openai')
    } catch (err: any) {
      setKeyError(err.message || 'Invalid API key')
    } finally {
      setIsValidating(false)
    }
  }

  const validateGoogleKey = async () => {
    if (!googleKeyInput.trim()) return
    
    setIsValidating(true)
    setGoogleKeyError(null)
    setGoogleKeySuccess(false)

    try {
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleKeyInput.trim()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: { text: 'Test' },
          voice: { languageCode: 'en-US', name: 'en-US-Standard-A' },
          audioConfig: { audioEncoding: 'MP3' }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || 'Invalid API key')
      }

      await response.json()
      setGoogleApiKey(googleKeyInput.trim())
      setTtsProvider('google')
      setGoogleKeySuccess(true)
    } catch (err: any) {
      setGoogleKeyError(err.message || 'Invalid API key')
    } finally {
      setIsValidating(false)
    }
  }

  if (!isOpen) return null

  let allVoices: any[] = []
  if (ttsProvider === 'openai') {
    allVoices = [...OPENAI_VOICES]
  } else if (ttsProvider === 'google') {
    allVoices = [...GOOGLE_TTS_VOICES]
  } else {
    allVoices = voices
  }

  const currentVoiceName = currentVoice?.name || ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between bg-slate-50/50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary-100 text-primary-600 rounded-xl"><Speaker size={20} /></div>
             <div><h2 className="text-lg font-black text-slate-900 tracking-tight">Audio Settings</h2></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400"><X size={20} /></button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Voice Engine</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTtsProvider('browser')}
                className={`py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                  ttsProvider === 'browser'
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                Free
              </button>
              <button
                onClick={() => setTtsProvider('openai')}
                className={`py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                  ttsProvider === 'openai'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                OpenAI
              </button>
              <button
                onClick={() => setTtsProvider('google')}
                className={`py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                  ttsProvider === 'google'
                    ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg shadow-green-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                Google
              </button>
            </div>
          </div>

          {ttsProvider === 'openai' && (
            <div className="space-y-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
              <div className="flex items-center gap-2">
                <Key size={16} className="text-indigo-600" />
                <label className="text-xs font-black text-indigo-700 uppercase tracking-widest">OpenAI API Key</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-..."
                  className="flex-1 p-3 rounded-xl border-2 border-indigo-100 bg-white outline-none text-sm font-medium transition-all focus:border-indigo-400"
                />
                <button
                  onClick={validateOpenAIKey}
                  disabled={isValidating || !apiKeyInput.trim()}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isValidating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                </button>
              </div>
              {keyError && (
                <div className="flex items-center gap-2 text-red-500 text-xs font-medium">
                  <AlertCircle size={14} />
                  {keyError}
                </div>
              )}
              {openAIApiKey && !keyError && (
                <div className="flex items-center gap-2 text-green-600 text-xs font-medium">
                  <CheckCircle size={14} />
                  API Key validated
                </div>
              )}
              <p className="text-[10px] text-indigo-600 leading-relaxed">
                Ultra-realistic voices. $0.003/1k chars. Requires billing.
              </p>
            </div>
          )}

          {ttsProvider === 'google' && (
            <div className="space-y-4 p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl border border-green-100">
              <div className="flex items-center gap-2">
                <Key size={16} className="text-green-600" />
                <label className="text-xs font-black text-green-700 uppercase tracking-widest">Google Cloud API Key</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={googleKeyInput}
                  onChange={(e) => setGoogleKeyInput(e.target.value)}
                  placeholder="AIza..."
                  className="flex-1 p-3 rounded-xl border-2 border-green-100 bg-white outline-none text-sm font-medium transition-all focus:border-green-400"
                />
                <button
                  onClick={validateGoogleKey}
                  disabled={isValidating || !googleKeyInput.trim()}
                  className="px-4 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isValidating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                </button>
              </div>
              {googleKeyError && (
                <div className="flex items-center gap-2 text-red-500 text-xs font-medium">
                  <AlertCircle size={14} />
                  {googleKeyError}
                </div>
              )}
              {googleKeySuccess && (
                <div className="flex items-center gap-2 text-green-600 text-xs font-medium">
                  <CheckCircle size={14} />
                  API Key validated
                </div>
              )}
              <p className="text-[10px] text-green-600 leading-relaxed">
                Neural2 voices available. $0.004/1k chars. Free tier: 1M chars/month.
              </p>
              <a 
                href="https://console.cloud.google.com/apis/credentials" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] text-green-500 underline hover:text-green-700"
              >
                Get API Key →
              </a>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
              {ttsProvider === 'openai' ? 'OpenAI Voices' : ttsProvider === 'google' ? 'Google Voices' : 'Browser Voices'}
            </label>
            <select 
              value={currentVoiceName} 
              onChange={(e) => {
                const voice = allVoices.find((v: any) => v.name === e.target.value)
                if (voice) setCurrentVoice(voice)
              }}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 outline-none text-sm font-semibold transition-all"
            >
              <option value="" disabled>Select a voice...</option>
              {allVoices.map((voice: any) => (
                <option key={voice.id || voice.name} value={voice.name}>
                  {voice.name}
                  {ttsProvider === 'google' && voice.neural ? ' ✨' : ''}
                </option>
              ))}
            </select>
            {ttsProvider === 'google' && !googleApiKey && (
              <p className="text-xs text-slate-400">Enter and validate API key to use Google voices</p>
            )}
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center">
               <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Speed</label>
               <div className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm font-black">{rate.toFixed(1)}x</div>
             </div>
             <input type="range" min="0.5" max="2.5" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary-600 outline-none" />
          </div>

<div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-4">
              <Info className="text-indigo-500 shrink-0" size={18} />
              <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                {ttsProvider === 'openai' 
                  ? 'OpenAI TTS: Ultra-realistic voices. $0.003/1k chars.'
                  : ttsProvider === 'google'
                  ? 'Google Cloud TTS: Neural2 voices. $0.004/1k chars. Free tier available!'
                  : 'Browser TTS: Free, works offline. Quality varies by browser.'}
              </p>
           </div>

           {(openAIApiKey || googleApiKey) && (
             <button
               onClick={() => {
                 if (confirm('Reset all API keys? This will remove saved keys from your browser.')) {
                   resetApiKeys()
                   setApiKeyInput('')
                   setGoogleKeyInput('')
                 }
               }}
               className="w-full py-3 border-2 border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2"
             >
               <Trash2 size={14} />
               Reset API Keys
             </button>
           )}
        </div>

        <div className="p-6 bg-slate-50 border-t flex justify-end sticky bottom-0">
           <button onClick={onClose} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm tracking-tight hover:bg-slate-800 transition-all">Done</button>
        </div>
      </div>
    </div>
  )
}