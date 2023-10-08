import { Link } from "react-router-dom"
import { GetUsers } from "../../controllers/UserController";
import { useState, useEffect, setError } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    GetUsers()
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  return (
    <div className="careers">
      <div>
        <Link to="/users/create-user">
          <button>Create New User</button>
        </Link>
      </div>
      {users.map(user => (

        <Link to={user.id.toString()} key={user.id}>
          <p>{user.firstName} {user.lastName}</p>
          <p>{user.totalCost} $</p>
        </Link>
      ))}
    </div>
  )
}