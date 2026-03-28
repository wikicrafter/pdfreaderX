import * as React from 'react'
import { useEffect, useState } from 'react'
import { usePdfStore } from '../store/usePdfStore'
import { thumbnailQueue } from '../utils/ThumbnailQueue'

interface ThumbnailProps {
  doc: any
  pageNum: number
}

export const Thumbnail: React.FC<ThumbnailProps> = ({ doc, pageNum }) => {
  const { thumbnailCache, setThumbnail } = usePdfStore()
  const [loading, setLoading] = useState(false)
  
  const cacheKey = pageNum
  const cachedData = thumbnailCache[cacheKey]

  useEffect(() => {
    if (!doc || cachedData || loading) return

    setLoading(true)
    
    // Request thumbnail from queue
    thumbnailQueue.push({
      pdfDoc: doc,
      pageNumber: pageNum,
      callback: (dataUrl) => {
        setThumbnail(pageNum, dataUrl)
        setLoading(false)
      }
    })
  }, [doc, pageNum, cachedData, setThumbnail, loading])

  return (
    <div className="relative w-full h-full bg-slate-50 flex items-center justify-center overflow-hidden">
      {cachedData ? (
        <img
          src={cachedData}
          alt={`Page ${pageNum}`}
          className="w-full h-full object-contain animate-in fade-in duration-300"
        />
      ) : (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
