import { useParams, useNavigate } from "react-router-dom";
import { UpdateUser } from "../../controllers/UserController";
import { useEffect, useState, setError } from "react";
import {
  GetGroupByIdAsync,
  DeleteGroupAsync,
} from "../../controllers/GroupsController";

export default function GroupDetails({}) {
  const { id } = useParams();
  const [group, setGroup] = useState([]); // Initialize user as null or an initial value
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    GetGroupByIdAsync(id)
      .then((data) => {
        setGroup(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await UpdateUser(id, group);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroup({ ...group, [name]: value });
  };


  const handleDeleteClick = async () => {
    try {
      await DeleteGroupAsync(id);
      navigate("/groups");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="career-details">
      {group ? (
        <div>
          {isEditing ? (
            <div>
              <div>
                <label style={{ marginRight: "10px" }}>Group Name:</label>
                <input
                  type="text"
                  name="name"
                  value={group.name}
                  onChange={handleInputChange}
                />
              </div>
              <button
                onClick={handleSaveClick}
                style={{ marginLeft: "10px", marginTop: "10px" }}
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              <div>
                <p>
                  <strong>Group Name:</strong> {group.name}
                </p>
              </div>
              <div>
                <p>
                  <strong>Users:</strong>
                </p>
              </div>
              <button onClick={handleEditClick} style={{ marginRight: "10px" }}>
                Edit
              </button>
              <button onClick={handleDeleteClick}>Delete</button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
