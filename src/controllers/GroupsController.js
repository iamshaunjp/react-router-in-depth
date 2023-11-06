import { collection, getDocs, getDoc, addDoc, doc, updateDoc, arrayUnion, deleteDoc} from "firebase/firestore";
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

export async function GetGroupByIdAsync(ref) {

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
    const groupDocRef = await addDoc(groupCollection, {name: groupData.name});
    console.log("Group created with id: " + groupDocRef.id);
    return groupDocRef;
  } catch (error) {
    console.error("Error creating user: ", error);
    throw error;
  }
}

export async function UpdateGroupAsync(id, groupData) {
  try {
      const groupDocRef = doc(db, "users", id);
      await updateDoc(groupDocRef, groupData);
      console.log('User data updated successfully');
  } catch (error) {
      console.error('Error updating user data:', error);
      throw error; // You can handle the error in your component
  }
}


export async function DeleteGroupAsync(id) {
  const userRef = doc(db, "groups", id);
  try {
      await deleteDoc(userRef);
      console.log("Group deleted successfully");
  } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
  }
}


export async function GetRefGroupAsync(ref) {
  try {
    const docSnapshot = await getDoc(ref);
    if (docSnapshot.exists()) {
      return new Group({ id: docSnapshot.id, ...docSnapshot.data() });
    } else {
      console.log("Referenced document does not exist.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching referenced document:", error);
    return null;
  }
}

export async function AddUserToGroup(groupId, userId) {
  try {
    const groupDocRef = doc(db, collectionName, groupId);
    const userRef = doc(db, 'users', userId);

    await updateDoc(groupDocRef, { users: arrayUnion(userRef) });

    console.log('User added to group successfully');
  } catch (error) {
    console.error('Error adding user to group:', error);
    throw error;
  }
}