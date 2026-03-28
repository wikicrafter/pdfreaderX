import * as React from 'react'
import { Bookmark, ArrowRight, Trash2 } from 'lucide-react'
import { usePdfStore } from '../store/usePdfStore'
import { Thumbnail } from './Thumbnail'

export const BookmarksSidebar: React.FC = () => {
  const { 
    bookmarks, 
    toggleBookmark, 
    setPageNum, 
    pdfDoc 
  } = usePdfStore()

  return (
    <div className="flex flex-col h-full bg-slate-50/30">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {bookmarks.length > 0 ? (
          <>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              {bookmarks.length} Saved Bookmarks
            </p>
            <div className="grid grid-cols-1 gap-4">
              {bookmarks.map((page) => (
                <div 
                  key={page}
                  className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary-200 transition-all"
                >
                  <div 
                    onClick={() => setPageNum(page)}
                    className="aspect-[3/4] cursor-pointer overflow-hidden bg-slate-50 relative"
                  >
                    {pdfDoc && <Thumbnail doc={pdfDoc} pageNum={page} />}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                       <ArrowRight size={24} className="text-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100" />
                    </div>
                    <div className="absolute top-3 left-3 bg-primary-600 text-white rounded-lg px-2 py-1 text-[10px] font-black shadow-lg">
                       PAGE {page}
                    </div>
                  </div>
                  
                  <div className="p-3 flex items-center justify-between bg-white">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Saved Reference</span>
                    <button 
                      onClick={() => toggleBookmark(page)}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Remove Bookmark"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 px-8">
            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
               <Bookmark size={32} className="text-slate-300" />
            </div>
            <h3 className="text-sm font-black text-slate-800 mb-2">No bookmarks yet</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Click the bookmark icon in the toolbar on any page to save it for quick access later.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
