import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function CreateAbsenceAsync(queryData) {
  try {
    
    const absenceListRef = collection(db, "absence");
    const newDocRef = await addDoc(absenceListRef, { users: queryData });

    console.log("Absence Table created successfully.");
    return newDocRef;
  } catch (error) {
    console.error("Error creating ${}: ", error);
    throw error;
  }
}
