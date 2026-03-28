type QueueItem = {
  pdfDoc: any
  pageNumber: number
  callback: (dataUrl: string) => void
}

class ThumbnailQueue {
  private queue: QueueItem[] = []
  private isProcessing = false

  push(item: QueueItem) {
    // Prevent duplicate requests for the same page
    const exists = this.queue.some(q => q.pdfDoc === item.pdfDoc && q.pageNumber === item.pageNumber)
    if (exists) return

    this.queue.push(item)
    this.processNext()
  }

  private async processNext() {
    if (this.isProcessing || this.queue.length === 0) return

    this.isProcessing = true
    const item = this.queue.shift()
    if (!item) {
      this.isProcessing = false
      return
    }

    try {
      const page = await item.pdfDoc.getPage(item.pageNumber)
      const scale = 0.2 // Lower scale for thumbnails
      const viewport = page.getViewport({ scale })

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Could not get canvas context')

      canvas.height = viewport.height
      canvas.width = viewport.width

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise

      const dataUrl = canvas.toDataURL('image/webp', 0.6) // Lower quality for speed/memory
      item.callback(dataUrl)
      
      // Cleanup
      canvas.width = 0
      canvas.height = 0
    } catch (err) {
      console.error(`Failed to render thumbnail for page ${item.pageNumber}`, err)
    } finally {
      this.isProcessing = false
      // Use requestAnimationFrame to yield to the main thread between renders
      requestAnimationFrame(() => this.processNext())
    }
  }

  // Clear queue for a specific document
  clearForDoc(pdfDoc: any) {
    this.queue = this.queue.filter(q => q.pdfDoc !== pdfDoc)
  }
}

export const thumbnailQueue = new ThumbnailQueue()
