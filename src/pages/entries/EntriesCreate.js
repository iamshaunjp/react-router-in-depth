import React, { useState, useEffect, setError } from "react";
import { CreateEntryAsync } from "../../controllers/EntriesController";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetUsers } from "../../controllers/UserController";
import UserSuggestionsModal from "../../components/UserSuggestionModal";

export default function EntriesCreate() {
  const initialEntryState = {
    arenaName: "",
    users: [""],
    datetime: "",
  };

  const [entry, setEntry] = useState(initialEntryState);
  const [existingUsers, setExistingUsers] = useState([]);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]); // Initialize an empty array to store selected users

  useEffect(() => {
    GetUsers()
      .then((data) => {
        setExistingUsers(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntry({ ...entry, [name]: value });
  };

  const handleUserClick = (selectedUser) => {
    setSelectedUsers((prevSelectedUsers) => [
      ...prevSelectedUsers,
      {
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        id: selectedUser.id,
      },
    ]);
    setUserModalOpen(false);
    console.log(selectedUsers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    CreateEntryAsync(entry)
      .then(() => {
        toast.success("User created successfully", {
          autoClose: 15000,
        });
        setEntry(initialEntryState); // Reset the form after successful submission
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`);
      });
  };

  return (
    <div>
      <h2>Create New Entry</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "50px" }}>
          <label htmlFor="arenaName">Arena Name</label>
          <br />
          <select
            id="arenaName"
            name="arenaName"
            value={entry.arenaName}
            onChange={handleInputChange}
            required
          >
            <option value="">Select an Arena</option>
            <option value="Arena 1">Arena 1</option>
            <option value="Arena 2">Arena 2</option>
            <option value="Arena 3">Arena 3</option>
          </select>
        </div>

        <div style={{ marginBottom: "50px" }}>
          <label htmlFor="users">Users</label>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              id="users"
              name="users"
              value={selectedUsers}
              onChange={handleInputChange}
              onClick={() => setUserModalOpen(true)} // Open the modal on click
              required
            />
            <button
              type="button"
              onClick={() => setSelectedUsers([])}
              style={{
                cursor: "pointer",
              }}
            >
              Clean Data
            </button>
          </div>
        </div>
        <div>
          <UserSuggestionsModal
            isOpen={isUserModalOpen}
            onRequestClose={() => setUserModalOpen(false)}
            existingUsers={existingUsers}
            handleUserClick={handleUserClick}
            selectedUserIndex={selectedUserIndex}
            setSelectedUserIndex={setSelectedUserIndex}
          />
        </div>
        <div style={{ marginBottom: "50px" }}>
          <label htmlFor="datetime">Time Range</label>
          <input
            type="text"
            id="datetime"
            name="datetime"
            value={entry.datetime}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Create Entry</button>
      </form>
    </div>
  );
}
