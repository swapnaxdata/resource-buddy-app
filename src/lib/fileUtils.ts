
/**
 * Extracts storage bucket and file path from a Supabase storage URL
 * @param fileUrl The complete URL to a file in Supabase storage
 * @returns An object with bucket name and file path, or null if parsing fails
 */
export function extractStoragePath(fileUrl: string): { bucket: string; path: string } | null {
  try {
    const url = new URL(fileUrl);
    const parts = url.pathname.split('/');
    
    // Find the 'object' part in the URL which indicates the start of the bucket path
    const objectIndex = parts.findIndex(part => part === 'object');
    
    if (objectIndex < 0 || objectIndex + 1 >= parts.length) {
      return null;
    }
    
    const bucket = parts[objectIndex + 1];
    const path = parts.slice(objectIndex + 2).join('/');
    
    return { bucket, path };
  } catch (error) {
    console.error('Failed to parse storage URL:', error);
    return null;
  }
}

/**
 * Safely removes a file from Supabase storage
 * @param fileUrl The complete URL to the file
 * @returns A promise resolving to a boolean indicating success
 */
export async function removeFileFromStorage(fileUrl: string): Promise<boolean> {
  if (!fileUrl) return false;
  
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const pathInfo = extractStoragePath(fileUrl);
    
    if (!pathInfo) {
      console.error('Could not extract path from URL:', fileUrl);
      return false;
    }
    
    const { bucket, path } = pathInfo;
    console.log(`Removing file from bucket: ${bucket}, path: ${path}`);
    
    const { error } = await supabase.storage.from(bucket).remove([path]);
    
    if (error) {
      console.error('Error removing file:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to remove file:', error);
    return false;
  }
}
