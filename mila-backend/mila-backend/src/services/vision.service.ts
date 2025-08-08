// COMMENTED OUT: Google Cloud Vision API implementation
// import { ImageAnnotatorClient } from '@google-cloud/vision';

// // WHAT-IT-DOES: Initializes the Google Cloud Vision API client
// // HOW-TO-USE: The client will use the service account key file specified in the environment variable
// const client = new ImageAnnotatorClient({
//   keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE, // Path to your service account key file
//   projectId: process.env.GOOGLE_CLOUD_PROJECT_ID, // Your Google Cloud project ID
// });

// Load environment variables from .env file (make sure to install dotenv)
import dotenv from 'dotenv';
dotenv.config();

// Groq API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

if (!GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY in environment variables');
}

/**
 * WHAT-IT-DOES: Analyzes an image and description using Groq to extract identifiers
 * HOW-TO-USE: Pass an image URL, description, and category to get back an array of extracted identifiers
 */
export async function analyzeWithGroq(
  imageUrl: string,
  description: string,
  category: string
): Promise<string[]> {
  try {
    console.log('Analyzing with Groq:', { imageUrl, description, category });

    // Prepare the prompt for Groq
    const prompt = `Analyze this item and extract any unique identifiers from the image and description.
    Focus on extracting:
    1. IMEI numbers (for phones/devices)
    2. NIC/ID card numbers
    3. License plate numbers
    4. Serial numbers
    5. Any other unique identifiers specific to the category
    
    Image URL: ${imageUrl}
    Description: ${description}
    Category: ${category}
    
    Return ONLY the extracted identifiers as a comma-separated list. If no identifiers are found, return "None".`;

    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent extraction
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API request failed with status ${response.status}`);
    }

    const data: any = await response.json();
    const result = data.choices[0]?.message?.content || '';

    console.log('Groq analysis result:', result);

    // Parse the result to extract identifiers
    if (result.toLowerCase().includes('none') || !result.trim()) {
      return [];
    }

    // Split by comma and clean up the identifiers
    const identifiers = result
      .split(',')
      .map((id: string) => id.trim())
      .filter((id: string) => id.length > 0);

    console.log('Extracted identifiers:', identifiers);
    return identifiers;

  } catch (error: any) {
    console.error('Error analyzing with Groq:', error);
    throw new Error(`Failed to analyze with Groq: ${error.message}`);
  }
}

// COMMENTED OUT: Google Cloud Vision API functions
// // WHAT-IT-DOES: Detects labels (objects, concepts) in an image using Google Cloud Vision API
// // HOW-TO-USE: Pass an image URL and get back an array of detected labels
// export async function detectLabels(imageUrl: string): Promise<string[]> {
//   try {
//     console.log('Analyzing image with Google Cloud Vision API:', imageUrl);
//
//     // WHAT-IT-DOES: Performs label detection on the image
//     const [result] = await client.labelDetection({
//       image: {
//         source: {
//           imageUri: imageUrl,
//         },
//       },
//       maxResults: 10, // Maximum number of labels to return
//     });
//
//     const labels = result.labelAnnotations;
//
//     if (!labels || labels.length === 0) {
//       console.log('No labels detected in the image');
//       return [];
//     }
//
//     // WHAT-IT-DOES: Extracts label descriptions and filters by confidence score
//     const detectedLabels = labels
//       .filter(label => (label.score || 0) > 0.5) // Only include labels with confidence > 50%
//       .map(label => label.description || '')
//       .filter(description => description.length > 0);
//
//     console.log('Detected labels with high confidence:', detectedLabels);
//     return detectedLabels;
//
//   } catch (error) {
//     console.error('Error detecting labels:', error);
//     throw new Error(`Failed to analyze image: ${error.message}`);
//   }
// }
//
// // WHAT-IT-DOES: Detects text in an image using Google Cloud Vision API
// // HOW-TO-USE: Useful for detecting text on documents, signs, etc.
// export async function detectText(imageUrl: string): Promise<string[]> {
//   try {
//     console.log('Analyzing text in image with Google Cloud Vision API:', imageUrl);
//
//     // WHAT-IT-DOES: Performs text detection on the image
//     const [result] = await client.textDetection({
//       image: {
//         source: {
//           imageUri: imageUrl,
//         },
//       },
//     });
//
//     const detections = result.textAnnotations;
//
//     if (!detections || detections.length === 0) {
//       console.log('No text detected in the image');
//       return [];
//     }
//
//     // WHAT-IT-DOES: Extracts detected text
//     const detectedTexts = detections
//       .map(text => text.description || '')
//       .filter(description => description.length > 0);
//
//     console.log('Detected text:', detectedTexts);
//     return detectedTexts;
//
//   } catch (error) {
//     console.error('Error detecting text:', error);
//     throw new Error(`Failed to analyze text in image: ${error.message}`);
//   }
// }
//
// // WHAT-IT-DOES: Detects objects in an image using Google Cloud Vision API
// // HOW-TO-USE: More specific than labels, detects actual objects with bounding boxes
// export async function detectObjects(imageUrl: string): Promise<string[]> {
//   try {
//     console.log('Analyzing objects in image with Google Cloud Vision API:', imageUrl);
//
//     // WHAT-IT-DOES: Performs object localization on the image
//     const [result] = await client.objectLocalization({
//       image: {
//         source: {
//           imageUri: imageUrl,
//         },
//       },
//     });
//
//     const objects = result.localizedObjectAnnotations;
//
//     if (!objects || objects.length === 0) {
//       console.log('No objects detected in the image');
//       return [];
//     }
//
//     // WHAT-IT-DOES: Extracts object names and filters by confidence score
//     const detectedObjects = objects
//       .filter(obj => (obj.score || 0) > 0.5) // Only include objects with confidence > 50%
//       .map(obj => obj.name || '')
//       .filter(name => name.length > 0);
//
//     console.log('Detected objects with high confidence:', detectedObjects);
//     return detectedObjects;
//
//   } catch (error) {
//     console.error('Error detecting objects:', error);
//     throw new Error(`Failed to analyze objects in image: ${error.message}`);
//   }
// }

