/**
 * Medical Transcript Processor
 * 
 * This script processes medical call transcripts:
 * 1. Summarizes the transcript using OpenAI
 * 2. Classifies the summary using Hugging Face or falls back to keyword-based classification
 * 
 * Usage:
 * ```
 * import { processTranscript, processSummary } from './medical_processor.js';
 * 
 * // Process a transcript (both summarize and classify)
 * const result = await processTranscript("Patient reports severe chest pain...");
 * 
 * // Classify an existing summary
 * const classification = await processSummary("Patient experiencing chest pain with shortness of breath...");
 * ```
 */

// Function to summarize a transcript using OpenAI
async function summarizeTranscript(transcript, openAIKey) {
  if (!transcript || transcript.trim() === '') {
    throw new Error("No transcript provided");
  }

  if (!openAIKey) {
    throw new Error("OpenAI API key is required");
  }

  try {
    console.log("Generating summary with OpenAI...");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a medical assistant analyzing call transcripts. Create a concise summary focusing on key health information, symptoms, concerns, and anything that might require clinical attention.'
          },
          {
            role: 'user',
            content: `Please summarize the following call transcript, focusing on medical information and potential concerns:\n\n${transcript}`
          }
        ],
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error summarizing transcript:", error);
    throw new Error(`Failed to summarize transcript: ${error.message}`);
  }
}

// Function to classify a summary using Hugging Face
async function classifySummary(summary, huggingFaceKey) {
  if (!summary || summary.trim() === '') {
    throw new Error("No summary provided");
  }

  console.log("Classifying summary...");
  
  try {
    // Try Hugging Face API if API key is provided
    if (huggingFaceKey) {
      try {
        // Using BART model for zero-shot classification
        const MODEL = "facebook/bart-large-mnli";
        
        console.log(`Using Hugging Face model: ${MODEL}`);
        console.log("Sending request to Hugging Face API...");
        
        // Create a controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${huggingFaceKey}`,
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({
            inputs: summary,
            parameters: {
              candidate_labels: ["needs clinical attention", "normal"]
            }
          }),
          signal: controller.signal
        });
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        console.log(`API Response status: ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Hugging Face API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Raw Hugging Face response:", JSON.stringify(data, null, 2));
        
        // BART zero-shot classification returns a different format
        if (!data.labels || !data.scores) {
          throw new Error("Unexpected response format from Hugging Face API");
        }
        
        // Find the index of each label
        const attentionLabelIndex = data.labels.indexOf("needs clinical attention");
        const normalLabelIndex = data.labels.indexOf("normal");
        
        if (attentionLabelIndex === -1 || normalLabelIndex === -1) {
          throw new Error("Expected labels not found in the response");
        }
        
        // Process the scores (convert to percentages)
        const attentionScore = data.scores[attentionLabelIndex] * 100;
        const normalScore = data.scores[normalLabelIndex] * 100;
        
        console.log(`Needs attention score: ${attentionScore.toFixed(2)}%`);
        console.log(`Normal score: ${normalScore.toFixed(2)}%`);
        
        // Determine result (if attention score > 50%, needs attention)
        const needsAttention = attentionScore > 50;
        const result = needsAttention 
          ? "⚠️ Needs Clinical Attention" 
          : "✅ Normal";
        
        return {
          labels: ["normal", "needs clinical attention"],
          scores: [normalScore.toFixed(2), attentionScore.toFixed(2)],
          result: result,
          model: MODEL,
          method: "huggingface-zero-shot"
        };
      } catch (error) {
        console.warn("Hugging Face classification failed:", error.message);
        if (error.name === 'AbortError') {
          console.log("Request timed out after 30 seconds");
        }
        console.log("Falling back to keyword-based classification...");
      }
    } else {
      console.log("No Hugging Face API key provided");
    }
    
    // Fallback to keyword-based classification
    console.log("Using keyword-based classification...");
    return classifyWithKeywords(summary);
    
  } catch (error) {
    console.error("Error classifying summary:", error);
    throw new Error(`Failed to classify summary: ${error.message}`);
  }
}

// Keyword-based classification function (fallback method)
function classifyWithKeywords(text) {
  const keywords = [
    'emergency', 'urgent', 'immediate', 'severe', 'extreme', 
    'critical', 'acute', 'danger', 'worsening', 'deteriorating',
    'unbearable', 'intense', 'excruciating', 'collapse', 'unconscious',
    'bleeding', 'chest pain', 'difficulty breathing', 'confusion',
    'infection', 'fever', 'swelling', 'discharge', 'pain'
  ];
  
  const lowercaseText = text.toLowerCase();
  const matches = keywords.filter(keyword => 
    lowercaseText.includes(keyword.toLowerCase())
  );
  
  if (matches.length > 0) {
    return {
      labels: ["normal", "needs clinical attention"],
      scores: [10, 90],
      matched_keywords: matches,
      result: "⚠️ Needs Clinical Attention",
      method: "keyword"
    };
  } else {
    return {
      labels: ["normal", "needs clinical attention"],
      scores: [90, 10],
      result: "✅ Normal",
      method: "keyword"
    };
  }
}

/**
 * Process a transcript: Summarize and classify
 * @param {string} transcript - The medical transcript text
 * @param {Object} options - Processing options
 * @param {string} options.openAIKey - OpenAI API key
 * @param {string} options.huggingFaceKey - HuggingFace API key (optional)
 * @returns {Object} The processing result with summary and classification
 */
async function processTranscript(transcript, options = {}) {
  const openAIKey = options.openAIKey || process.env.OPENAI_API_KEY;
  const huggingFaceKey = options.huggingFaceKey || process.env.HUGGINGFACE_API_KEY;
  
  try {
    // Step 1: Generate summary
    const summary = await summarizeTranscript(transcript, openAIKey);
    
    // Step 2: Classify the summary
    const classification = await classifySummary(summary, huggingFaceKey);
    
    // Return combined results
    return {
      success: true,
      summary,
      classification
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Process an existing summary: Classify only
 * @param {string} summary - The summary text to classify
 * @param {Object} options - Processing options
 * @param {string} options.huggingFaceKey - HuggingFace API key (optional)
 * @returns {Object} The classification result
 */
async function processSummary(summary, options = {}) {
  const huggingFaceKey = options.huggingFaceKey || process.env.HUGGINGFACE_API_KEY;
  
  try {
    const classification = await classifySummary(summary, huggingFaceKey);
    
    return {
      success: true,
      classification
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

export { 
  processTranscript, 
  processSummary,
  summarizeTranscript,
  classifySummary,
  classifyWithKeywords
}; 