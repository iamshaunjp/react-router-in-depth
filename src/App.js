import {
  createBrowserRouter, 
  createRoutesFromElements,
  Route, 
  RouterProvider
} from 'react-router-dom'

// pages
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Careers, { careersLoader } from './pages/entries/Entries'
import CareerDetails, { careerDetailsLoader } from "./pages/entries/EntryDetails"
import CareersError from './pages/entries/CareersError'
import Users, { usersLoader } from './pages/users/Users'


// layouts
import RootLayout from './layouts/RootLayout'
import EntriesLayout from './layouts/EntriessLayout'
import UsersLayout from './layouts/UsersLayout'
import UserDetails, { userDetailsLoader } from './pages/users/UserDetails'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="entries" element={<EntriesLayout />} errorElement={<CareersError />}>
        <Route 
          index 
          element={<Careers />} 
          loader={careersLoader}
          errorElement={<CareersError />}
        />
        <Route 
          path=":id" 
          element={<CareerDetails />}
          loader={careerDetailsLoader}
        />
      </Route>

      <Route path="users" element={<UsersLayout />} errorElement={<CareersError />}>
        <Route 
          index 
          element={<Users />} 
          loader={usersLoader}
          errorElement={<></>}
        />
        <Route 
          path=":id" 
          element={<UserDetails />}
          loader={userDetailsLoader}
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
