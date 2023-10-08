import { Link } from "react-router-dom"
import { db } from "../../firebase"
import React, { useEffect, useState } from "react";
import { collection, doc, getDocs } from "firebase/firestore"

export default function Careers() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Reference to the "items" collection
    const itemsRef = collection(db, "users");

    // Fetch the collection
    itemsRef.get().then((querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setItems(data);
    });
  }, []);

  return (
    <div className="careers">
      {/* {entries.map(entry => (
        <Link to={entry.id.toString()} key={entry.id}>
          <p>Arena Name: {entry.arenaId}</p>
        </Link>
      ))} */}

        {items.map((item) => (
                  <Link key={item.id}>
                    {item.name}: {item.description}
                  </Link>
                ))}
    </div>
  )
}

// // data loader
// export const careersLoader = async () => {
//   const res = await fetch('http://localhost:4000/games')

//   if (!res.ok) {
//     throw Error('Could not fetch the list of careers')
//   }

//   return res.json()
// }