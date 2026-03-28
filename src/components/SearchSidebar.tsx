import * as React from 'react'
import { useState, useCallback } from 'react'
import { Search as SearchIcon, X, ArrowRight, Loader2 } from 'lucide-react'
import { usePdfStore } from '../store/usePdfStore'

export const SearchSidebar: React.FC = () => {
  const [query, setQuery] = useState('')
  const { 
    pdfDoc, 
    setPageNum, 
    searchResults, 
    setSearchResults, 
    isSearching, 
    setIsSearching 
  } = usePdfStore()

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pdfDoc || !query.trim()) return

    setIsSearching(true)
    const results: Array<{ page: number, snippet: string }> = []
    
    try {
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i)
        const textContent = await page.getTextContent()
        const text = textContent.items.map((item: any) => item.str).join(' ')
        
        const index = text.toLowerCase().indexOf(query.toLowerCase())
        if (index !== -1) {
          // Extract a snippet around the match
          const start = Math.max(0, index - 40)
          const end = Math.min(text.length, index + query.length + 40)
          let snippet = text.substring(start, end)
          
          if (start > 0) snippet = '...' + snippet
          if (end < text.length) snippet = snippet + '...'
          
          results.push({ page: i, snippet })
        }
        
        // Yield to main thread every 5 pages to keep UI responsive
        if (i % 5 === 0) {
          await new Promise(resolve => requestAnimationFrame(resolve))
        }
      }
      setSearchResults(results)
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setIsSearching(false)
    }
  }, [pdfDoc, query, setIsSearching, setSearchResults])

  const clearSearch = () => {
    setQuery('')
    setSearchResults([])
  }

  return (
    <div className="flex flex-col h-full bg-white/50 backdrop-blur-xl">
      <div className="p-4 border-b bg-slate-50/50">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm font-medium focus:border-primary-500 outline-none transition-all shadow-sm"
          />
          <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          {query && (
            <button 
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-md text-slate-400"
            >
              <X size={14} />
            </button>
          )}
        </form>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
             <Loader2 size={24} className="animate-spin mb-3 text-primary-500" />
             <p className="text-[10px] font-black uppercase tracking-widest">Scanning Document...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              {searchResults.length} Results Found
            </p>
            {searchResults.map((result, idx) => (
              <button
                key={`${result.page}-${idx}`}
                onClick={() => setPageNum(result.page)}
                className="w-full text-left p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-primary-600 uppercase tracking-tighter bg-primary-50 px-2 py-0.5 rounded-md">
                    Page {result.page}
                  </span>
                  <ArrowRight size={12} className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                  {result.snippet.split(new RegExp(`(${query})`, 'gi')).map((part, i) => (
                    part.toLowerCase() === query.toLowerCase() ? (
                      <mark key={i} className="bg-yellow-100 text-yellow-800 rounded px-0.5 font-bold italic">{part}</mark>
                    ) : part
                  ))}
                </p>
              </button>
            ))}
          </>
        ) : query && !isSearching ? (
          <div className="text-center py-12">
            <p className="text-sm text-slate-400 font-bold">No matches found for "{query}"</p>
          </div>
        ) : (
          <div className="text-center py-12">
             <SearchIcon size={32} className="mx-auto text-slate-100 mb-4" />
             <p className="text-xs text-slate-400 font-medium px-8 text-balance">
               Enter a keyword above to search through the entire document instantly.
             </p>
          </div>
        )}
      </div>
    </div>
  )
}
