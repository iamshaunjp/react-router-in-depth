import {
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { db, entriesCollection } from "../firebase";

import { Entries } from "../entities/EntriesEntity";
import { GetRefUserAsync } from "./UserController";
import { GetGroupByIdAsync } from "./GroupsController";
import { CreateAbsenceAsync } from "./AbsenceController";


const collectionName = "entries";

export async function GetAllEntriesAsync() {
  try {
    const querySnapshot = await getDocs(entriesCollection);
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
  const userRef = doc(db, collectionName, id);

  try {
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = { id: userDoc.id, ...userDoc.data() };
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching entry:", error);
    throw error;
  }
}

export async function GetAllEntriesFromDateAndArenaAsyc(arena, datetime) {
  try {
    const q = query(
      entriesCollection,
      where("arena", "==", doc(db, "arenas", arena.id)),
      where("datetime", ">=", new Date(datetime.setHours(0, 0, 0, 0)),
      where("datetime", "<", new Date(datetime.setHours(23, 59, 59, 999))))
    );

    const querySnapshot = await getDocs(q);

    const entries = [];
    querySnapshot.forEach((doc) => {
      const entryData = doc.data();
      const entry = new Entries({ id: doc.id, ...entryData });
      entries.push(entry);
    });
    return entries;
  } catch (error) {
    console.error("Error fetching Entries:", error);
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
    throw error;
  }
}

export async function CreateEntryAsync(queryData) {
  try {
    const group = await GetGroupByIdAsync(queryData.group);

    const absenceData = await Promise.all(group.users.map(async (user) => {
      const userDoc = await GetRefUserAsync(user);
      return {
        user: doc(db, "users", userDoc.id),
        absence: false,
      };
    }));

    console.log(absenceData);

    const absenceRef = await CreateAbsenceAsync(absenceData);

    queryData.group = {
      group: queryData.group,
      absence: absenceRef
    }

    const dataDocRef = collection(db, collectionName);
    const newDocRef = addDoc(dataDocRef, queryData);

    console.log("Entry created successfully.");
    return newDocRef;
  } catch (error) {
    console.error("Error creating ${}: ", error);
    throw error;
  }
}