
/**
 * DEEMACH AI SERVICE ENGINE
 * DEVELOPER: Deon86Van03Vuuren21
 * CONTACT: deeplastics11@gmail.com
 * COPYRIGHT: © 2025 Deon86Van03Vuuren21. All Rights Reserved.
 */

import { GoogleGenAI, Modality, Type, ThinkingLevel } from "@google/genai";
import { getMimeType, getBase64Data } from "../lib/imageUtils";

// Global timeout for AI requests (60 seconds for Pro, 45 for Flash - increased for searches)
const PRO_TIMEOUT = 60000;
const FLASH_TIMEOUT = 45000;

// Always use process.env.GEMINI_API_KEY directly in the client initialization.
/**
 * API KEY LOCKING INSTRUCTIONS:
 * 1. For AI Studio Preview: The key is automatically managed via Environment Variables.
 * 2. For AAB/APK (Mobile) Export:
 *    - To "lock" your key for mobile, you MUST provide it in your build environment.
 *    - Create a file named '.env' in your project root after exporting.
 *    - Add line: VITE_GEMINI_API_KEY=your_key_here
 *    - The code below will automatically pick it up and bundle it into your app.
 *    - WARNING: Hardcoding keys directly in code is discouraged for security, but using 
 *      VITE_ prefixed environment variables is the standard way to include them in mobile builds.
 */
const API_KEY = "AIzaSyA6HB7aWNr9PV7J2Tng0WDkdWuy6o0_ISA";

const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: API_KEY });
};

const handleGeminiError = (error: any, context: string) => {
  console.error(`Gemini Service Error (${context}):`, error);
  
  const errorMessage = error?.message || String(error);
  
  if (errorMessage.includes("403") || errorMessage.includes("PERMISSION_DENIED")) {
    throw new Error("Access denied. Please provide a valid API key.");
  }

  if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }

  if (errorMessage.includes("503") || errorMessage.includes("UNAVAILABLE") || errorMessage.includes("high demand")) {
    throw new Error("Service overloaded. Please try again later.");
  }

  if (errorMessage.includes("timed out") || errorMessage.includes("timeout")) {
    throw new Error("Request timed out. Please try again.");
  }
  
  throw new Error("Request failed. Please try again.");
};

// Generic wrapper for AI calls with timeout and retry
const withTimeoutAndRetry = async <T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  retries: number = 2
): Promise<T> => {
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`Request timed out after ${timeoutMs/1000} seconds`)), timeoutMs)
      );
      return await Promise.race([fn(), timeoutPromise]);
    } catch (error: any) {
      lastError = error;
      // Only retry on timeouts or 5xx errors
      const isTimeout = error.message?.includes("timed out");
      const isRetryable = isTimeout || error.message?.includes("500") || error.message?.includes("503");
      
      if (i < retries && isRetryable) {
        console.warn(`Retrying AI call (attempt ${i + 1}/${retries}) due to: ${error.message}`);
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      break;
    }
  }
  throw lastError;
};

// Caching logic for AI responses to save costs
const CACHE_KEY = "deemech_ai_cache_v1";
const getCache = (key: string) => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    const item = cache[key];
    if (item && Date.now() - item.timestamp < 1000 * 60 * 60 * 24 * 7) { // 7 days cache
      return item.data;
    }
    return null;
  } catch { return null; }
};

const setCache = (key: string, data: any) => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    // Limit cache size: remove oldest items if more than 50
    const keys = Object.keys(cache);
    if (keys.length > 50) {
      delete cache[keys[0]];
    }
    cache[key] = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) { 
    console.warn("Cache write failed, clearing cache", e);
    localStorage.removeItem(CACHE_KEY);
  }
};

export const getGeminiResponse = async (prompt: string, history: any[] = [], imageBase64?: string) => {
  const cacheKey = `chat_${prompt}_${JSON.stringify(history)}`;
  const cached = getCache(cacheKey);
  if (cached && !imageBase64) return cached;

  const ai = getAIInstance();
  const model = "gemini-3-flash-preview";

  const result = await withTimeoutAndRetry(async () => {
    const contents: any[] = [...history];
    
    const currentParts: any[] = [{ text: prompt }];
    if (imageBase64) {
      currentParts.push({
        inlineData: {
          mimeType: getMimeType(imageBase64),
          data: getBase64Data(imageBase64)
        }
      });
    }
    
    contents.push({ role: 'user', parts: currentParts });

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: "You are a world-class master mechanic with 40 years of experience. You provide precise, technical, and safe automotive advice. Use technical terms correctly but explain them if they are complex. Focus on troubleshooting steps, torque specs, and safety warnings. Keep responses concise but thorough.",
      }
    });
    return response.text || "";
  }, PRO_TIMEOUT).catch(e => handleGeminiError(e, "getGeminiResponse"));

  if (!imageBase64) setCache(cacheKey, result);
  return result;
};

