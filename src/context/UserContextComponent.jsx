import { createContext, useState } from "react";
import * as auth from "../services/users";

export const UserContext = createContext();

export default function UserContextComponent({ children }) {
  const [user, setUser] = useState(() => auth.getCurrentUser());

  async function login(username, password) {
    const user = await auth.login(username, password);
    setUser(user);

    return user;
  }

  function logout() {
    auth.logout();
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
