// WHAT-IT-DOES: Defines TypeScript types and enums for the frontend
// HOW-TO-USE: Import these types in components and pages for type safety

export enum ItemStatus {
  Lost = 'Lost',
  Found = 'Found',
  Resolved = 'Resolved',
}

export enum ItemCategory {
  Electronics = 'Electronics',
  Documents = 'Documents',
  Wallets = 'Wallets',
  Keys = 'Keys',
  Pets = 'Pets',
  Other = 'Other',
}

export interface Item {
  _id: string;
  status: ItemStatus;
  category: ItemCategory;
  title: string;
  description: string;
  location: string;
  date: string;
  imageUrl?: string;
  uniqueIdentifier?: string;
  ownerEmail: string;
  isMatched: boolean;
  createdAt: string;
  updatedAt: string;
}

