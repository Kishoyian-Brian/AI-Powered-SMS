export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  expiresIn: '7d' as const,
};

