import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main TSX loading...')

const rootElement = document.getElementById('root')
if (!rootElement) {
  document.body.innerHTML = '<h1>Root element not found!</h1>'
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(<App />)
