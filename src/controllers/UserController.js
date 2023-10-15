import {
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db, userCollection } from "../firebase";
import { UserDto } from "../objectDTOs/UsersDto";

export async function GetUsers() {
  try {
    const querySnapshot = await getDocs(userCollection);
    const data = [];
    querySnapshot.forEach((userDoc) => {
      const userDto = new UserDto({ id: userDoc.id, ...userDoc.data() });
      data.push(userDto);
    });
    return data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
}

export async function GetUser(id) {
  const userRef = doc(db, "user", id); // Replace "users" with your Firestore collection name

  try {
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return new UserDto({ id: userDoc.id, ...userDoc.data() });
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function DeleteUser(id) {
  const userRef = doc(db, "user", id);
  try {
    await deleteDoc(userRef);
    console.log("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function UpdateUser(id, userData) {
  try {
    const userDocRef = doc(db, "user", id);
    await updateDoc(userDocRef, userData);
    console.log("User data updated successfully");
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error; // You can handle the error in your component
  }
}

export async function CreateUser(userData) {
  try {
    const newUserDocRef = addDoc(userCollection, userData);
    console.log("User created successfully with ID: ", newUserDocRef.id);
    return newUserDocRef.id; // Return the ID of the newly created user document
  } catch (error) {
    console.error("Error creating user: ", error);
    throw error; // You can handle the error in your component
  }
}
