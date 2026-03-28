import * as React from 'react'
import { useState } from 'react'
import { LayoutGrid, Search, ChevronLeft, CheckCircle, Bookmark } from 'lucide-react'
import { usePdfStore } from '../store/usePdfStore'
import { Thumbnail } from './Thumbnail'
import { SearchSidebar } from './SearchSidebar'
import { BookmarksSidebar } from './BookmarksSidebar'

type SidebarTab = 'thumbnails' | 'search' | 'bookmarks'

export const Sidebar: React.FC = () => {
  const { numPages, pageNum, setPageNum, pdfDoc, toggleSideBar, maxPageSeen } = usePdfStore()
  const [activeTab, setActiveTab] = useState<SidebarTab>('thumbnails')
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(500)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const ITEM_HEIGHT = 440 // Robust estimate for thumbnail + padding + text
  const BUFFER = 2

  const progressPercent = numPages > 0 ? Math.round((maxPageSeen / numPages) * 100) : 0

  React.useEffect(() => {
    if (!containerRef.current) return
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height)
      }
    })
    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <aside className="w-80 h-full border-r bg-white flex flex-col shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
      {/* Sidebar Header with Tabs */}
      <div className="flex flex-col border-b bg-slate-50/50 backdrop-blur-md">
        <div className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    Document Explorer
                </h2>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-slate-200 rounded-full w-24 overflow-hidden">
                        <div className="h-full bg-primary-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <span className="text-[9px] font-black text-primary-600">{progressPercent}%</span>
                </div>
            </div>
            <button 
                onClick={toggleSideBar}
                className="p-1.5 hover:bg-slate-200/50 rounded-lg text-slate-400 transition-colors"
                title="Close Sidebar"
            >
                <ChevronLeft size={16} />
            </button>
        </div>
        
        <div className="flex px-4 pb-2 gap-2">
            <button 
                onClick={() => setActiveTab('thumbnails')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                    activeTab === 'thumbnails' 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                    : 'text-slate-400 hover:bg-white hover:text-slate-600'
                }`}
            >
                <LayoutGrid size={14} />
                Thumbnails
            </button>
            <button 
                onClick={() => setActiveTab('search')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                    activeTab === 'search' 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                    : 'text-slate-400 hover:bg-white hover:text-slate-600'
                }`}
            >
                <Search size={14} />
                Search
            </button>
            <button 
                onClick={() => setActiveTab('bookmarks')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                    activeTab === 'bookmarks' 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                    : 'text-slate-400 hover:bg-white hover:text-slate-600'
                }`}
            >
                <Bookmark size={14} />
                Saved
            </button>
        </div>
      </div>
      
      {/* Sidebar Content */}
      <div className="flex-1 overflow-hidden" ref={containerRef}>
        {activeTab === 'thumbnails' ? (
          <div 
            className="h-full overflow-y-auto p-4 custom-scrollbar relative"
            onScroll={handleScroll}
          >
            <div 
                style={{ height: `${numPages * ITEM_HEIGHT}px`, position: 'relative' }}
                className="w-full"
            >
              {(() => {
                const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER)
                const endIndex = Math.min(numPages - 1, Math.floor((scrollTop + containerHeight) / ITEM_HEIGHT) + BUFFER)
                
                const visiblePages = []
                for (let i = startIndex; i <= endIndex; i++) {
                  visiblePages.push(i + 1)
                }
                
                return visiblePages.map(page => (
                  <div 
                    key={page}
                    onClick={() => setPageNum(page)}
                    style={{ 
                        position: 'absolute', 
                        top: `${(page - 1) * ITEM_HEIGHT}px`,
                        height: `${ITEM_HEIGHT - 20}px`, // Leave room for gap
                        left: 0,
                        right: 0
                    }}
                    className={`cursor-pointer rounded-2xl transition-all p-2 group overflow-hidden border-2 ${
                        pageNum === page 
                        ? 'bg-primary-50 border-primary-500 shadow-xl shadow-primary-100/50' 
                        : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className="aspect-[3/4] overflow-hidden rounded-xl bg-slate-50 shadow-inner relative">
                       {pdfDoc && <Thumbnail doc={pdfDoc} pageNum={page} />}
                       {page <= maxPageSeen && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-0.5 shadow-sm border border-white">
                             <CheckCircle size={10} fill="currentColor" />
                          </div>
                       )}
                    </div>
                    <div className={`mt-2 text-center text-[10px] font-black uppercase tracking-tighter ${pageNum === page ? 'text-primary-600' : 'text-slate-400'}`}>
                      Page {page}
                    </div>
                  </div>
                ))
              })()}
            </div>
          </div>
        ) : activeTab === 'search' ? (
          <SearchSidebar />
        ) : (
          <BookmarksSidebar />
        )}
      </div>
    </aside>
  )
}
