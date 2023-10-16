import React, { useState, useEffect, setError } from "react";
import { CreateGroupAsync } from "../../controllers/GroupsController";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserSuggestionsModal from "../../components/UserSuggestionModel";
import { GetUsers } from "../../controllers/UserController";

export default function UsersCreate() {
  const [existingUsers, setExistingUsers] = useState([]);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    GetUsers()
      .then((data) => {
        setExistingUsers(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  const handleUserClick = (selectedUser) => {
    setSelectedUsers((prevSelectedUsers) => [
      ...prevSelectedUsers,
      selectedUser,
    ]);

    console.log(selectedUsers);
    setUserModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "groupName") {
      setGroupName(value);
    } else if (name === "users") {
      setSelectedUsers(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const group = { name: groupName, users: selectedUsers };
    CreateGroupAsync(group);

    toast.success("Group created successfully", {
      autoClose: 15000,
    });

    setGroupName("");
    setSelectedUsers([]);
  };

  return (
    <div className="careers">
      <h1>Create a New Group</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="bane">Name:</label>
          <input
            type="text"
            id="groupName"
            name="groupName"
            value={groupName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={{ marginBottom: "50px" }}>
          <label htmlFor="users">Users</label>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              id="users"
              name="users"
              value={selectedUsers
                .map((user) => user.firstName + " " + user.lastName)
                .join(", ")}
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
        <div>
          <button type="submit">Create Group</button>
        </div>
      </form>
    </div>
  );
}
