import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/md-light-indigo/theme.css";
import 'primereact/resources/primereact.min.css';
import "primeicons/primeicons.css"; //icons
import 'primeflex/primeflex.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider>
    <App />
    </PrimeReactProvider> 
  </StrictMode>,
)
