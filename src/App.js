import {
  createBrowserRouter, 
  createRoutesFromElements,
  Route, 
  RouterProvider
} from 'react-router-dom'

// pages
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Entries from './pages/entries/Entries'
import CareerDetails from "./pages/entries/EntryDetails"
import CareersError from './pages/entries/CareersError'

import Users from './pages/users/Users'
import UsersCreate from './pages/users/UsersCreate'


// layouts
import RootLayout from './layouts/RootLayout'
import EntriesLayout from './layouts/EntriessLayout'
import UsersLayout from './layouts/UsersLayout'
import UserDetails from './pages/users/UserDetails'
import { GetUsers } from './controllers/UserController'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="entries" element={<EntriesLayout />} errorElement={<CareersError />}>
        <Route 
          index 
          element={<Entries />} 
          errorElement={<CareersError />}
        />
        <Route 
          path=":id" 
          element={<CareerDetails />}
          loader={GetUsers}
        />
      </Route>

      <Route path="users" element={<UsersLayout />} errorElement={<CareersError />}>
        <Route 
          index 
          element={<Users />} 
          loader={GetUsers}
          errorElement={<></>}
        />
        <Route
          path=':create-user'
          element={<UsersCreate/>}>
        </Route>
        <Route 
          path=":id" 
          element={<UserDetails />}
        />
      </Route>


      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App
