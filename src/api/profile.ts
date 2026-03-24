import { api } from "../utils/api";
import type { UpdateProfileType } from "../interfaces/schemas/profile";
import type { GeneralResponse } from "../interfaces/generalResponse";
import type { UserProfile } from "../interfaces/auth";

export const updateProfileApi = async (data: UpdateProfileType): Promise<GeneralResponse<UserProfile>> => {
  const formData = new FormData();

  if (data.user_name) formData.append("user_name", data.user_name);
  if (data.display_name) formData.append("display_name", data.display_name);
  
  if (data.avatar instanceof File) {
    formData.append("avatar", data.avatar);
  }

  const response = await api.patch<GeneralResponse<UserProfile>>("/api/profile/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data", 
    },
  });

  return response.data;
};