import { createContext, useState } from 'react';
import * as auth from '../services/auth';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export default function UserContextComponent({ children }) {
  const [user, setUser] = useState(() => auth.getCurrentUser());

  async function login(username, password) {
    const user = await auth.login(username, password);
    setUser(user);

    return user;
  }

  return <UserContext.Provider value={{ user, login }}>
    {children}
  </UserContext.Provider>
}
