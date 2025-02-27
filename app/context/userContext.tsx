'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { UserData } from '../lib/data/type';
import { getCurrentUserInfo } from '../lib/data/api';
import { usePathname } from 'next/navigation';

export type UserContextType = {
    user: UserData | undefined,
    setUser: (newUser: UserData) => void
}


const initialContextValue: UserContextType = {
    user: undefined,
    setUser: () => {
      throw new Error('setUser function must be used within a UserProvider');
    },
  };


const UserContext = createContext<UserContextType>(initialContextValue);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | undefined>(undefined);
  const pathname = usePathname()

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUserInfo();
      setUser(userData);
    };

    fetchUser();
  }, [pathname]);

  return <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);