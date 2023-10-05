import { Link, useLoaderData } from "react-router-dom"

export default function Careers() {
  const entries = useLoaderData()

  return (
    <div className="careers">
      {entries.map(entry => (
        <Link to={entry.id.toString()} key={entry.id}>
          <p>Arena Name: {entry.arenaId}</p>
        </Link>
      ))}
    </div>
  )
}

// data loader
export const careersLoader = async () => {
  const res = await fetch('http://localhost:4000/games')

  if (!res.ok) {
    throw Error('Could not fetch the list of careers')
  }

  return res.json()
}