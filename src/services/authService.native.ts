import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
} from "firebase/auth";

import {
  GoogleOneTapSignIn,
  isCancelledResponse,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
} from "react-native-nitro-google-signin";

import { auth } from "./firebase";

GoogleOneTapSignIn.configure({
  webClientId: "autoDetect",
});

export async function signInWithGoogle() {
  await GoogleOneTapSignIn.checkPlayServices();

  let response = await GoogleOneTapSignIn.signIn();

  if (isCancelledResponse(response)) {
    return null;
  }

  if (isNoSavedCredentialFoundResponse(response)) {
    response = await GoogleOneTapSignIn.createAccount();
  }

  if (isCancelledResponse(response)) {
    return null;
  }

  if (isNoSavedCredentialFoundResponse(response)) {
    response = await GoogleOneTapSignIn.presentExplicitSignIn();
  }

  if (isCancelledResponse(response)) {
    return null;
  }

  if (!isSuccessResponse(response)) {
    throw new Error("Google sign-in did not return an account.");
  }

  const credential = GoogleAuthProvider.credential(response.data.idToken);

  return signInWithCredential(auth, credential);
}

export async function signOutFromGoogle(): Promise<void> {
  let nativeSignOutError: unknown = null;

  try {
    await GoogleOneTapSignIn.signOut();
  } catch (error) {
    nativeSignOutError = error;
  }

  await firebaseSignOut(auth);

  if (nativeSignOutError) {
    throw nativeSignOutError;
  }
}
