import axios from "axios";
import type { ActorProfile } from "../../type/BaseProfile";

const API = "http://localhost:5150/api";

export type ActorRole = "Manager" | "Finance" | "Operator";

export const getActorProfile = async (
  role: ActorRole
): Promise<ActorProfile> => {
  const res = await axios.get(`${API}/${role}/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};
