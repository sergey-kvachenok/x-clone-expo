import { useAuth } from "@clerk/clerk-expo";
import axios, { AxiosInstance } from "axios";
import { useMemo } from "react";

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();

  const api = useMemo(() => {
    const baseURL = process.env.EXPO_PUBLIC_API_URL;
    console.log({ baseURL });

    const axiosInstance = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    axiosInstance.interceptors.request.use(async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error getting auth token:", error);
      }
      return config;
    });

    return axiosInstance;
  }, [getToken]);

  return api;
};

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/users/sync"),
  getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),
  updateProfile: (api: AxiosInstance, userData: any) =>
    api.put("/users/profile", userData),
};

export const postApi = {
  getPosts: (api: AxiosInstance) => api.get("/posts"),
  getUserPosts: (api: AxiosInstance, username: string) =>
    api.get(`/posts/user/${username}`),
  createPost: (api: AxiosInstance, content: string, image?: string) =>
    api.post("/posts", { content, image }),
  likePost: (api: AxiosInstance, postId: string) =>
    api.post(`/posts/${postId}/like`),
  deletePost: (api: AxiosInstance, postId: string) =>
    api.delete(`/posts/${postId}`),
};

export const commentApi = {
  createComment: (api: AxiosInstance, postId: string, content: string) =>
    api.post(`/comments/post/${postId}`, { content }),
};
