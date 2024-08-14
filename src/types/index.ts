// src/types/index.ts

export interface User {
    id: string;
    name: string;
    email: string;
    isBuilder: boolean;
    gender?: string;
    avatar?: string;
    preferences?: UserPreferences;
    isdeleted: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface UserPreferences {
    id: string;
    userId: string;
    flatType: string;
    minBudget?: number;
    maxBudget?: number;
    preferredAreas: string;
    minSize?: number;
    maxSize?: number;
    description?: string;
    isdeleted: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Project {
    id: string;
    name: string;
    location: string;
    description?: string;
    builderId: string;
    status: string;
    priceRange: string;
    projectType: string;
    completionDate?: string;
    images: Image[];
    contactInfo?: ContactInfo;
    flatTypes: FlatType[];
    isdeleted: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Image {
    id: string;
    url: string;
    altText?: string;
    projectId: string;
    isdeleted: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ContactInfo {
    id: string;
    phone: string;
    email: string;
    address?: string;
    projectId: string;
    isdeleted: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface FlatType {
    id: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    size: number;
    price: number;
    status: string;
    projectId: string;
    isdeleted: boolean;
    createdAt: string;
    updatedAt: string;
  }
  