import { Outlet, NavLink, ScrollRestoration } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";

export default function RootLayout() {
  return (
    <div className="root-layout">
      <ScrollRestoration />
      <header>
        <nav>
          <h1>BeachvolleyballCRM</h1>
          <NavLink to="/">Home</NavLink>
          <NavLink to="schedule">Schedule</NavLink>
          <NavLink to="entries">Entries</NavLink>
          <NavLink to="users">Users</NavLink>
        </nav>
        <Breadcrumbs />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
