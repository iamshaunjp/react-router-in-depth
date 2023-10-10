import {
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const collectionName = "entries";

export async function GetAllEntriesAsync() {
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

export async function GetEntryByIdAsync(id) {
  const userRef = doc(db, collectionName, id); // Replace "users" with your Firestore collection name

  try {
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = { id: userDoc.id, ...userDoc.data() };
      return data;
    } else {
      // User document not found, return null or handle accordingly
      return null;
    }
  } catch (error) {
    console.error("Error fetching entry:", error);
    throw error;
  }
}

export async function DeleteEntryAsync(id) {
  const userRef = doc(db, collectionName, id);
  try {
    await deleteDoc(userRef);
    console.log("User deleted successfully");
  } catch (error) {
    console.error("Error deleting entry:", error);
    throw error;
  }
}

export async function UpdateEntryAsync(id, queryData) {
  try {
    const dataDocRef = doc(db, collectionName, id);
    await updateDoc(dataDocRef, queryData);

    console.log("User data updated successfully");
  } catch (error) {
    console.error("Error updating entry data:", error);
    throw error; // You can handle the error in your component
  }
}

export async function CreateEntryAsync(queryData) {
  try {
    const dataDocRef = collection(db, collectionName);
    const newDocRef = addDoc(dataDocRef, queryData);

    console.log("User created successfully with ID: ", newDocRef.id);
    return newDocRef.id; // Return the ID of the newly created user document
  } catch (error) {
    console.error("Error creating ${}: ", error);
    throw error; // You can handle the error in your component
  }
}