export const getDiagnosticQuestions = async (symptom: string, vehicleInfo: string) => {
  const cacheKey = `diag_q_${symptom}_${vehicleInfo}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const ai = getAIInstance();
  const result = await withTimeoutAndRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user reports: "${symptom}" on a "${vehicleInfo}". As a master mechanic, ask 3 highly specific technical questions to help narrow down the cause. Focus on sounds, conditions (hot/cold/speed), and recent work. Return only the questions as a numbered list.`,
      config: {
        systemInstruction: "Be concise and professional. Ask only 3 questions.",
      }
    });
    return response.text || "";
  }, FLASH_TIMEOUT).catch(e => handleGeminiError(e, "getDiagnosticQuestions"));

  setCache(cacheKey, result);
  return result;
};

export const getFinalDiagnosticReport = async (symptom: string, vehicleInfo: string, answers: string) => {
  const cacheKey = `diag_report_${symptom}_${vehicleInfo}_${answers}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const ai = getAIInstance();
  const result = await withTimeoutAndRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Switched to flash for cost savings
      contents: `Vehicle: ${vehicleInfo}. Symptom: ${symptom}. Mechanic Answers: ${answers}. Provide a structured diagnostic report including: 1. Probable Causes (ranked), 2. Next Diagnostic Steps (using tools like multimeter or scanner), 3. Estimated Repair Complexity.`,
      config: {
        systemInstruction: "You are a lead shop foreman. Provide high-quality technical insights. Use Markdown formatting for the report."
      }
    });
    return response.text || "";
  }, PRO_TIMEOUT).catch(e => handleGeminiError(e, "getFinalDiagnosticReport"));

  setCache(cacheKey, result);
  return result;
};

export const getDailyMechanicalTip = async () => {
  const ai = getAIInstance();
  return withTimeoutAndRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Provide one short, high-impact 'Pro Tip' for a professional mechanic. It should be about a specific maintenance task, a diagnostic trick, or a safety warning. Keep it under 30 words. Do not include introductory text.",
    });
    return response.text || "";
  }, FLASH_TIMEOUT).catch(e => handleGeminiError(e, "getDailyMechanicalTip"));
};

export const analyzeComponentVision = async (imageBase64: string) => {
  const ai = getAIInstance();
  return withTimeoutAndRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Switched to flash for cost savings
      contents: {
        parts: [
          { 
            inlineData: { 
              mimeType: getMimeType(imageBase64), 
              data: getBase64Data(imageBase64) 
            } 
          },
          { text: "Identify this automotive component. Provide a detailed technical report including: 1. Part Name (and common aliases), 2. Common failure symptoms (what to look/listen for), 3. Technical specifications (torque settings, clearances, or electrical values if applicable), 4. Safety precautions for removal and installation." }
        ]
      },
      config: {
        systemInstruction: "You are a professional shop foreman. Be extremely precise. If you don't recognize the part, say so. Do not guess on torque specs; if unknown, provide general bolt-size-based torque guidelines. Use Markdown for formatting."
      }
    });
    return response.text || "";
  }, PRO_TIMEOUT).catch(e => handleGeminiError(e, "analyzeComponentVision"));
};

export const searchTSBs = async (vehicle: string, problem: string) => {
  const cacheKey = `tsb_${vehicle}_${problem}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const ai = getAIInstance();
  const result = await withTimeoutAndRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search for official Technical Service Bulletins (TSBs), recalls, and manufacturer hidden warranty patterns for: ${vehicle} relating to: ${problem}. Include specific TSB numbers and repair kit numbers if found.`,
      config: {
        tools: [{ googleSearch: {} }],
        toolConfig: { includeServerSideToolInvocations: true }
      },
    });

    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.filter((c: any) => c.web) || []
    };
  }, FLASH_TIMEOUT).catch(e => handleGeminiError(e, "searchTSBs"));

  setCache(cacheKey, result);
  return result;
};

export const getComponentTestSteps = async (component: string) => {
  const cacheKey = `test_steps_${component}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const ai = getAIInstance();
  const result = await withTimeoutAndRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a step-by-step electrical test procedure for: ${component}. Include: Multimeter settings (Volts/Ohms), specific pin numbers if common, and 'Pass/Fail' voltage/resistance thresholds.`,
    });
    return response.text || "";
  }, FLASH_TIMEOUT).catch(e => handleGeminiError(e, "getComponentTestSteps"));

  setCache(cacheKey, result);
  return result;
};

// Quick Specs lookup
export const getQuickSpecs = async (vehicle: string) => {
  const cacheKey = `quick_specs_${vehicle}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const ai = getAIInstance();
  const result = await withTimeoutAndRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a 'Quick Spec Sheet' for: ${vehicle}. Include: Oil Type/Capacity, Coolant Type, Spark Plug Gap, Firing Order, Lug Nut Torque, and common Drain Plug torque. Format as a clean technical table if possible.`,
      config: {
        tools: [{ googleSearch: {} }],
        toolConfig: { includeServerSideToolInvocations: true }
      },
    });
    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }, FLASH_TIMEOUT).catch(e => handleGeminiError(e, "getQuickSpecs"));

  setCache(cacheKey, result);
  return result;
};

export const getTorqueSpecs = async (vehicle: string, component: string) => {
  const cacheKey = `torque_${vehicle}_${component}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const ai = getAIInstance();
  const result = await withTimeoutAndRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide the precise factory torque specifications for: ${component} on a ${vehicle}. Include: 1. Main fastener torque (ft-lb and Nm), 2. Any multi-stage tightening sequences (e.g. Stage 1: 20ft-lb, Stage 2: 90 degrees), 3. Bolt reuse instructions (e.g. 'Replace if TTY'), 4. Thread lubricant requirements (Dry, Oil, or Loctite).`,
      config: {
        tools: [{ googleSearch: {} }],
        toolConfig: { includeServerSideToolInvocations: true }
      },
    });
    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }, FLASH_TIMEOUT).catch(e => handleGeminiError(e, "getTorqueSpecs"));

  setCache(cacheKey, result);
  return result;
};

export const getNearbyShops = async (query: string, location?: { latitude: number, longitude: number }) => {
  const cacheKey = `shops_${query}_${location?.latitude}_${location?.longitude}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const ai = getAIInstance();
  const result = await withTimeoutAndRetry(async () => {
    const promptLocation = location 
      ? `near my exact GPS coordinates (Latitude: ${location.latitude}, Longitude: ${location.longitude})`
      : `near my current location`;
      
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find the best and closest ${query} ${promptLocation}. Provide details on their expertise and why they are recommended.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          includeServerSideToolInvocations: true,
          retrievalConfig: {
            latLng: location ? {
              latitude: location.latitude,
              longitude: location.longitude
            } : undefined
          }
        },
      },
    });

    return {
      text: response.text || "",
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }, FLASH_TIMEOUT).catch(e => handleGeminiError(e, "getNearbyShops"));

  setCache(cacheKey, result);
  return result;
};

