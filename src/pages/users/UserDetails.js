import { useLoaderData, useParams } from 'react-router-dom'

export default function UserDetails() {
  const { id } = useParams()
  const user = useLoaderData()

  return (
    <div className="career-details">
      <h2>Name: {user.firstName} {user.lastName}</h2>
      <p>Cost: {user.totalCost}</p>
      <div className="details">
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta sed sunt ipsam quam assumenda quasi ipsa facilis laborum rerum voluptatem!</p>
      </div>
    </div>
  )
}

// data loader
export const userDetailsLoader = async ({ params }) => {
  const { id } = params

  const res = await fetch('http://localhost:4000/users/' + id)

  if (!res.ok) {
    throw Error('Could not find that user.')
  }

  return res.json()
}