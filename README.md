# 📄 pdfreaderX

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.1-blue?style=for-the-badge&logo=semantic-release" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/platform-Web%20%7C%20Electron-orange?style=for-the-badge&logo=desktop-computer" alt="Platform">
  <img src="https://img.shields.io/badge/react-18-blue?style=for-the-badge&logo=react" alt="React">
</p>

> *"Universal access to knowledge is a collective responsibility. Sustainability fuels the mission."*

**pdfreaderX** is a high-performance, institutional-grade PDF document platform engineered for the modern web. It provides a specialized, privacy-centric environment for reading, annotating, and listening to PDF documents with advanced text-to-speech capabilities.

---

## ✨ What's New in v1.0.1

| Feature | Description |
|---------|-------------|
| 🔊 **Continuous Reading** | Automatically reads through entire PDF, page by page |
| 💾 **Audio Export** | Save TTS audio as MP3 (Google/OpenAI providers) |
| 🎛️ **Voice Panel Redesign** | Clean UI with Prev/Next page controls |
| 🖨️ **Print Support** | Print current page via browser dialog |
| 🔖 **Bookmark Persistence** | Bookmarks saved to localStorage |
| 🖥️ **Electron Desktop** | Windows .exe installer (114 MB) |
| 🐛 **Bug Fixes** | Memory leaks, continuous mode, worker path, CORS |

---

## 📥 Download

