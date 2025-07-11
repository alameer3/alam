import { useState, useEffect } from "react";

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is authenticated
    const adminStatus = localStorage.getItem("isAdmin");
    const adminToken = localStorage.getItem("adminToken");
    
    // Simple token validation (in production, this would be more secure)
    if (adminStatus === "true" && adminToken && adminToken.startsWith("admin-authenticated-")) {
      setIsAdmin(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string) => {
    // In production, this would make an API call
    if (username === "admin" && password === "cinema@2024") {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminToken", "admin-authenticated-" + Date.now());
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
  };

  return {
    isAdmin,
    isLoading,
    login,
    logout
  };
}