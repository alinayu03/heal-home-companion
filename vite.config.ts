import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const apiKey = process.env.VITE_VAPI_API_KEY; // Access the API key
  const agentId = process.env.VITE_VAPI_AGENT_ID; // Access the Agent ID

  console.log("VAPI API Key:", apiKey); // Optional: Log to check if env var is being accessed

  return {
    server: {
      host: "::",
      port: 3000,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Optionally expose these to your client-side code
      __VAPI_API_KEY__: JSON.stringify(apiKey),
      __VAPI_AGENT_ID__: JSON.stringify(agentId),
    },
  };
});
