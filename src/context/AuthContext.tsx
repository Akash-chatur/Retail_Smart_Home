import React, { createContext, useState, useContext, ReactNode } from 'react';

type User = {
  id: number;
  username: string;
  role: 'Store Manager' | 'Salesman' | 'Customer';
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // const login = async (username: string, password: string): Promise<boolean> => {
  //   try {
  //     const response = await fetch('http://localhost:8082/MyServletProject/UserServlet', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ username, password, action: 'login' })
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       console.log("login response = ",response)
  //       if (result.status === 'success') {
  //         setUser({ id: Date.now(), username, role: result.role || 'Customer' });
  //         return true;
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Login error:', error);
  //   }
  //   return false;
  // };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8082/MyServletProject/UserServlet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, action: 'login' }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("login response = ", result); // Print the result instead of response for clarity
  
        if (result.status === 'success') {
          setUser({
            id: result.userId, 
            username: result.username,
            role: result.role || 'Customer' 
          });
          localStorage.setItem('userId', result.userId)
          return true;
        } else {
          console.error('Login failed:', result.message); // Handle error case if login fails
        }
      } else {
        console.error('Server returned an error:', response.status);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    return false;
  };

  
  const signup = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8082/MyServletProject/UserServlet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: 'Customer' })
      });

      if (response.ok) {
        const result = await response.json();
        return result.status === 'success';
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
    return false;
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