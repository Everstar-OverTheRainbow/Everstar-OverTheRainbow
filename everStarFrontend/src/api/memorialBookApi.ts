// src/api/memorialBookApi.ts
import config from 'config';

export interface MemorialBookData {
  pet: {
    name: string;
  };
  sentimentAnalysis: {
    week1Result: number;
    week2Result: number;
    week3Result: number;
    week4Result: number;
    week5Result: number;
    week6Result: number;
    week7Result: number;
    totalResult: string;
  };
  quests: {
    id: number;
    content: string;
    type: string;
  }[];
  questAnswers: {
    questId: number;
    content: string;
    imageUrl: string;
    type: string;
  }[];
  aiAnswers: {
    questId: number;
    content: string;
    imageUrl: string;
    type: string;
  }[];
  diaries: {
    title: string;
    content: string;
    imageUrl: string;
  }[];
}

export interface MemorialBookResponse {
  id: number;
  psychologicalTestResult: string;
  isOpen: boolean;
  isActive: boolean;
  data: MemorialBookData;
}

export const getMemorialBooks = async (
  petId: number,
): Promise<MemorialBookResponse[]> => {
  const response = await fetch(
    `${config.API_BASE_URL}/api/pets/${petId}/memorialbooks`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  );

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || 'An error occurred');
  }

  return response.json();
};

export const getMemorialBookById = async (
  petId: number,
  memorialBookId: number,
): Promise<MemorialBookResponse> => {
  const response = await fetch(
    `${config.API_BASE_URL}/api/pets/${petId}/memorialbooks/${memorialBookId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  );

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || 'An error occurred');
  }

  return response.json();
};

export const updateMemorialBookOpenStatus = async (
  petId: number,
  memorialBookId: number,
  isOpen: boolean,
  token: string,
): Promise<void> => {
  const response = await fetch(
    `${config.API_BASE_URL}/api/pets/${petId}/memorialbooks/${memorialBookId}/is-open`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isOpen }),
    },
  );

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || 'An error occurred');
  }
};

export const createDiary = async (
  petId: number,
  memorialBookId: number,
  title: string,
  content: string,
  imageFile: File | null,
  token: string,
): Promise<void> => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  if (imageFile) {
    formData.append('imageFile', imageFile);
  }

  const response = await fetch(
    `${config.API_BASE_URL}/api/pets/${petId}/memorialbooks/${memorialBookId}/diaries`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || 'An error occurred');
  }
};
