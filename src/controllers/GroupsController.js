import { collection, getDocs, getDoc, addDoc, doc, updateDoc} from "firebase/firestore";
import { db, groupCollection } from "../firebase";
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

export async function GetGroupByIdAsync(id) {
  const ref = doc(db, collectionName, id);

  try {
    const refDpc = await getDoc(ref);

    if (refDpc.exists()) {
      return new Group({ id: refDpc.id, ...refDpc.data() });
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching entry:", error);
    throw error;
  }
}

export async function CreateGroupAsync(groupData) {
  try {
    console.log(groupData.name)

    const groupDocRef = await addDoc(groupCollection, {"name": groupData.name});

    const userRefs = await groupData.users.map((userId) => doc(db, 'users', userId));

    console.log(userRefs)
    if (userRefs.exists)
    {
      await updateDoc(groupDocRef, { users: userRefs });
    }

    return groupDocRef.id;
  } catch (error) {
    console.error("Error creating user: ", error);
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
