import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey:            "AIzaSyCF-w8Tcr2vx0mv-o75QT-4yandLS_Gpm8",
  authDomain:        "neurocalm-87ded.firebaseapp.com",
  projectId:         "neurocalm-87ded",
  storageBucket:     "neurocalm-87ded.firebasestorage.app",
  messagingSenderId: "308041012966",
  appId:             "1:308041012966:web:cf4f28ef6ec1a8c06b9d27",
  measurementId:     "G-5TK2KHWPQR",
};

const app      = initializeApp(firebaseConfig);
export const auth     = getAuth(app);
export const provider = new GoogleAuthProvider();

provider.setCustomParameters({ prompt: "select_account" });

// Use redirect (works on all browsers/devices without popup issues)
export async function signInWithGoogle() {
  await signInWithRedirect(auth, provider);
  // Page will redirect to Google, then back — result handled in App.jsx
}

export { getRedirectResult };

export async function signOutUser() {
  await signOut(auth);
}
