import {initializeApp, getApps} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";

const firebaseApp = getApps().length ? getApps()[0] : initializeApp();

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export {firebaseApp};
