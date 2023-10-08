import { useParams, useNavigate } from 'react-router-dom';
import { DeleteUser, GetUser, UpdateUser } from '../../controllers/UserController';
import { useEffect, useState, setError } from 'react';

export default function UserDetails({ }) {
  const { id } = useParams();
  const [user, setUser] = useState(null); // Initialize user as null or an initial value
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    GetUser(id)
      .then((data) => {
        setUser(data);
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
      await UpdateUser(id, user); // Implement UpdateUser to update user data
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleDeleteClick = () => {

    try {
      DeleteUser(id);
      navigate('/users');
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className="career-details">
      {user ? (
        <div>
          {isEditing ? (
            <div>
              <div>
                <label style={{ marginRight: '10px' }}>First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label style={{ marginRight: '10px' }}>Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label style={{ marginRight: '10px' }}>Cost:</label>
                <input
                  type="number"
                  name="totalCost"
                  value={user.totalCost}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label style={{ marginRight: '10px' }}>Phone Number:</label>
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                />
              </div>
              <button onClick={handleSaveClick} style={{ marginLeft: '10px', marginTop: '10px' }}>
                Save
              </button>
            </div>
          ) : (
            <div>
              <div>
                <p><strong>First Name:</strong> {user.firstName}</p>
              </div>
              <div>
                <p><strong>Last Name:</strong> {user.lastName}</p>
              </div>
              <div>
                <p><strong>Cost:</strong> {user.totalCost} $</p>
              </div>
              <div>
                <p><strong>Phone Number:</strong> {user.phone}</p>
              </div>
              <button onClick={handleEditClick} style={{ marginRight: '10px' }}>
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

