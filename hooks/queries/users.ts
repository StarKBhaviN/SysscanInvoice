import UsersAPI, {
  AddSubUserRequest,
  LoginRequest,
  SignupRequest,
} from "@/services/api/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUserProfileQuery = () =>
  useQuery({
    queryKey: ["user", "profile"],
    queryFn: UsersAPI.profile,
    staleTime: 5 * 60 * 1000,
  });

export const useUsersListQuery = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: UsersAPI.list,
    staleTime: 60 * 1000,
  });

export const useSignupMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SignupRequest) => UsersAPI.signup(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (payload: LoginRequest) => UsersAPI.login(payload),
  });

export const useRefreshTokenMutation = () =>
  useMutation({
    mutationFn: () => UsersAPI.refreshToken(),
  });

export const useAddSubUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddSubUserRequest) => UsersAPI.addSubUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUserMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => UsersAPI.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUploadPhotoMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: { uri: string; name: string; type: string }) =>
      UsersAPI.uploadPhoto(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
};
