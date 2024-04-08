import { useEffect } from "react";
import { BASE_URL } from "../../env";
import axios from "axios";

export const PrivateRoute = ({ children }: React.PropsWithChildren) => {
  const token: string | null = localStorage.getItem("jwt");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
    const validateToken = async () => {
      try {
        const response = await axios.get(`${BASE_URL}auth/validateToken`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
      } catch (error) {
        console.log(" JWT INAVLIDO");
        localStorage.removeItem("jwt");
        window.location.href = "/login";
      }
    };
    validateToken();
  }, [token]);

  return <>{children}</>;
};
