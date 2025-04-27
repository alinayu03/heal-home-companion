/**
 * Example usage of the Medical Transcript Processor
 * 
 * Run with:
 * node example.js
 */

import { processSummary } from './medical_processor.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

// Load environment variables from .env.local
try {
  const dotenv = await import('dotenv');
  const envPath = path.join(projectRoot, '.env.local');
  console.log(`Loading environment variables from: ${envPath}`);
  dotenv.config({ path: envPath });
  
  // Verify if Hugging Face API key is loaded
  if (process.env.HUGGINGFACE_API_KEY) {
    console.log("✅ Hugging Face API key loaded successfully");
  } else {
    console.log("❌ Hugging Face API key not found in .env.local");
  }
} catch (error) {
  console.log("Error loading environment variables:", error.message);
}

// Example summary
const summary = "Patient experiencing mild knee swelling and occasional numbness.";

// Options with API key
const options = {
  huggingFaceKey: process.env.HUGGINGFACE_API_KEY
};

// Run the classification
console.log("Processing summary:", summary);
processSummary(summary, options)
  .then(result => {
    console.log("\n=== Results ===");
    console.log(JSON.stringify(result, null, 2));
  })
  .catch(error => {
    console.error("Error:", error);
  }); 