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
  
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      uploadTask.cancel();
      reject(new Error("Upload timed out after 60 seconds. Please check your internet connection or try a smaller file."));
    }, 60000); // 60 seconds timeout

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(Math.round(progress));
      },
      (error) => {
        clearTimeout(timeoutId);
        console.error("Storage upload error:", error);
        reject(error);
      },
      async () => {
        clearTimeout(timeoutId);
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
