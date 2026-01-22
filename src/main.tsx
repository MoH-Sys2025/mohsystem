import {StrictMode, React} from "react";
import ReactDOM from "react-dom/client";
import './App.css'
import './index.css'
import App from './App.tsx'
import "leaflet/dist/leaflet.css";
import {BrowserRouter} from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
          <App />
  </StrictMode>
);
