import axios from "axios";
import { useClerk } from "@clerk/clerk-expo";

export const checkEmailExists = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      // `https://www.copracess.live/api/mobile/user`,
      `http://192.168.0.231:3000/api/mobile/user`,
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

const checkEmailInClerk = async (email: string) => {
  const { client } = useClerk();
  try {
    const users = await client.users.getUserList({ email });
    return users.length > 0; // Returns true if user exists, false otherwise
  } catch (error) {
    console.error("Error checking email in Clerk:", error);
    return false; // In case of an error, return false
  }
};
