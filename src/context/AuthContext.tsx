import React, { createContext, useState, useContext, ReactNode } from 'react';

type User = {
  id: number;
  username: string;
  role: 'Store Manager' | 'Salesman' | 'Customer';
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => boolean;
  signup: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const hardcodedUsers: User[] = [
      { id: 1, username: 'Store Manager', role: 'Store Manager' },
      { id: 2, username: 'Sales Man', role: 'Salesman' }
    ];
  
    const hardcodedPasswords: { [key: string]: string } = {
      storemanager: 'password123',
      salesman: 'password123'
    };
  
    const foundUser = hardcodedUsers.find(u => u.username === username);
    
    const formattedUsername = username.replace(/\s+/g, '').toLowerCase();
    if (foundUser && hardcodedPasswords[formattedUsername] === password) {
      setUser(foundUser);
      return true;
    }
  
    const customers = JSON.parse(localStorage.getItem('users') || '[]');
    const customer = customers.find((c: { username: string, password: string }) => 
      c.username === username && c.password === password
    );

    if (customer) {
      setUser({ id: customer.id, username: customer.username, role: 'Customer' });
      return true;
    }
  
    return false;
  };
  
  const signup = (username: string, password: string): boolean => {
    const customers = JSON.parse(localStorage.getItem('users') || '[]');
    if (customers.some((c: { username: string }) => c.username === username)) {
      return false; // Username already exists
    }
    const newUser = { id: Date.now(), username, password };
    customers.push(newUser);
    localStorage.setItem('users', JSON.stringify(customers));
    setUser({ id: newUser.id, username, role: 'Customer' });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};