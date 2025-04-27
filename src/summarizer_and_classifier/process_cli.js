#!/usr/bin/env node

/**
 * CLI script to process medical transcripts
 *
 * Usage:
 * 1. Process transcript from data directory (data/transcript.txt):
 *    node process_cli.js
 *
 * 2. Process a specific transcript file:
 *    node process_cli.js --file path/to/transcript.txt
 *
 * 3. Process a transcript from text:
 *    node process_cli.js --text "Patient reports severe chest pain..."
 *
 * 4. Classify an existing summary:
 *    node process_cli.js --summary "Patient experiencing chest pain with shortness of breath..."
 *
 * Options:
 *   --output path/to/save/results.json  Save results to a file
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { processTranscript, processSummary } from "./medical_processor.js";

// Setup paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../..");
const DATA_DIR = path.join(PROJECT_ROOT, "data");
const DEFAULT_TRANSCRIPT_FILE = path.join(DATA_DIR, "transcript.txt");
const DEFAULT_SUMMARY_FILE = path.join(DATA_DIR, "summary.txt");
const DEFAULT_OUTPUT_FILE = path.join(DATA_DIR, "output.txt");

// Load .env file if it exists
try {
  const dotenv = await import("dotenv");
  const envPath = path.join(PROJECT_ROOT, ".env.local");
  console.log(`Loading environment variables from: ${envPath}`);
  dotenv.config({ path: envPath });

  // Debug output to verify API key loading
  if (process.env.OPENAI_API_KEY) {
    console.log("✅ OpenAI API key loaded successfully");
  } else {
    console.log("❌ OpenAI API key not found after loading .local.env");
  }
} catch (error) {
  console.log("Error loading environment variables:", error.message);
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));

    // Verify we have required API keys
    if (!process.env.OPENAI_API_KEY && !args.openaiKey) {
      console.error(
        "Error: OpenAI API key not found. Set OPENAI_API_KEY environment variable or use --openai-key option."
      );
      process.exit(1);
    }

    // Set API keys from environment or command line
    const options = {
      openAIKey: args.openaiKey || process.env.OPENAI_API_KEY,
      huggingFaceKey: args.huggingfaceKey || process.env.HUGGINGFACE_API_KEY,
    };

    console.log("Processing with options:", {
      openAIKey: options.openAIKey ? "***" : "Not provided",
      huggingFaceKey: options.huggingFaceKey
        ? "***"
        : "Not provided (will use keyword fallback)",
    });

    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      console.log(`Creating data directory: ${DATA_DIR}`);
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let result;

    // Process from command line argument file
    if (args.file) {
      console.log(`Reading transcript from file: ${DEFAULT_TRANSCRIPT_FILE}`);
      const transcript = fs.readFileSync(DEFAULT_TRANSCRIPT_FILE, "utf-8");
      result = await processTranscript(transcript, options);
    }
    // Process from text argument
    else if (args.text) {
      console.log("Processing transcript from command line argument");
      result = await processTranscript(args.text, options);
    }
    // Classify existing summary
    else if (args.summary) {
      console.log("Classifying existing summary");
      result = await processSummary(args.summary, options);
    }
    // Default: Process from default transcript file
    else {
      if (fs.existsSync(DEFAULT_TRANSCRIPT_FILE)) {
        console.log(
          `Reading transcript from default file: ${DEFAULT_TRANSCRIPT_FILE}`
        );
        const transcript = fs.readFileSync(DEFAULT_TRANSCRIPT_FILE, "utf-8");
        result = await processTranscript(transcript, options);
      } else {
        console.error(
          `Error: Default transcript file not found at ${DEFAULT_TRANSCRIPT_FILE}`
        );
        console.error(
          "Please create this file or specify --file, --text, or --summary argument"
        );
        showHelp();
        process.exit(1);
      }
    }

    // Print result
    console.log("\n== RESULTS ==");
    if (result.success) {
      if (result.summary) {
        console.log("\nSUMMARY:");
        console.log(result.summary);

        // Save summary to file
        fs.writeFileSync(DEFAULT_SUMMARY_FILE, result.summary, "utf-8");
        console.log(`Summary saved to: ${DEFAULT_SUMMARY_FILE}`);
      }

      if (result.classification) {
        console.log("\nCLASSIFICATION:");
        console.log(`Result: ${result.classification.result}`);
        console.log(`Method: ${result.classification.method}`);
        console.log(
          `Scores: ${result.classification.labels[0]}: ${result.classification.scores[0]}%, ` +
            `${result.classification.labels[1]}: ${result.classification.scores[1]}%`
        );

        if (result.classification.matched_keywords) {
          console.log(
            `Matched Keywords: ${result.classification.matched_keywords.join(
              ", "
            )}`
          );
        }

        // Save classification to default output file if not specified otherwise
        const outputFile = args.output || DEFAULT_OUTPUT_FILE;
        fs.writeFileSync(
          outputFile,
          JSON.stringify(result.classification, null, 2),
          "utf-8"
        );
        console.log(`\nClassification saved to: ${outputFile}`);
      }
    } else {
      console.error(`Error: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Parse command line arguments
function parseArgs(args) {
  const result = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith("--")) {
      const key = arg.slice(2);

      // Handle flags without values
      if (i + 1 >= args.length || args[i + 1].startsWith("--")) {
        result[key] = true;
      } else {
        result[key] = args[i + 1];
        i++; // Skip the value
      }
    }
  }

  return result;
}

// Show help message
function showHelp() {
  console.log(`
Medical Transcript Processor CLI

Usage:
  node process_cli.js                                   Process default file (data/transcript.txt)
  node process_cli.js --file path/to/transcript.txt     Process specific file
  node process_cli.js --text "Patient reports..."       Process text from command line
  node process_cli.js --summary "Patient has..."        Classify existing summary

Options:
  --output path/to/save/results.json                    Save results to custom file (default: data/output.txt)
  --openai-key YOUR_API_KEY                             OpenAI API key (alternative to env var)
  --huggingface-key YOUR_API_KEY                        HuggingFace API key (alternative to env var)
  --help                                                Show this help message
  `);
}

// Run the main function
main();
