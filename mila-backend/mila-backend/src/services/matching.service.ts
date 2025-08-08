import { Item, IItem, ItemStatus } from '../models/item.model';
import { analyzeWithGroq } from './vision.service'; // Import the new Groq-based function

// HOW-TO-USE: This function is called every time a new item is created.
// It takes the newly created item and searches the database for potential matches.
export async function findMatches(newItem: IItem) {
  console.log('Starting match search for:', newItem.title);

  let potentialMatches: IItem[] = [];

  // WHAT-IT-DOES: The core matching logic. If the new item is 'Lost', it searches for 'Found' items, and vice-versa.
  const targetStatus = newItem.status === ItemStatus.Lost ? ItemStatus.Found : ItemStatus.Lost;

  // 1. High-Confidence Match: Check for Unique Identifier
  // HOW-TO-MODIFY: This is the most reliable match. You can add more unique fields here.
  if (newItem.uniqueIdentifier) {
    const exactMatch = await Item.findOne({
      uniqueIdentifier: newItem.uniqueIdentifier,
      status: targetStatus,
      isMatched: false,
    });
    if (exactMatch) {
      potentialMatches.push(exactMatch);
      // If an exact match is found, we can probably stop here.
      console.log(`High-confidence match found for ${newItem.title}: ${exactMatch.title}`);
      // TODO: Trigger notification service for both users.
      return;
    }
  }

  // 2. AI-Powered Match (Image Recognition with Groq)
  // Use Groq to extract identifiers from the image and description
  if (newItem.imageUrl) {
    try {
      console.log('Analyzing image with Groq for item:', newItem.title);
      const identifiers = await analyzeWithGroq(
        newItem.imageUrl,
        `${newItem.title} - ${newItem.description}`,
        newItem.category
      );
      
      // Search for items with matching identifiers
      if (identifiers.length > 0) {
        console.log('Identifiers extracted by Groq:', identifiers);
        
        // Create regex patterns for each identifier
        const identifierPatterns = identifiers.map(id => new RegExp(id, 'i'));
        
        // Search for items with matching identifiers
        const aiMatches = await Item.find({
          status: targetStatus,
          isMatched: false,
          $or: [
            { uniqueIdentifier: { $in: identifierPatterns } },
            { title: { $regex: new RegExp(identifiers.join('|'), 'i') } },
            { description: { $regex: new RegExp(identifiers.join('|'), 'i') } }
          ]
        });
        
        potentialMatches.push(...aiMatches);
        console.log(`Found ${aiMatches.length} potential AI-powered matches.`);
      }
    } catch (error) {
      console.error('Error analyzing image with Groq:', error);
      // Continue with other matching strategies if Groq fails
    }
  }

  // 3. Medium-Confidence Match: Category, Location, and Keywords
  // HOW-TO-MODIFY: You can make this logic more advanced by using natural language processing (NLP) libraries to parse keywords.
  const searchTerms = newItem.description.split(' ').filter(term => term.length > 3); // Simple keyword extraction
  const mediumMatches = await Item.find({
    status: targetStatus,
    category: newItem.category,
    location: { $regex: new RegExp(newItem.location, 'i') }, // Case-insensitive location match
    $or: [
        { title: { $regex: new RegExp(newItem.title, 'i') } },
        { description: { $in: searchTerms.map(term => new RegExp(term, 'i')) } }
    ],
    isMatched: false,
  });

  potentialMatches.push(...mediumMatches);
  console.log(`Found ${mediumMatches.length} potential medium-confidence matches.`);
  
  // TODO: Trigger notification for all potential matches found.
  // For each match, send an email to newItem.ownerEmail and match.ownerEmail.
}

