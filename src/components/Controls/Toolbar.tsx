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
    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-white/50 lg:bg-white/50 backdrop-blur-md rounded-2xl border-2 border-white/50 transition-all shadow-sm w-max mx-auto overflow-hidden">
      <div className="flex items-center bg-slate-100 rounded-xl p-0.5 sm:p-1 overflow-hidden">
        <button onClick={() => setPageNum(pageNum - 1)} disabled={pageNum <= 1} className="p-1.5 sm:p-2 hover:bg-white disabled:opacity-30 rounded-lg transition-all text-slate-600"><ChevronLeft size={14} className="sm:w-4 sm:h-4" /></button>
        <div className="px-1 sm:px-3 flex items-center gap-1 sm:gap-2">
          <input type="text" value={pageNum} onChange={(e) => setPageNum(parseInt(e.target.value) || 1)} className="w-6 sm:w-8 text-center bg-transparent font-black text-xs sm:text-sm outline-none" />
          <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-tighter hidden mini:block">of {numPages}</span>
        </div>
        <button onClick={() => setPageNum(pageNum + 1)} disabled={pageNum >= numPages} className="p-1.5 sm:p-2 hover:bg-white disabled:opacity-30 rounded-lg transition-all text-slate-600"><ChevronRight size={14} className="sm:w-4 sm:h-4" /></button>
        <div className="w-[1px] h-3 sm:h-4 bg-slate-200 mx-0.5 sm:mx-1" />
        <button 
          onClick={() => toggleBookmark(pageNum)} 
          className={`p-1.5 sm:p-2 rounded-lg transition-all ${
            bookmarks.includes(pageNum) 
            ? 'text-amber-500 bg-amber-50' 
            : 'text-slate-400 hover:bg-white hover:text-slate-600'
          }`}
          title={bookmarks.includes(pageNum) ? "Remove Bookmark" : "Save Bookmark"}
        >
          <Bookmark size={14} className="sm:w-4 sm:h-4" fill={bookmarks.includes(pageNum) ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="w-[1px] h-5 sm:h-6 bg-slate-200 mx-0.5 sm:mx-1" />

      <div className="flex items-center gap-0.5 sm:gap-1">
        <button onClick={() => setZoom(zoom - 0.1)} className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500"><ZoomOut size={14} className="sm:w-4 sm:h-4" /></button>
        <div className="min-w-[40px] sm:min-w-[50px] text-center text-[10px] sm:text-xs font-black">{Math.round(zoom * 100)}%</div>
        <button onClick={() => setZoom(zoom + 0.1)} className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500"><ZoomIn size={14} className="sm:w-4 sm:h-4" /></button>
      </div>

      <div className="hidden sm:flex items-center">
        <div className="w-[1px] h-6 bg-slate-200 mx-1" />
        <div className="flex items-center gap-1">
          <button onClick={() => setRotation(rotation + 90)} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500"><RotateCw size={16} /></button>
          <label className="p-2 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all text-slate-500 cursor-pointer">
            <Upload size={16} />
            <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
          </label>
        </div>
      </div>
    </div>
  )
}
