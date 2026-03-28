import { useState } from 'react'
import { Settings, PanelLeft, Volume2, Heart } from 'lucide-react'
import { PDFViewer } from './components/PDFViewer'
import { Toolbar } from './components/Controls/Toolbar'
import { VoicePanel } from './components/Controls/VoicePanel'
import { Sidebar } from './components/Sidebar'
import { SettingsModal } from './components/Settings/SettingsModal'
import { SupportModal } from './components/Support/SupportModal'
import { usePdfStore } from './store/usePdfStore'
import { useSpeech } from './hooks/useSpeech'

export default function App() {
  const speech = useSpeech()
  const {
    isSideBarOpen,
    toggleSideBar,
    numPages,
    maxPageSeen,
    isVoicePanelOpen,
    toggleVoicePanel
  } = usePdfStore()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)

  const progressPercent = numPages > 0 ? (maxPageSeen / numPages) * 100 : 0

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 font-sans selection:bg-primary-100 selection:text-primary-900">
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />

      {/* Top Navigation / Toolbar */}
      <header className="h-16 flex items-center px-4 justify-between bg-white/80 backdrop-blur-md border-b shadow-sm z-30 relative shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleSideBar}
            className={`p-2 rounded-lg transition-all ${isSideBarOpen ? 'text-primary-600 bg-primary-50' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <PanelLeft size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-[#1E3A8A] p-2 rounded-xl text-white shadow-lg shadow-blue-200/10">
              <svg width="20" height="20" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="64" y="64" width="384" height="384" rx="80" fill="white" fill-opacity="0.2" />
                <path d="M200 200L312 312M312 200L200 312" stroke="white" stroke-width="48" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tighter text-slate-900 leading-none">
              pdf<span className="text-primary-600 hidden xs:inline">readerX</span>
            </h1>
          </div>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-8 overflow-hidden">
          <Toolbar />
        </div>

        <div className="flex items-center gap-1 sm:gap-3 justify-end">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`p-2.5 rounded-xl transition-all ${isSettingsOpen ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:bg-white hover:text-slate-600 hover:shadow-sm'}`}
            title="Settings"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={toggleVoicePanel}
            className={`p-2.5 rounded-xl transition-all ${isVoicePanelOpen ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:bg-white hover:text-slate-600 hover:shadow-sm'}`}
            title={isVoicePanelOpen ? "Close Voice Panel" : "Open Voice Panel"}
          >
            <Volume2 size={18} />
          </button>
          <button 
            onClick={() => setIsSupportOpen(true)}
            className="flex items-center gap-3 pl-2 group transition-all text-right"
          >
            <div className="hidden sm:block">
              <p className="text-[12px] font-black text-slate-800 leading-none group-hover:text-red-600 transition-colors tracking-tight uppercase">Support</p>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">WikiCrafter</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center group-hover:shadow-md group-hover:border-red-100 transition-all duration-300">
                <Heart size={20} className="text-slate-400 group-hover:text-red-500 transition-colors" fill="currentColor" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-sm animate-pulse" />
            </div>
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(79,70,229,0.3)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>
      
      {/* Mobile Floating Toolbar */}
      <div className="md:hidden fixed bottom-12 left-0 w-full z-40 px-4 pointer-events-none">
        <div className="flex justify-center pointer-events-auto">
          <Toolbar />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop */}
        {(isSideBarOpen || isVoicePanelOpen) && (
          <div 
            className="md:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[40]" 
            onClick={() => {
              if (isSideBarOpen) toggleSideBar()
              if (isVoicePanelOpen) toggleVoicePanel()
            }}
          />
        )}

        <div className={`
          fixed md:relative inset-y-0 left-0 z-[45] md:z-20
          transition-transform duration-300 ease-in-out
          ${isSideBarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${!isSideBarOpen && 'md:hidden'}
        `}>
          <Sidebar />
        </div>

        {/* Viewer Area */}
        <section className="flex-1 relative bg-slate-100 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto scroll-smooth custom-scrollbar">
            <PDFViewer className="mx-auto" />
          </div>
        </section>

        {/* Action Panel */}
        <div className={`
          fixed md:relative inset-y-0 right-0 z-[45] md:z-20
          transition-transform duration-300 ease-in-out
          ${isVoicePanelOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          ${!isVoicePanelOpen && 'md:hidden'}
        `}>
          <aside className="w-80 h-full border-l bg-white/80 backdrop-blur-xl flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.1)] md:shadow-[-4px_0_12px_rgba(0,0,0,0.02)]">
            <VoicePanel speech={speech} />
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-10 border-t bg-white px-6 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest z-30 shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> <span className="hidden xs:inline">System Online</span></span>
        </div>
        <div>v1.0.0</div>
      </footer>
    </div>
  )
}
