
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Function to get a readable error message from Supabase errors
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  
  if (error?.message) return error.message;
  
  if (error?.error_description) return error.error_description;
  
  return 'An unknown error occurred';
}

// Storage bucket for PDF files
export const STORAGE_BUCKET = 'study_notes';

// Helper to generate a unique file name
export function generateFileName(fileName: string): string {
  const timestamp = Date.now();
  const extension = fileName.split('.').pop();
  const randomString = Math.random().toString(36).substring(2, 10);
  
  return `${timestamp}_${randomString}.${extension}`;
}
