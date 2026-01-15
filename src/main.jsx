import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-icons/font/bootstrap-icons.css'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx';
import Header from './components/Header.jsx';
import MenuBar from './components/MenuBar.jsx';



createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <AppContextProvider>
      

      <App />
    </AppContextProvider>
  </BrowserRouter>,
)
