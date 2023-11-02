import { getDocs, getDoc } from "firebase/firestore";
import { arenasCollection } from "../firebase";
import { Arena } from "../objectDTOs/ArenasDto";

export async function GetAllArenasAsync() {
  try {
    const querySnapshot = await getDocs(arenasCollection);
    const data = querySnapshot.docs.map(
      (doc) => new Arena(doc.id, doc.data().name)
    );
    return data;
  } catch (error) {
    console.error(`Error fetching:`, error);
    throw error;
  }
}

export async function GetRefArenaAsync(ref) {
  try {
    const docSnapshot = await getDoc(ref);
    if (docSnapshot.exists()) {
      return new Arena(docSnapshot.id, docSnapshot.data().name);
    } else {
      console.log("Referenced document does not exist.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching referenced document:", error);
    return null;
  }
}
