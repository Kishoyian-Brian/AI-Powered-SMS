export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  accessTokenExpiresIn: '15m' as const, // Short-lived access token
  refreshTokenExpiresIn: '7d' as const, // Long-lived refresh token
};

