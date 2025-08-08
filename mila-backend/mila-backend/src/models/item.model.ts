import mongoose, { Document, Schema } from 'mongoose';

export enum ItemStatus {
  Lost = 'Lost',
  Found = 'Found',
  Resolved = 'Resolved',
}

export interface IItem extends Document {
  title: string;
  description: string;
  category: string;
  status: ItemStatus;
  location: string;
  imageUrl?: string;
  uniqueIdentifier?: string; // e.g., serial number, ID number
  owner: mongoose.Schema.Types.ObjectId; // Reference to the User who posted the item
  ownerEmail: string; // Email of the user who posted the item
  isMatched: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, enum: Object.values(ItemStatus), required: true },
    location: { type: String, required: true },
    imageUrl: { type: String },
    uniqueIdentifier: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isMatched: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Item = mongoose.model<IItem>('Item', ItemSchema);


