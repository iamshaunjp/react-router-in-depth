import { collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Group } from "../entities/GroupEntity";

const collectionName = "groups";

export async function GetAllGroupsAsync() {
  const itemsRef = collection(db, collectionName);

  try {
    const querySnapshot = await getDocs(itemsRef);
    const data = [];

    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error("Error fetching Entries:", error);
    throw error;
  }
}

export async function GetRefGroupAsync(ref) {
  try {
    const docSnapshot = await getDoc(ref);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return new Group({ id: docSnapshot.id, ...data });
    } else {
      console.log("Referenced document does not exist.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching referenced document:", error);
    return null;
  }
}
