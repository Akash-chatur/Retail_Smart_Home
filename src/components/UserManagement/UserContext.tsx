import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  password: string;
  role: 'Store Manager' | 'Salesman' | 'Customer';
}

interface UserContextType {
  users: User[];
  addUser: (username: string, password: string, role: 'Store Manager' | 'Salesman' | 'Customer') => boolean;
  updateUser: (user: User) => void;
  deleteUser: (id: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  const addUser = (username: string, password: string, role: 'Store Manager' | 'Salesman' | 'Customer') => {
    if (users.some(user => user.username === username)) {
      return false; // User already exists
    }
    const newUser: User = { id: Date.now(), username, password, role };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return true;
  };

  const updateUser = (updatedUser: User) => {
    const updatedUsers = users.map(user => user.id === updatedUser.id ? updatedUser : user);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const deleteUser = (id: number) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};