export const getRepairGuide = async (vehicle: string, task: string) => {
  const cacheKey = `repair_guide_${vehicle}_${task}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const ai = getAIInstance();
  const result = await withTimeoutAndRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a comprehensive, professional repair guide for: ${task} on a ${vehicle}. Include: 1. Required Tools & Supplies, 2. Safety Precautions, 3. Step-by-step removal and installation instructions, 4. Critical Torque Specifications, 5. Pro-tips for avoiding common mistakes.`,
      config: {
        tools: [{ googleSearch: {} }],
        toolConfig: { includeServerSideToolInvocations: true }
      },
    });
    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }, FLASH_TIMEOUT).catch(e => handleGeminiError(e, "getRepairGuide"));

  setCache(cacheKey, result);
  return result;
};

export const searchParts = async (vehicle: string, partDescription: string, location?: { latitude: number, longitude: number }) => {
  const cacheKey = `parts_${vehicle}_${partDescription}_${location?.latitude}_${location?.longitude}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const ai = getAIInstance();
  const result = await withTimeoutAndRetry(async () => {
    // Avoid using both googleSearch and googleMaps inside the same config as they may conflict and trigger 400 Bad Request
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find exact part numbers and detailed technical specifications for "${partDescription}" on a "${vehicle}". Also, identify the closest brick-and-mortar stores or major retailers that likely stock this part ${location ? `near my exact GPS coordinates (Latitude: ${location.latitude}, Longitude: ${location.longitude})` : 'near my current location'}. Provide pricing estimates if available.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }, FLASH_TIMEOUT).catch(e => handleGeminiError(e, "searchParts"));

  setCache(cacheKey, result);
  return result;
};

// PCM Encoding/Decoding Helpers
export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createPcmBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encodeBase64(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}
