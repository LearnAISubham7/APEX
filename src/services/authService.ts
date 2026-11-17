import type { UserCredential } from "firebase/auth";

export declare function signInWithGoogle(): Promise<UserCredential | null>;

export declare function signOutFromGoogle(): Promise<void>;
