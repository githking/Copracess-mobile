import { Cloudinary } from "@cloudinary/url-gen";

// Create Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
});

interface CloudinaryUploadFile {
  uri: string;
  name: string;
  type: string;
}

// Upload helper function
export const uploadToCloudinary = async (
  imageUri: string
): Promise<string | null> => {
  try {
    const formData = new FormData();

    // Prepare image file with null checks
    const filename = imageUri.split("/").pop();
    if (!filename) {
      throw new Error("Invalid image URI - no filename found");
    }

    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg"; // Default to jpeg if no extension

    const fileObject: CloudinaryUploadFile = {
      uri: imageUri,
      name: filename,
      type,
    };

    formData.append("file", fileObject as any);

    if (!process.env.EXPO_PUBLIC_UPLOAD_PRESET) {
      throw new Error("Upload preset is not configured");
    }

    formData.append("upload_preset", process.env.EXPO_PUBLIC_UPLOAD_PRESET);

    if (!process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      throw new Error("Cloudinary cloud name is not configured");
    }

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};

export { cld };
export default cld;
