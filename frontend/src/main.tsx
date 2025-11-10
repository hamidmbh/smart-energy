import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeDatabase } from "./services/database";

// Initialize database with seed data
initializeDatabase();

createRoot(document.getElementById("root")!).render(<App />);
