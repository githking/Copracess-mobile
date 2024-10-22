import axios from "axios";
import { SignInForm, User } from "../../types/type";

export const loginClerk = async (
  signIn: any,
  setActive: any,
  form: SignInForm,
  user: User,
  router: any
) => {
  if (!signIn) {
    console.error("signIn resource is unavailable.");
    return false;
  }

  try {
    const signInAttempt = await signIn.create({
      identifier: form.email,
      password: form.password,
    });

    if (signInAttempt.status === "complete") {
      await setActive({ session: signInAttempt.createdSessionId });
      if (user.role === "COPRA_BUYER") {
        router.replace("/(copraowner)/home");
      } else if (
        user.role === "OIL_MILL_MANAGER" ||
        user.role === "OIL_MILL_MEMBER"
      ) {
        router.replace("/(oilmill)/home");
      }
    } else {
      console.error(
        "Sign-in not complete:",
        JSON.stringify(signInAttempt, null, 2)
      );
    }
  } catch (error) {
    console.error("Error during sign-in:", error);
  }
};

export const signupClerk = async (
  signIn: any,
  setActive: any,
  form: SignInForm,
  user: User,
  router: any
) => {
  if (!signIn) {
    console.error("signUp resource is unavailable.");
    return false;
  }

  try {
    const apiKey = process.env.EXPO_PUBLIC_CLERK_SECRET_KEY;
    const response = await axios.post(
      `https://api.clerk.dev/v1/users`,
      {
        email_address: [form.email],
        password: form.password,
        skip_password_checks: true,
        skip_password_requirement: true,
        private_metadata: {
          role: user.role,
          position: user.position,
          organizationId: user.organizationId,
          image: user.image,
          webID: user.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const signInAttempt = await signIn.create({
      identifier: form.email,
      password: form.password,
    });

    if (signInAttempt.status === "complete") {
      await setActive({ session: signInAttempt.createdSessionId });
      if (user.role === "COPRA_BUYER") {
        router.replace("/(copraowner)/home");
      } else if (
        user.role === "OIL_MILL_MANAGER" ||
        user.role === "OIL_MILL_MEMBER"
      ) {
        router.replace("/(oilmill)/home");
      }
    } else {
      console.error(
        "Sign-in not complete:",
        JSON.stringify(signInAttempt, null, 2)
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};
