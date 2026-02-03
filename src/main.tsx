import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App/App";

import "izitoast/dist/css/iziToast.min.css"; // Добавьте эту строку
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
