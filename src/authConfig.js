export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID,
    authority: process.env.REACT_APP_AUTHORITY,
    knownAuthorities: [process.env.REACT_APP_KNOWN_AUTHORITY],
    redirectUri: process.env.REACT_APP_REDIRECT_URI
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false
  }
};

export const loginRequest = {
  scopes: ["openid", "profile", "email", process.env.REACT_APP_API_SCOPE]
};

export const apiTokenRequest = {
  scopes: [process.env.REACT_APP_API_SCOPE]
};



// Testing in Local Environment

// export const loginRequest = {
//   scopes: ["openid", "profile", "email", "api://4d8fa299-33a9-4faa-b905-50ab451f9e15/access_as_user"],
// };

// export const cartTokenRequest = {
//   scopes: ["api://4729242b-eb9a-43da-8d75-bbbfbe3caa17/access_as_user"]
// };

// export const orderTokenRequest = {
//   scopes: ["api://5ed76f51-1170-46f5-beae-f7860b3e3941/access_as_user"]
// };