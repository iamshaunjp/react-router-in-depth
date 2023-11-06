import { collection, addDoc, getDoc } from "firebase/firestore";
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


export async function GetRefAbsenceAsync(ref) {
    try {
      const docSnapshot = await getDoc(ref);
      if (docSnapshot.exists()) {
        return { id: docSnapshot.id, ...docSnapshot.data() };
      } else {
        console.log("Referenced document does not exist.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching referenced document:", error);
      return null;
    }
  }
  