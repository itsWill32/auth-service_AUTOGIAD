// auth-service/src/domain/interfaces/token.service.interface.ts

export interface JwtPayload {
  sub: string; // userId
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenService {
  /**
   * Genera un par de tokens (access + refresh)
   */
  generateTokenPair(payload: JwtPayload): TokenPair;

  /**
   * Verifica y decodifica un access token
   */
  verifyAccessToken(token: string): JwtPayload;

  /**
   * Verifica y decodifica un refresh token
   */
  verifyRefreshToken(token: string): JwtPayload;

  /**
   * Obtiene el tiempo de expiración del access token en segundos
   */
  getAccessTokenExpiresIn(): number;
}