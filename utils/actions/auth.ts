import { SignInForm, User } from "../../types/type";

export const loginClerk = async (
  signIn: any, // type appropriately as needed
  setActive: any, // type appropriately as needed
  form: SignInForm,
  user: User,
  router: any // type appropriately as needed
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
  signUp: any,
  setActive: any,
  form: SignInForm,
  user: User,
  router: any
) => {
  if (!signUp) {
    console.error("signUp resource is unavailable.");
    return false;
  }

  try {
    const createdUser = await signUp.create({
      emailAddress: form.email,
      password: form.password,
    });

    if (createdUser.status === "complete") {
      await setActive({ session: createdUser.createdSessionId });
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
        JSON.stringify(createdUser, null, 2)
      );
    }
  } catch (error) {
    console.error("An error occurred during signup:", error);
  }
};
