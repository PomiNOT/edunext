import UserContextComponent from "./context/UserContextComponent";
import ClientPage from "./pages/client/ClientPage";
import ClientClassesListPage from "./pages/client/ClientClassesListPage";
import AdminPage from "./pages/admin/AdminPage";
import AdminSubjectPage from "./pages/admin/AdminSubjectPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminClassesPage from "./pages/admin/AdminClassesPage";
import LoginPage from "./pages/login/LoginPage";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { UserContext } from "./context/UserContextComponent";
import { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminSubjectDetailPage from "./pages/admin/AdminSubjectDetailPage";

function ProtectedRoute({ roles }) {
  const { user } = useContext(UserContext);
  if (!user) return <Navigate to={"/"} replace />;
  if (!roles.includes(user.role)) return <Navigate to={"/"} replace />;

  return <Outlet />;
}

export default function App() {
  const main = (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<AdminPage />}>
            <Route path="subjects" element={<AdminSubjectPage />} />
            <Route path="subjects/:id" element={<AdminSubjectDetailPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="classes" element={<AdminClassesPage />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute roles={["teacher", "student"]} />}>
          <Route path="/client" element={<ClientPage />}>
            <Route path="classes" element={<ClientClassesListPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );

  return <UserContextComponent>{main}</UserContextComponent>;
}
