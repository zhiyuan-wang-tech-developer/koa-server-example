import * as jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "9u8nnjksfdt98*(&*%T$#hsfjk";
const timeToLast = 3600 * 4; // our JWT tokens are valid for 4 hours

interface JwtPayload {
  id: number;
}

/**
 * @summary to sign JWT
 * @returns JSON Web Token string
 */
export const sign = (data: JwtPayload): string =>
  jwt.sign({ data }, secretKey, { expiresIn: timeToLast });

/**
 * @summary to verify JWT
 * @returns decoded token
 */
export const verify = (token: string): { data: JwtPayload } =>
  jwt.verify(token, secretKey) as { data: JwtPayload };
