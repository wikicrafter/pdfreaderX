import * as React from 'react'
import { useEffect, useRef, useState, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { usePdfStore } from '../store/usePdfStore'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Upload, FileText } from 'lucide-react'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const workerPath = './pdf.worker.min.mjs'
pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath
console.log('PDF worker path:', workerPath)

const WelcomeScreen: React.FC = () => {
  const setFile = usePdfStore((state) => state.setFile)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (ev.target?.result) setFile(ev.target.result)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  return (
    <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-50">
      <FileText size={64} className="mb-4 text-slate-300" />
      <h2 className="text-xl font-bold mb-2">pdfreaderX</h2>
      <p className="text-sm mb-6 text-slate-400 max-w-xs text-center">
        Upload your PDF file to get started. Works completely offline once installed.
      </p>
      <label className="px-6 py-3 bg-primary-600 text-white rounded-xl cursor-pointer hover:bg-primary-700 transition-colors flex items-center gap-2">
        <Upload size={18} />
        Upload PDF
        <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  )
}

interface PDFViewerProps {
  className?: string
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textLayerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { file, pageNum, setNumPages, zoom, rotation, pdfDoc, setPdfDoc } = usePdfStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Show welcome screen on Electron when no file loaded
  if (!file && !pdfDoc) {
    return <WelcomeScreen />
  }

  useEffect(() => {
    if (!file) return

    const loadPdf = async () => {
      setLoading(true)
      try {
        const loadingTask = typeof file === 'string' 
          ? pdfjsLib.getDocument(file) 
          : pdfjsLib.getDocument({ data: new Uint8Array(file as ArrayBuffer) })
        
        const doc = await loadingTask.promise
        setPdfDoc(doc)
        setNumPages(doc.numPages)
      } catch (err: any) {
        console.error('Error loading PDF:', err)
        setError(err.message || 'Failed to load PDF')
      } finally {
        setLoading(false)
      }
    }
    loadPdf()
  }, [file, setNumPages, setPdfDoc])

  // Initial Auto-Fit for Mobile
  useEffect(() => {
    if (pdfDoc && containerRef.current && window.innerWidth < 768) {
      const calculateFit = async () => {
        try {
          const page = await pdfDoc.getPage(1)
          const viewport = page.getViewport({ scale: 1.0 })
          const containerWidth = containerRef.current?.clientWidth || 0
          if (containerWidth > 0 && viewport.width > 0) {
            const fitZoom = (containerWidth - 32) / viewport.width // 32px padding
            usePdfStore.getState().setZoom(Math.min(fitZoom, 1.2))
          }
        } catch (err) {
            console.error('Fit calculation error:', err)
        }
      }
      calculateFit()
    }
  }, [pdfDoc])

  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null)

  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current || !textLayerRef.current) return
    if (renderTaskRef.current) renderTaskRef.current.cancel()

    try {
      const page = await pdfDoc.getPage(pageNum)
      const viewport = page.getViewport({ scale: zoom, rotation })
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      if (!context) return

      canvas.height = viewport.height
      canvas.width = viewport.width
      
      const renderTask = page.render({ canvasContext: context, viewport })
      renderTaskRef.current = renderTask
      await renderTask.promise
      renderTaskRef.current = null

      const textContent = await page.getTextContent()
      if (textLayerRef.current) {
        textLayerRef.current.innerHTML = ''
        textLayerRef.current.style.width = `${canvas.width}px`
        textLayerRef.current.style.height = `${canvas.height}px`
        
        textContent.items.forEach((item: any) => {
          const textDiv = document.createElement('div')
          const { str, transform } = item
          const [, , , , tx, ty] = transform
          textDiv.style.position = 'absolute'
          textDiv.style.left = `${tx * zoom}px`
          const fontSize = item.height * zoom
          textDiv.style.top = `${viewport.height - (ty * zoom) - fontSize}px`
          textDiv.style.fontSize = `${fontSize}px`
          textDiv.style.fontFamily = 'sans-serif'
          textDiv.style.whiteSpace = 'pre'
          textDiv.textContent = str
          textDiv.style.color = 'transparent'
          textLayerRef.current?.appendChild(textDiv)
        })
      }
    } catch (err: any) {
      if (err.name !== 'RenderingCancelledException') console.error('Error rendering page:', err)
    }
  }, [pdfDoc, pageNum, zoom, rotation])

  useEffect(() => { 
    const timer = setTimeout(() => {
        renderPage() 
    }, 100)
    return () => clearTimeout(timer)
  }, [renderPage])

  if (loading) return <div className="h-full flex items-center justify-center text-slate-500">Loading PDF...</div>
  if (error) return <div className="h-full flex items-center justify-center text-red-500">{error}</div>

  return (
    <div ref={containerRef} className={cn("relative flex items-center justify-center p-2 sm:p-4 lg:p-8 pb-24 sm:pb-4 lg:pb-8", className)}>
      <div className="relative shadow-2xl bg-white rounded-sm overflow-hidden" id="print-content">
        <canvas ref={canvasRef} />
        <div 
          ref={textLayerRef} 
          className="absolute top-0 left-0 pointer-events-auto select-text opacity-50"
          id="pdf-text-layer"
          onMouseUp={() => {
            const selection = window.getSelection()?.toString().trim()
            if (selection) usePdfStore.getState().setSelectedText(selection)
          }}
        />
      </div>
    </div>
  )
}
