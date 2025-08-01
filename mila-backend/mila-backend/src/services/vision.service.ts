import { ImageAnnotatorClient } from '@google-cloud/vision';

// WHAT-IT-DOES: Initializes the Google Cloud Vision API client
// HOW-TO-USE: The client will use the service account key file specified in the environment variable
const client = new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE, // Path to your service account key file
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID, // Your Google Cloud project ID
});

// WHAT-IT-DOES: Detects labels (objects, concepts) in an image using Google Cloud Vision API
// HOW-TO-USE: Pass an image URL and get back an array of detected labels
export async function detectLabels(imageUrl: string): Promise<string[]> {
  try {
    console.log('Analyzing image with Google Cloud Vision API:', imageUrl);
    
    // WHAT-IT-DOES: Performs label detection on the image
    const [result] = await client.labelDetection({
      image: {
        source: {
          imageUri: imageUrl,
        },
      },
      maxResults: 10, // Maximum number of labels to return
    });

    const labels = result.labelAnnotations;
    
    if (!labels || labels.length === 0) {
      console.log('No labels detected in the image');
      return [];
    }

    // WHAT-IT-DOES: Extracts label descriptions and filters by confidence score
    const detectedLabels = labels
      .filter(label => (label.score || 0) > 0.5) // Only include labels with confidence > 50%
      .map(label => label.description || '')
      .filter(description => description.length > 0);

    console.log('Detected labels with high confidence:', detectedLabels);
    return detectedLabels;

  } catch (error) {
    console.error('Error detecting labels:', error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}

// WHAT-IT-DOES: Detects text in an image using Google Cloud Vision API
// HOW-TO-USE: Useful for detecting text on documents, signs, etc.
export async function detectText(imageUrl: string): Promise<string[]> {
  try {
    console.log('Analyzing text in image with Google Cloud Vision API:', imageUrl);
    
    // WHAT-IT-DOES: Performs text detection on the image
    const [result] = await client.textDetection({
      image: {
        source: {
          imageUri: imageUrl,
        },
      },
    });

    const detections = result.textAnnotations;
    
    if (!detections || detections.length === 0) {
      console.log('No text detected in the image');
      return [];
    }

    // WHAT-IT-DOES: Extracts detected text
    const detectedTexts = detections
      .map(text => text.description || '')
      .filter(description => description.length > 0);

    console.log('Detected text:', detectedTexts);
    return detectedTexts;

  } catch (error) {
    console.error('Error detecting text:', error);
    throw new Error(`Failed to analyze text in image: ${error.message}`);
  }
}

// WHAT-IT-DOES: Detects objects in an image using Google Cloud Vision API
// HOW-TO-USE: More specific than labels, detects actual objects with bounding boxes
export async function detectObjects(imageUrl: string): Promise<string[]> {
  try {
    console.log('Analyzing objects in image with Google Cloud Vision API:', imageUrl);
    
    // WHAT-IT-DOES: Performs object localization on the image
    const [result] = await client.objectLocalization({
      image: {
        source: {
          imageUri: imageUrl,
        },
      },
    });

    const objects = result.localizedObjectAnnotations;
    
    if (!objects || objects.length === 0) {
      console.log('No objects detected in the image');
      return [];
    }

    // WHAT-IT-DOES: Extracts object names and filters by confidence score
    const detectedObjects = objects
      .filter(obj => (obj.score || 0) > 0.5) // Only include objects with confidence > 50%
      .map(obj => obj.name || '')
      .filter(name => name.length > 0);

    console.log('Detected objects with high confidence:', detectedObjects);
    return detectedObjects;

  } catch (error) {
    console.error('Error detecting objects:', error);
    throw new Error(`Failed to analyze objects in image: ${error.message}`);
  }
}

