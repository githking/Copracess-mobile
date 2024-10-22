import axios from "axios";
import { useClerk } from "@clerk/clerk-expo";

export const checkEmailExists = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      // `https://www.copracess.live/api/mobile/user`,
      `http://192.168.1.200:3000/api/mobile/user`,
      {
        email: email,
        password: password,
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};

export const checkClerkUserExists = async (email: string) => {
  try {
    const apiKey = process.env.EXPO_PUBLIC_CLERK_SECRET_KEY;
    const response = await axios.get(`https://api.clerk.dev/v1/users`, {
      params: {
        email_address: email,
      },
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const users = response.data;
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error("Error checking user in Clerk:", error);
    return null;
  }
};
