import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  // @ts-expect-error Firebase's public typings omit this React Native-only export.
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyB055noWfdf__yjla6Lu_Tb8Wf_B-tVs8",
  authDomain: "apex-cd57a.firebaseapp.com",
  projectId: "apex-cd57a",
  messagingSenderId: "375804782071",
  appId: "1:375804782071:web:f8a40682a5c4ebdf1abaf2",
};

export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

function createFirebaseAuth() {
  if (Platform.OS === "web") {
    return getAuth(firebaseApp);
  }

  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // Reuse the existing instance if Firebase Auth was already initialized.
    return getAuth(firebaseApp);
  }
}

export const auth = createFirebaseAuth();
export const db = getFirestore(firebaseApp);
