import * as React from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Upload,
  Bookmark
} from 'lucide-react'
import { usePdfStore } from '../../store/usePdfStore'

export const Toolbar: React.FC = () => {
  const { 
    pageNum, 
    numPages, 
    setPageNum, 
    zoom, 
    setZoom, 
    rotation, 
    setRotation,
    bookmarks,
    toggleBookmark
  } = usePdfStore()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) usePdfStore.getState().setFile(event.target.result)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 transition-all shadow-xl w-max mx-auto overflow-hidden shrink-0 pointer-events-auto">
      <div className="flex items-center bg-slate-100 rounded-xl p-0.5 overflow-hidden">
        <button onClick={() => setPageNum(pageNum - 1)} disabled={pageNum <= 1} className="p-1.5 hover:bg-white disabled:opacity-30 rounded-lg transition-all text-slate-600"><ChevronLeft size={14} /></button>
        <div className="px-1 flex items-center gap-1">
          <input type="text" value={pageNum} onChange={(e) => setPageNum(parseInt(e.target.value) || 1)} className="w-5 text-center bg-transparent font-black text-xs outline-none" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter hidden md:block whitespace-nowrap">of {numPages}</span>
        </div>
        <button onClick={() => setPageNum(pageNum + 1)} disabled={pageNum >= numPages} className="p-1.5 hover:bg-white disabled:opacity-30 rounded-lg transition-all text-slate-600"><ChevronRight size={14} /></button>
        <div className="w-[1px] h-3 bg-slate-200 mx-0.5" />
        <button 
          onClick={() => toggleBookmark(pageNum)} 
          className={`p-1.5 rounded-lg transition-all ${
            bookmarks.includes(pageNum) 
            ? 'text-amber-500 bg-amber-50' 
            : 'text-slate-400 hover:bg-white hover:text-slate-600'
          }`}
          title={bookmarks.includes(pageNum) ? "Remove Bookmark" : "Save Bookmark"}
        >
          <Bookmark size={14} fill={bookmarks.includes(pageNum) ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="w-[1px] h-5 bg-slate-200 mx-0.5" />

      <div className="flex items-center gap-0.5">
        <button onClick={() => setZoom(zoom - 0.1)} className="p-1.5 hover:bg-slate-100 rounded-xl transition-all text-slate-500"><ZoomOut size={14} /></button>
        <div className="min-w-[32px] text-center text-[10px] font-black">{Math.round(zoom * 100)}%</div>
        <button onClick={() => setZoom(zoom + 0.1)} className="p-1.5 hover:bg-slate-100 rounded-xl transition-all text-slate-500"><ZoomIn size={14} /></button>
      </div>

      <div className="flex items-center">
        <div className="w-[1px] h-5 bg-slate-200 mx-1" />
        <div className="flex items-center gap-1">
          <button onClick={() => setRotation(rotation + 90)} className="p-1.5 hover:bg-slate-100 rounded-xl transition-all text-slate-500"><RotateCw size={14} /></button>
          <label className="p-1.5 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all text-slate-500 cursor-pointer">
            <Upload size={14} />
            <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
          </label>
        </div>
      </div>
    </div>
  )
}
