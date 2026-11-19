import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

try {
  registerSW({immediate: false});
} catch {
  // Ignore SW registration errors in restricted preview contexts
}
