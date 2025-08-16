import { useQuery, useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  salary: string;
}

const API_BASE = "";

// Storage for JWT token
export const authStorage = {
  getToken: () => localStorage.getItem("auth_token"),
  setToken: (token: string) => localStorage.setItem("auth_token", token),
  removeToken: () => localStorage.removeItem("auth_token"),
};

// API helper with auth headers
export const apiClient = {
  get: async (url: string) => {
    const token = authStorage.getToken();
    const response = await fetch(`${API_BASE}${url}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) {
      if (response.status === 401) {
        authStorage.removeToken();
        window.location.href = "/login";
      }
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  },

  post: async (url: string, data: any) => {
    const token = authStorage.getToken();
    const response = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 401) {
        authStorage.removeToken();
        window.location.href = "/login";
      }
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  },

  put: async (url: string, data: any) => {
    const token = authStorage.getToken();
    const response = await fetch(`${API_BASE}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 401) {
        authStorage.removeToken();
        window.location.href = "/login";
      }
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  },

  patch: async (url: string, data?: any) => {
    const token = authStorage.getToken();
    const response = await fetch(`${API_BASE}${url}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      if (response.status === 401) {
        authStorage.removeToken();
        window.location.href = "/login";
      }
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  },

  delete: async (url: string) => {
    const token = authStorage.getToken();
    const response = await fetch(`${API_BASE}${url}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        authStorage.removeToken();
        window.location.href = "/login";
      }
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  },
};

export function useAuth() {
  const queryClient = useQueryClient();
  const hasToken = !!authStorage.getToken();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: () => apiClient.get("/api/auth/user"),
    retry: false,
    enabled: hasToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const { token, user } = await response.json();
    authStorage.setToken(token);
    queryClient.setQueryData(["/api/auth/user"], user);
    return user;
  };

  const logout = () => {
    authStorage.removeToken();
    queryClient.clear();
    window.location.href = "/login";
  };

  return {
    user,
    isLoading: hasToken ? isLoading : false,
    isAuthenticated: !!user && hasToken,
    login,
    logout,
  };
}
