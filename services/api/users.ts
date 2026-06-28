import axiosInstance from "@/utils/axiosConfig";

export type Role = "OWNER" | "ADMIN" | "USER";

export type User = {
  id: number;
  email: string;
  role: Role;
  username?: string;
  profileImage?: string | null;
  phoneNumber?: string | null;
  adminRefID?: number | null;
  createdAt?: string;
};

export type SignupRequest = {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
};

export type AddSubUserRequest = SignupRequest;

export const UsersAPI = {
  signup: async (payload: SignupRequest): Promise<User> => {
    console.log("User signup payload:", payload);

    const { data } = await axiosInstance.post<User>("/users/signup", payload);
    console.log("User signup response:", data);

    return data;
  },

  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await axiosInstance.post<LoginResponse>(
      "/users/login",
      payload
    );
    return data;
  },

  refreshToken: async (): Promise<LoginResponse> => {
    const { data } = await axiosInstance.post<LoginResponse>(
      "/users/refresh-token"
    );
    return data;
  },

  profile: async (): Promise<User> => {
    const { data } = await axiosInstance.get<User>("/users/profile");
    return data;
  },

  list: async (): Promise<User[]> => {
    const { data } = await axiosInstance.get<User[]>("/users");
    return data;
  },

  addSubUser: async (payload: AddSubUserRequest): Promise<User> => {
    const { data } = await axiosInstance.post<User>("/users/add", payload);
    return data;
  },

  delete: async (id: number): Promise<{ success: boolean }> => {
    const { data } = await axiosInstance.delete<{ success: boolean }>(
      `/users/${id}`
    );
    return data;
  },

  uploadPhoto: async (file: {
    uri: string;
    name: string;
    type: string;
  }): Promise<User> => {
    const form = new FormData();
    // @ts-ignore RN FormData type
    form.append("photo", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
    const { data } = await axiosInstance.post<User>("/users/photo", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};

export default UsersAPI;
