export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  user: User;
}

export interface Post {
  _id: string;
  content: string;
  image?: string;
  createdAt: string;
  user: User;
  likes: string[];
  comments: Comment[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText?: string;
  headers: Record<string, string>;
  config: Record<string, unknown>;
  request?: unknown;
}

export interface PostsResponse {
  posts: Post[];
}

export interface CommentResponse {
  comment: Comment;
}

export interface Notification {
  _id: string;
  from: {
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  to: string;
  type: "like" | "comment" | "follow";
  post?: {
    _id: string;
    content: string;
    image?: string;
  };
  comment?: {
    _id: string;
    content: string;
  };
  createdAt: string;
}