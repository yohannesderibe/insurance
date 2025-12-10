import axios from "../../axios";

export const getMyProfile = async () => {
  const response = await axios.get("/Client/me");
  return response.data;
};
export default getMyProfile;
