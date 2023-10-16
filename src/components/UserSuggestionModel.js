import React, {useState} from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Set the root element for the modal

const customStyles = {
  content: {
    width: "30%", // Adjust the width as needed
    margin: "auto", // Center the modal horizontally
  },
};

export default function UserSuggestionsModal({
  isOpen,
  onRequestClose,
  existingUsers,
  handleUserClick,
  selectedUserIndex,
  setSelectedUserIndex,
}) {

  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = existingUsers.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="User Suggestions Modal"
      style={customStyles}
    >
      <input
        type="text"
        placeholder="Search Users"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul>
        {filteredUsers.map((existingUser, index) => (
          <li
            key={index}
            onClick={() => handleUserClick(existingUser)}
            className={`user-list-item ${
              selectedUserIndex === index ? "selected" : ""
            }`}
            onMouseEnter={() => setSelectedUserIndex(index)}
            onMouseLeave={() => setSelectedUserIndex(null)}
          >
            {existingUser.firstName} {existingUser.lastName}
          </li>
        ))}
      </ul>
    </Modal>
  );
}