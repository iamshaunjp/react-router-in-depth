import { Link } from "react-router-dom"
import React, { useState, setError, useEffect } from "react";
import { GetAllEntriesAsync } from "../../controllers/EntriesController";

export default function Entries() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    GetAllEntriesAsync()
      .then((data) => {
        setEntries(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);


  console.log(entries);
  return (
    <div className="careers">
      <div>
        <Link to="/entries/create-entry">
          <button>Create New Entry</button>
        </Link>
      </div>
      {entries.map((entry) => (
        <Link to={entry.id.toString()} key={entry.id}>
          <p>Arena: {entry.arenaName}</p>
        </Link>
      ))}
    </div>
  );
}