### Windows Desktop App
| Type | File | Size |
|------|------|------|
| Installer | [PDFReaderX Setup 1.0.1.exe](https://github.com/wikicrafter/pdfreaderX/releases/download/v1.0.1/PDFReaderX%20Setup%201.0.1.exe) | 119 MB |
| Portable | [PDFReaderX-1.0.1-portable.zip](https://github.com/wikicrafter/pdfreaderX/releases/download/v1.0.1/PDFReaderX-1.0.1-portable.zip) | 173 MB |

### Web Version
Access the **pdfreaderX** web app directly at: pdfreaderx.itforsec.com/

---

## 🚀 Key Features

### 1. Text-to-Speech Engine
- **3 TTS Providers**: Browser (free), OpenAI (ultra-realistic), Google Neural2 (free tier)
- **Continuous Mode**: Auto-reads all pages sequentially
- **Audio Export**: Download generated audio as MP3
- **Speed Control**: Adjustable rate (0.25x - 4.0x)
- **Voice Selection**: Multiple voices per provider

### 2. PDF Reading
- 📖 High-fidelity PDF.js rendering
- 🔍 Zoom (10% - 500%) + rotation (90° increments)
- 📑 Page navigation (prev/next + jump to page)
- 🔎 Search through entire document
- 🖼️ Thumbnail sidebar
- 🔖 Bookmarks with localStorage persistence
- 🖨️ Print support

### 3. Privacy & Security
- 🔒 **Zero Tracking**: No analytics, no telemetry
- 💻 **Local Processing**: PDF.js worker runs locally
- 🔑 **API Keys**: Stored on-device only
- 🌐 **No External Servers**: Keys go directly to OpenAI/Google

### 4. Cross-Platform
| Platform | Status | Description |
|----------|--------|-------------|
| 🌐 Web | ✅ | PWA installable |
| 🪟 Windows | ✅ | .exe installer |
| 🍎 macOS | 🔄 | Build config ready |
| 🐧 Linux | 🔄 | Build config ready |
| 📱 iOS/Android | ✅ | Responsive |

---

## 📸 Screenshots


<img width="1841" height="903" alt="image" src="https://github.com/user-attachments/assets/5452d56b-2d9a-4070-9fd7-5d33e420429f" />



---

## 🛠️ Installation

### Quick Start (Web)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Production Build (Web)
```bash
# Build for production
npm run build

# Output: dist/ folder
```

### Electron Desktop App
```bash
# Development mode
npm run electron:dev

# Build Windows installer
npm run electron:build

# Output: release/PDFReaderX Setup 1.0.1.exe
```

---

## ⚙️ Configuration

### Text-to-Speech Providers

| Provider | Quality | Cost | Audio Export |
|----------|---------|------|--------------|
| **Browser** | Good | Free | ❌ | 
| **OpenAI** | Ultra-realistic | Pay-per-use | ✅ 
| **Google** | Neural2 | Free tier | ✅ |

### Getting API Keys

**OpenAI** (https://platform.openai.com/api-keys)
```
- Model: tts-1
- Cost: ~$0.003/1,000 characters
- Voices: alloy, echo, fable, onyx, nova, shimmer
```

**Google Cloud** (https://cloud.google.com/text-to-speech)
```
- Free tier: 4M characters/month
- Premium: $4/1M characters
- Voices: Neural2 (18 languages)
```

---

## 📁 Project Structure

```
pdfreaderX/
├── src/
│   ├── components/
│   │   ├── Controls/
│   │   │   ├── Toolbar.tsx       # Main toolbar
│   │   │   └── VoicePanel.tsx    # TTS controls
│   │   ├── PDFViewer.tsx         # PDF rendering
│   │   ├── Sidebar.tsx           # Navigation
│   │   ├── Thumbnail.tsx        # Page thumbnails
│   │   └── Settings/
│   │       └── SettingsModal.tsx # Settings
│   ├── hooks/
│   │   └── useSpeech.ts        # TTS logic
│   ├── store/
│   │   └── usePdfStore.ts     # Zustand state
│   └── App.tsx                # Main app
├── electron/
│   ├── main.cjs               # Electron main
│   └── preload.cjs            # Preload script
├── dist/                      # Built web files
├── release/                   # Built executables
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🐛 Known Limitations

| Issue | Status | Workaround |
|-------|--------|------------|
| Large PDFs (>50MB) | ⚠️ May be slow | Use local files |
| Browser TTS export | ❌ Not supported | Switch to Google/OpenAI |
| Print formatting | ⚠️ Browser-dependent | Adjust zoom before print |
| Shared devices | ⚠️ Keys visible | Clear localStorage |

---

## 🔮 Future Roadmap

### v1.0.2 (Enhancements)
- [ ] Error boundaries for better error handling
- [ ] Keyboard shortcuts (arrow keys for navigation)
- [ ] Recent files history
- [ ] Dark mode toggle

### v1.1 (Advanced Features)
- [ ] Table of Contents extraction (PDF outline)
- [ ] Persistent text highlights/annotations
- [ ] Multi-page audio batch export
- [ ] Custom page range selection

### v1.2 (AI Integration)
- [ ] Local LLM via Ollama for Q&A
- [ ] Transformers.js summarization
- [ ] RAG-based semantic search
- [ ] Auto-summarize pages

### v1.3 (Native Desktop)
- [ ] System tray (minimize to tray)
- [ ] Global media key support
- [ ] File association (.pdf)
- [ ] Auto-updater
- [ ] macOS/Linux builds

---

## 🤝 Support & Contribution

### Found pdfreaderX Valuable?

| Action | Link |
|-------|------|
| ⭐ Star the repo | https://github.com/wikicrafter/pdfreaderX |
| 💰 Support | https://ko-fi.com/gigaa |
| 🔔 Follow | https://github.com/wikicrafter/pdfreaderX |

### Need Help?

1. Check browser console for errors
2. Verify API keys in Settings → Voice Engine
3. Try local PDF files first
4. Clear localStorage to reset: `localStorage.clear()`

---

## 📜 License

```
MIT License

Copyright (c) 2026 pdfreaderX
Copyright (c) 2026 wikicrafter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

---

<p align="center">
  <img src="https://img.shields.io/badge/Built%20with-React%20%2B%20Electron-blue?style=for-the-badge&logo=react" alt="Built with">
  <img src="https://img.shields.io/badge/Made%20with-💜-red?style=for-the-badge" alt="Made with love">
</p>

**Version**: 1.0.1  
**Author**: [wikicrafter](https://github.com/wikicrafter)  
**License**: MIT © 2026
