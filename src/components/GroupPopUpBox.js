import React, { useState, useEffect, setError } from "react";
import Modal from "react-modal";
import { GetAllGroupsAsync } from "../controllers/GroupsController";
import {
  CreateEntryAsync,
  DeleteEntryAsync,
} from "../controllers/EntriesController";
import { UpdateAbsenceAsync } from "../controllers/AbsenceController";

import { db } from "../firebase";
import { doc } from "firebase/firestore";

const customStyles = {
  content: {
    width: "30%", // Adjust the width as needed
    height: "50%", // Set height to "auto" to fit content without scrolling
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "2px 2px 4px #aaa",
    padding: "20px",
    backgroundColor: "white",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.7)",
  },
};

function Switch({ checked, onChange }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="slider round"></span>
    </label>
  );
}

const AddGroupModal = ({ isOpen, onRequestClose, arena, time, entry }) => {
  const [groups, setGroups] = useState([]);
  const [groupSuggestions, setGroupSuggestions] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState();
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedEntry, setSelectedEntry] = useState();

  useEffect(() => {
    if (entry) {
      setSelectedEntry({ ...entry });
    } else {
      setSelectedEntry(null);
    }
  }, [entry]);

  useEffect(() => {
    GetAllGroupsAsync()
      .then((data) => {
        setGroups(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  const handleGroupInputChange = (e) => {
    const inputText = e.target.value;
    setInputText(inputText);

    if (inputText === "") {
      setGroupSuggestions(groups);
    } else {
      const filteredSuggestions = groups.filter((group) =>
        group.name.toLowerCase().includes(inputText.toLowerCase())
      );
      setGroupSuggestions(filteredSuggestions);
    }
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setInputText(group.name);
    setGroupSuggestions([]);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleUpdateEntry = async () => {
    const updatedData = {
      ...selectedEntry.group.absence.array.map((user) => {
        return { user: doc(db, "users", user.user.id), absence: user.absence };
      }),
    };
    await UpdateAbsenceAsync(selectedEntry.group.absence.id, {array: [updatedData]});

  };

  const handleDeleteEntry = async (id) => {
    await DeleteEntryAsync(id);
    onRequestClose();
  };

  const handleToggleSwitch = async (index) => {
    const updatedEntry = { ...selectedEntry };
    updatedEntry.group.absence.array[index].absence =
      !updatedEntry.group.absence.array[index].absence;
    setSelectedEntry(updatedEntry);
  };

  const handleOpenEntry = () => {
    Promise.all([
      doc(db, "groups", selectedGroup.id),
      doc(db, "arenas", arena.id),
    ])
      .then(([groupRef, arenaRef]) => {
        CreateEntryAsync({ group: groupRef, arena: arenaRef, datetime: time });
        onRequestClose();
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    setInputText();
    setSelectedGroup();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Group Modal"
      style={customStyles}
    >
      <h2>{selectedEntry ? "Group" : "Add Group"}</h2>
      <div style={{ display: "flex", alignItems: "center" }}>
        {selectedEntry ? (
          <div>
            {console.log(selectedEntry)}

            <div>
              <p>Name: {selectedEntry.group.group.name}</p>
              <p>Users:</p>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Appearance</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEntry.group.absence.array.map((user, index) => (
                    <tr key={index}>
                      <td>{user.user.firstName + " " + user.user.lastName}</td>
                      <td className="centered-column">
                        <Switch
                          checked={user.absence}
                          onChange={() => handleToggleSwitch(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 10 }}>
              <button onClick={() => handleUpdateEntry()}>Update Entry </button>
              <button onClick={() => handleDeleteEntry(selectedEntry.id)}>
                Delete Entry
              </button>{" "}
            </div>
          </div>
        ) : (
          // Display add form
          <div>
            <input
              type="text"
              placeholder="Group Name"
              value={inputText}
              onChange={handleGroupInputChange}
              style={{ flex: 1, padding: "5px" }}
            />
            <button onClick={handleOpenEntry} className="button">
              Add Group
            </button>
          </div>
        )}
      </div>
      <div>
        {groupSuggestions.length > 0 && (
          <ul className="suggestions">
            {groupSuggestions.map((group, index) => (
              <li
                key={index}
                onClick={() => handleGroupSelect(group)}
                style={{ cursor: "pointer", padding: "5px" }}
              >
                {group.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3>Select an Option:</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOptionSelect("Male");
          }}
          style={{
            marginRight: "10px",
            padding: "5px 10px",
            backgroundColor:
              selectedOption === "Male" ? "#007bff" : "transparent",
            color: selectedOption === "Male" ? "white" : "black",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Male
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent event propagation
            handleOptionSelect("Female");
          }}
          style={{
            padding: "5px 10px",
            backgroundColor:
              selectedOption === "Female" ? "#007bff" : "transparent",
            color: selectedOption === "Female" ? "white" : "black",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Female
        </button>
      </div>
    </Modal>
  );
};

export default AddGroupModal;
