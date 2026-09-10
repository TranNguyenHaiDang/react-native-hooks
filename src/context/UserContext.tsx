import React, { createContext, useContext, useState, ReactNode } from 'react';

// Kiểu dữ liệu thông tin người dùng (Câu hỏi mở rộng 1)
export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

// Kiểu dữ liệu cho Context
export interface UserContextType {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  logout: () => void;
  login: (customUser?: UserProfile) => void;
}

// Dữ liệu mẫu mặc định
export const defaultUserData: UserProfile = {
  name: 'Nguyễn Văn An',
  email: 'nguyenvanan@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
};

// Bước 1: Tạo context (Câu hỏi mở rộng 3: đưa sang tệp riêng để tái sử dụng)
export const UserContext = createContext<UserContextType | null>(null);

// Custom hook để sử dụng context nhanh và an toàn
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser phải được sử dụng bên trong UserProvider');
  }
  return context;
}

// Bước 2: Component Provider đóng gói để chia sẻ dữ liệu
interface UserProviderProps {
  children: ReactNode;
  initialUser?: UserProfile | null;
}

export function UserProvider({ children, initialUser = defaultUserData }: UserProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(initialUser);

  // Câu hỏi mở rộng 2: Chức năng đăng xuất
  const logout = () => {
    setUser(null);
  };

  const login = (customUser?: UserProfile) => {
    setUser(customUser || defaultUserData);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, login }}>
      {children}
    </UserContext.Provider>
  );
}
