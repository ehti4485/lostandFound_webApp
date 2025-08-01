import { Schema, model, Document } from 'mongoose';

// HOW-TO-USE: This enum defines the status of an item.
// 'Lost' means a user has lost it. 'Found' means a user has found it.
export enum ItemStatus {
  Lost = 'Lost',
  Found = 'Found',
  Resolved = 'Resolved', // 'Resolved' means the item has been returned to its owner.
}

// HOW-TO-USE: This enum defines the category of the item.
// This helps in creating specific forms on the frontend and better matching on the backend.
export enum ItemCategory {
  Electronics = 'Electronics',
  Documents = 'Documents',
  Wallets = 'Wallets',
  Keys = 'Keys',
  Pets = 'Pets',
  Other = 'Other',
}

export interface IItem extends Document {
  status: ItemStatus;
  category: ItemCategory;
  title: string;
  description: string;
  location: string; // Location where the item was lost or found
  date: Date; // Date when the item was lost or found
  imageUrl?: string; // URL for the uploaded image of the item
  uniqueIdentifier?: string; // For things like NIC number, IMEI, etc.
  ownerEmail: string; // Email of the user who posted this item
  isMatched: boolean;
}

const itemSchema = new Schema<IItem>({
  // WHAT-IT-DOES: Stores whether the item is 'Lost' or 'Found'. This is the primary field for matching.
  status: { type: String, enum: Object.values(ItemStatus), required: true },
  
  // WHAT-IT-DOES: Stores the category of the item (e.g., 'Electronics'). Used for filtering.
  category: { type: String, enum: Object.values(ItemCategory), required: true },
  
  // WHAT-IT-DOES: A brief title for the item post.
  title: { type: String, required: true },
  
  // WHAT-IT-DOES: Detailed description of the item.
  description: { type: String, required: true },
  
  // WHAT-IT-DOES: The geographical location (city/area) of the event.
  location: { type: String, required: true },
  
  // WHAT-IT-DOES: The date of the event.
  date: { type: Date, required: true },
  
  // WHAT-IT-DOES: Stores the URL of an image of the item. This is optional.
  imageUrl: { type: String },
  
  // WHAT-IT-DOES: A critical field for matching specific items like documents or phones.
  uniqueIdentifier: { type: String, sparse: true }, // 'sparse' allows multiple null values.
  
  // WHAT-IT-DOES: The email of the user who created the post. Used for sending notifications.
  ownerEmail: { type: String, required: true },

  // WHAT-IT-DOES: A flag to check if a match has been found and confirmed.
  isMatched: { type: Boolean, default: false },
}, { timestamps: true }); // 'timestamps' automatically adds createdAt and updatedAt fields.

export const Item = model<IItem>('Item', itemSchema);

