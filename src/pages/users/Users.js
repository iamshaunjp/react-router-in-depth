import { Link, useLoaderData } from "react-router-dom"

export default function Users() {
  const users = useLoaderData()

  return (
    <div className="careers">
      {users.map(user => (
        <Link to={user.id.toString()} key={user.id}>
          <p>{user.firstName} {user.lastName}</p>
          <p>{user.totalCost} $</p>
        </Link>
      ))}
    </div>
  )
}

// data loader
export const usersLoader = async () => {
  const res = await fetch('http://localhost:4000/users')

  if (!res.ok) {
    throw Error('Could not fetch the list of users')
  }

  return res.json()
}