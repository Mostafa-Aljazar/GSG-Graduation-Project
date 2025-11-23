export const handleUploadMedia = async (
  file: File,
  fun_startUpload: (files: File[]) => Promise<any> // Pass startUpload as an argument
): Promise<string | null> => {
  try {
    const uploadedFiles = await fun_startUpload([file]);
    const url = uploadedFiles?.[0]?.ufsUrl;
    if (url) {
      // alert(`Uploaded Successfully: ${url}`);
      return url;
    }
    throw new Error('Upload failed');
  } catch (error: any) {
    console.error('Error during upload:', error);
    alert(`Error: ${error.message}`);
    return null;
  }
};
