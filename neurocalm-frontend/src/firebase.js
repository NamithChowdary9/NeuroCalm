import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from "firebase/auth";

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

export async function signInWithGoogle() {
  try {
    // Try popup first
    const result = await signInWithPopup(auth, provider);
    const user   = result.user;
    return {
      name:  user.displayName,
      email: user.email,
      photo: user.photoURL,
      uid:   user.uid,
    };
  } catch (err) {
    // If popup blocked, fall back to redirect
    if (err.code === "auth/popup-blocked" || err.code === "auth/popup-closed-by-user") {
      await signInWithRedirect(auth, provider);
      return null; // page will redirect
    }
    throw err;
  }
}

export { getRedirectResult };

export async function signOutUser() {
  await signOut(auth);
}
