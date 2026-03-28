import * as React from 'react'
import { X, Heart, Coffee, Star, Shield, Zap, BookOpen, Globe } from 'lucide-react'

interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-2xl shadow-inner">
              <Heart size={24} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Support & Info</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 font-mono">Platform Node // Access Granted</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-200 rounded-full transition-all text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {/* How it functions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-primary-600" />
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">How it Functions</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <Zap size={18} className="text-amber-500" />
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Zero Tracking</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Session-based architecture. No data leaves your machine.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <BookOpen size={18} className="text-indigo-500" />
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Smart Engine</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Fluid PDF rendering with optimized TTS voice synthesis.</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed bg-primary-50 p-4 rounded-xl border border-primary-100 font-medium">
              Simply upload a PDF or use the default document. Use the Voice Engine to listen, Global Search to explore, and Sidebar to navigate. Everything is optimized for speed and privacy.
            </p>
          </div>

          <div className="h-[1px] bg-slate-100 w-full" />

          {/* Support Creator section */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-red-500" />
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Support the Creator</h3>
            </div>
            <p className="text-sm font-bold text-slate-700 italic border-l-4 border-red-500 pl-4 py-1">
              "Universal access to knowledge is a collective responsibility. Sustainability fuels the mission."
            </p>

            <div className="space-y-3">
              <a href="https://ko-fi.com/gigaa" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl shadow-lg shadow-red-200 group transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <Coffee size={20} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-tight">Deploy Funds</p>
                    <p className="text-[9px] font-bold text-white/80">Fuel the research via Ko-fi</p>
                  </div>
                </div>
                <X size={16} className="rotate-45 opacity-0 group-hover:opacity-100 transition-all" />
              </a>

              <div className="grid grid-cols-2 gap-3">
                <a href="https://github.com/wikicrafter/pdfreaderX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all">
                  <Star size={18} className="text-amber-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Star Repo</span>
                </a>
                <a href="https://github.com/wikicrafter/pdfreaderX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 border-2 border-slate-100 text-slate-600 rounded-2xl hover:border-primary-500 hover:text-primary-600 transition-all">
                  <Globe size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">GitHub History</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t flex justify-center">
          <button onClick={onClose} className="px-10 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm tracking-tight hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Continue Reading</button>
        </div>
      </div>
    </div>
  )
}
