import { Link } from "react-router-dom"
import { GetAllGroupsAsync } from "../../controllers/GroupsController";
import { useState, useEffect, setError } from "react";

export default function Groups() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    GetAllGroupsAsync()
      .then((data) => {
        setGroups(data);
        console.log(data)
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  return (
    <div className="careers">
      <div>
        <Link to="/groups/create-group">
          <button>Create New Group</button>
        </Link>
      </div>
      {groups.map(group => (

        <Link to={group.id.toString()} key={group.id}>
          <p>{group.name}</p>
        </Link>
      ))}
    </div>
  )
}