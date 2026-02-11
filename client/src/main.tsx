import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  console.warn("Missing VITE_CLERK_PUBLISHABLE_KEY. Add it to .env.local for Clerk auth.");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={publishableKey || ""}>
    <App />
  </ClerkProvider>
);
