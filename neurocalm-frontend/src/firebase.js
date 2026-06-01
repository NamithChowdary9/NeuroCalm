import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey:            "AIzaSyCF-w0Tcr2vx0mv-o75QT-4ymhdL5_Gpm8",
  authDomain:        "neurocalm-87ded.firebaseapp.com",
  projectId:         "neurocalm-87ded",
  storageBucket:     "neurocalm-87ded.firebasestorage.app",
  messagingSenderId: "308041012966",
  appId:             "1:308041012966:web:cf4f28ef6ec1a8c06b9d27",
  measurementId:     "G-5TK2KHWPQR",
};

const app = initializeApp(firebaseConfig);
export const auth     = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export async function signInWithGoogle() {
  // Try popup first; fall back to redirect if blocked
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    if (
      err.code === "auth/popup-blocked" ||
      err.code === "auth/popup-closed-by-user" ||
      err.code === "auth/cancelled-popup-request"
    ) {
      await signInWithRedirect(auth, provider);
      return null; // redirect will handle it
    }
    throw err;
  }
}

export { onAuthStateChanged, getRedirectResult, signOut };
