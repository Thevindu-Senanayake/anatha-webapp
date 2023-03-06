export const APIBaseURI = "http://localhost:4000/api/v1";
export const cookiesConfig = { withCredentials: true };
export const axiosPostConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  ...cookiesConfig,
};
