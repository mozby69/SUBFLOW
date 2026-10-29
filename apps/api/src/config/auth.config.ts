
// const isProduction = process.env.NODE_ENV === "production";

// export const authConfig = {
//     accessTokenCookie: "access_token",
//     refreshTokenCookie: "refresh_token",

//     accessTokenCookieMaxAge:
//         7 * 24 * 60 * 60 * 1000, // 7 days

//     refreshTokenCookieMaxAge:
//         30 * 24 * 60 * 60 * 1000, // 30 days

//     cookieOptions: {
//         httpOnly: true,
//         secure: isProduction,
//         sameSite: "lax" as const,
//         path: "/",
//     },
// } as const;



const isHttps = process.env.COOKIE_SECURE === "true";

export const authConfig = {
  accessTokenCookie: "access_token",
  refreshTokenCookie: "refresh_token",

  accessTokenCookieMaxAge:
    7 * 24 * 60 * 60 * 1000,

  refreshTokenCookieMaxAge:
    30 * 24 * 60 * 60 * 1000,

  cookieOptions: {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax" as const,
    path: "/",
  },
} as const;