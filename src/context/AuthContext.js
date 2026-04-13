import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest, apiTokenRequest } from "../authConfig";
// import { loginRequest, cartTokenRequest, orderTokenRequest } from "../authConfig";
import { apiRequest } from "../api/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { instance, accounts } = useMsal();

  const user = accounts[0] || null;

  const [appUserId, setAppUserId] = useState(null);
  const [appUserName, setAppUserName] = useState(null);
  const [isBootstrappingUser, setIsBootstrappingUser] = useState(false);
  const [bootstrapError, setBootstrapError] = useState(null);

  const login = useCallback(() => {
    instance.loginRedirect(loginRequest);
  }, [instance]);

  const logout = useCallback(() => {
    setAppUserId(null);
    setAppUserName(null);
    setBootstrapError(null);
    instance.logoutRedirect();
  }, [instance]);

  const getToken = useCallback(async () => {
    if (!user) return null;

    const res = await instance.acquireTokenSilent({
      ...apiTokenRequest,
      account: user,
    });

    return res.accessToken;
  }, [instance, user]);

  // const getCartToken = async () => {
  //   if (!user) return null;

  //   const res = await instance.acquireTokenSilent({
  //     ...cartTokenRequest,
  //     account: user,
  //   });

  //   return res.accessToken;
  // };

  // const getOrderToken = async () => {
  //   if (!user) return null;

  //   const res = await instance.acquireTokenSilent({
  //     ...orderTokenRequest,
  //     account: user,
  //   });

  //   return res.accessToken;
  // };

  useEffect(() => {
    const bootstrapUser = async () => {
      if (!user) {
        setAppUserId(null);
        setAppUserName(null);
        setBootstrapError(null);
        return;
      }

      try {
        setIsBootstrappingUser(true);
        setBootstrapError(null);

        const token = await getToken();

        console.log("react to user access token", token);
        console.log("id token claims", user.idTokenClaims);

        const payload = {
          name: user.idTokenClaims?.name || "",
          email: user.idTokenClaims?.email || "",
        };

        const response = await apiRequest("user", "/user/bootstrap", "POST", payload, token);

        setAppUserId(response.userId);
        setAppUserName(response.name);

      } catch (error) {
        console.error("Failed to bootstrap app user", error);
        setAppUserId(null);
        setAppUserName(null);
        setBootstrapError(error);

      } finally {
        setIsBootstrappingUser(false);
      }
    };

    bootstrapUser();
  }, [user, getToken]);

  const value = useMemo(
    () => ({
      user,
      appUserId,
      appUserName,
      isBootstrappingUser,
      bootstrapError,
      login,
      logout,
      getToken
      // getCartToken,
      // getOrderToken
    }),
    [user, appUserId, appUserName, isBootstrappingUser, bootstrapError, login, logout, getToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);