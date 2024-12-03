import { Cloudinary } from "@cloudinary/url-gen";

// Create Cloudinary instance
export const cld = new Cloudinary({
    cloud: {
        cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
});
