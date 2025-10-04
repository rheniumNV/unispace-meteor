import axios from "axios";
import {
  FAILED_NOT_FOUND,
  FAILED_UNKNOWN,
  Result,
  Success,
} from "../../type/result";
import { ResoniteUser, ResoniteUserSchema } from "../model/user";

export const getResoniteUser = async (
  id: string,
): Promise<Result<ResoniteUser, typeof FAILED_NOT_FOUND>> => {
  try {
    const { status, data } = await axios.get<unknown>(
      `https://api.resonite.com/users/${id}`,
    );

    if (status === 404) {
      return FAILED_NOT_FOUND;
    }

    const user = ResoniteUserSchema.parse(data);

    return Success({ ...(data as Record<string, unknown>), ...user });
  } catch (e) {
    console.error("getResoniteUser Error", e);
    return FAILED_UNKNOWN;
  }
};

export const searchResoniteUsers = async (
  query: string,
): Promise<Result<ResoniteUser[], typeof FAILED_UNKNOWN>> => {
  try {
    const { data } = await axios.get<unknown>(
      `https://api.resonite.com/users?name=${query}`,
    );

    if (!Array.isArray(data)) {
      console.error("searchResoniteUsers Error", data);
      return FAILED_UNKNOWN;
    }
    const users = data.map((user) => ({
      ...(user as Record<string, unknown>),
      ...ResoniteUserSchema.parse(user),
    }));

    return Success(users);
  } catch (e) {
    console.error("searchResoniteUsers Error", e);
    return FAILED_UNKNOWN;
  }
};
