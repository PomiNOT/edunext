import UserContextComponent from './context/UserContextComponent';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { UserContext } from './context/UserContextComponent';
import { useContext } from 'react';

function ProtectedRoute({ roles }) {
  const { user } = useContext(UserContext);
  if (!user) return <Navigate to={'/login'} replace />
  if (!roles.includes(user.role)) return <Navigate to={'/login'} replace />

  return <Outlet />
}

export default function App() {
  const main = <BrowserRouter>
    <Routes>
      <Route path='/login' element={<LoginPage />}></Route>
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path='/admin' element={<AdminPage />}></Route>
      </Route>
    </Routes>
  </BrowserRouter>;

  return (
    <UserContextComponent>
      {main}
    </UserContextComponent>
  )
}
