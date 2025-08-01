export interface Item {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateItemRequest {
    name: string;
    description: string;
}

export interface UpdateItemRequest {
    name?: string;
    description?: string;
}

export interface ItemResponse {
    item: Item;
}

export interface ItemsResponse {
    items: Item[];
}