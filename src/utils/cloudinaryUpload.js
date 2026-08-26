// Unsigned, client-side upload to Cloudinary.
//
// Why this exists: Firebase Storage requires the project to be on the Blaze
// plan, which requires a Google Cloud billing account, which kept rejecting the
// card (16 auto-closed billing accounts). Cloudinary needs none of that — an
// unsigned upload preset uploads straight from the browser with no billing
// account, no card, and no server secret.
//
// Configure via env (both required to activate this path):
//   VITE_CLOUDINARY_CLOUD_NAME      your Cloudinary cloud name
//   VITE_CLOUDINARY_UPLOAD_PRESET   the name of an *unsigned* upload preset
//
// Note on sensitive files: ID documents delivered through a plain Cloudinary
// URL are readable by anyone who has the URL, the same posture as Firebase's
// tokenised download URLs. Fine for an MVP; harden later with signed/
// authenticated delivery if needed.

export function uploadToCloudinary(file, folder, _fileName, onProgress) {
  if (!file) return Promise.resolve(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !preset) {
    return Promise.reject(new Error('Uploads are not configured. Please contact support.'));
  }

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', preset);
  if (folder) form.append('folder', folder); // groups assets; harmless if the preset ignores it

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    // 'auto' handles both images and non-image documents (e.g. a PDF passport scan).
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);

    const timeoutId = setTimeout(() => {
      xhr.abort();
      reject(new Error('Upload timed out after 60 seconds. Please check your connection or try a smaller file.'));
    }, 60000);

    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      clearTimeout(timeoutId);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve(res.secure_url);
        } catch {
          reject(new Error('Upload succeeded but the response could not be read.'));
        }
      } else {
        let msg = `Upload failed (${xhr.status}).`;
        try {
          msg = JSON.parse(xhr.responseText)?.error?.message || msg;
        } catch {
          // keep the default message
        }
        reject(new Error(msg));
      }
    };

    xhr.onerror = () => { clearTimeout(timeoutId); reject(new Error('Network error during upload.')); };
    xhr.onabort = () => { clearTimeout(timeoutId); };

    xhr.send(form);
  });
}
