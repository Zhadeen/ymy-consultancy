import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * Includes a timeout and progress tracking.
 * @param {File} file - The file to upload.
 * @param {string} path - The storage path (e.g., 'profile_photos').
 * @param {string} fileName - The name to save the file as.
 * @param {function} onProgress - Optional callback for upload progress (0-100).
 * @returns {Promise<string>} - The download URL.
 */
export async function uploadFile(file, path, fileName, onProgress) {
  if (!file) return null;
  
  const finalFileName = fileName || `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `${path}/${finalFileName}`);
  
  console.log(`[Firebase Upload] Starting upload to ${path}/${finalFileName}...`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      console.warn(`[Firebase Upload] Timeout after 60s for ${path}/${finalFileName}`);
      uploadTask.cancel();
      reject(new Error("Upload timed out after 60 seconds. Please check your internet connection or try a smaller file."));
    }, 60000); // 60 seconds timeout

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const total = snapshot.totalBytes;
        const transferred = snapshot.bytesTransferred;
        
        // Progress calculation with guard for totalBytes=0
        let progress = 0;
        if (total > 0) {
          progress = Math.round((transferred / total) * 100);
        }
        
        console.log(`[Firebase Upload] Progress: ${progress}% (${transferred}/${total} bytes)`);
        if (onProgress) onProgress(progress);
      },
      (error) => {
        clearTimeout(timeoutId);
        console.error(`[Firebase Upload] Error uploading ${path}/${finalFileName}:`, error);
        
        // Improve error message for specific Firebase errors
        let errorMsg = error.message;
        if (error.code === 'storage/unauthorized') {
          errorMsg = "Unauthorized: Please ensure the storage rules have been deployed.";
        } else if (error.code === 'storage/quota-exceeded') {
          errorMsg = "Storage quota exceeded. Please contact support.";
        }
        
        reject(new Error(errorMsg));
      },
      async () => {
        clearTimeout(timeoutId);
        console.log(`[Firebase Upload] Success! Finalizing URL for ${path}/${finalFileName}...`);
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          console.error(`[Firebase Upload] Error getting download URL:`, error);
          reject(error);
        }
      }
    );
  });
}
