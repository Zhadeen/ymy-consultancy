import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param {File} file - The file to upload.
 * @param {string} path - The storage path (e.g., 'profile_photos' or 'id_documents').
 * @param {string} fileName - The name to save the file as.
 * @returns {Promise<string>} - The download URL.
 */
export async function uploadFile(file, path, fileName) {
  if (!file) return null;
  
  // Create a unique filename if not provided
  const finalFileName = fileName || `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `${path}/${finalFileName}`);
  
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}
