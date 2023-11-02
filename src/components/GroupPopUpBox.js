import React, { useState, useEffect, setError } from "react";
import Modal from "react-modal";
import { GetAllGroupsAsync } from "../controllers/GroupsController";
import { CreateEntryAsync } from "../controllers/EntriesController";
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

const AddGroupModal = ({ isOpen, onRequestClose, arena, time }) => {
  const [groups, setGroups] = useState([]);
  const [groupSuggestions, setGroupSuggestions] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedOption, setSelectedOption] = useState(""); // New state for selected option

  useEffect(() => {
    GetAllGroupsAsync()
      .then((data) => {
        setGroups(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, [groups]);

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

  const handleAddGroup = () => {
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
      <h2>Add Group</h2>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Group Name"
          value={inputText}
          onChange={handleGroupInputChange}
          style={{ flex: 1, padding: "5px" }}
        />
        <button
          onClick={handleAddGroup}
          style={{
            marginLeft: "10px", // Add spacing between the input and button
            padding: "5px 10px", // Add padding to the button
            backgroundColor: "#007bff", // Example background color
            color: "white", // Example text color
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Group
        </button>
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
