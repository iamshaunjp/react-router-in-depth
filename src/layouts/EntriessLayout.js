import { Outlet } from "react-router-dom"

export default function EntriesLayout() {
  return (
    <div className="careers-layout">
      <button className=""> Add New</button>
      <h2>Entries</h2>
      
      <Outlet />
    </div>
  )
}
