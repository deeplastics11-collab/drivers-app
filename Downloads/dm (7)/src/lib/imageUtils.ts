/**
 * Utility functions for image processing.
 */

/**
 * Resizes an image file.
 * @param file The image file to resize.
 * @param maxWidth The maximum width of the resized image.
 * @param maxHeight The maximum height of the resized image.
 * @param quality The quality of the resized image (0 to 1).
 * @returns A promise that resolves to the resized image Blob.
 */
export const resizeImage = async (
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

/**
 * Converts a Blob to a base64 string.
 * @param blob The blob to convert.
 * @returns A promise that resolves to the base64 string.
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Gets the MIME type of a file.
 * @param file The file to check.
 * @returns The MIME type string.
 */
export const getMimeType = (file: File): string => {
  return file.type || 'image/jpeg';
};

/**
 * Gets base64 data from a blob string.
 * @param base64String The full base64 string (including data:image/...).
 * @returns The base64 data only.
 */
export const getBase64Data = (base64String: string): string => {
  if (base64String.includes(',')) {
    return base64String.split(',')[1];
  }
  return base64String;
};
