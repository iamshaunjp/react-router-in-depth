import { Outlet } from "react-router-dom"

export default function UsersLayout() {
  return (
    <div className="careers-layout">
      <h2>Users</h2>
      
      <Outlet />
    </div>
  )
}
