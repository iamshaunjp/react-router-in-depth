import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Entries from "./pages/entries/Entries";
import EntriesDetails from "./pages/entries/EntryDetails";
import Error from "./pages/entries/Error";

import Users from "./pages/users/Users";
import UsersCreate from "./pages/users/UsersCreate";
import EntriesCreate from "./pages/entries/EntriesCreate";

// layouts
import RootLayout from "./layouts/RootLayout";
import EntriesLayout from "./layouts/EntriesLayout";
import UsersLayout from "./layouts/UsersLayout";
import UserDetails from "./pages/users/UserDetails";
import { GetUsers } from "./controllers/UserController";
import { GetAllEntriesAsync } from "./controllers/EntriesController";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />

      <Route
        path="entries"
        element={<EntriesLayout />}
        errorElement={<Error />}
      >
        <Route index element={<Entries />} errorElement={<Error />} />
        <Route path=":create-entry" element={<EntriesCreate />}></Route>
        <Route
          path=":id"
          element={<EntriesDetails />}
          loader={GetAllEntriesAsync}
        />
      </Route>

      <Route path="users" element={<UsersLayout />} errorElement={<Error />}>
        <Route
          index
          element={<Users />}
          loader={GetUsers}
          errorElement={<></>}
        />
        <Route path=":create-user" element={<UsersCreate />}></Route>
        <Route path=":id" element={<UserDetails />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
