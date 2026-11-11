import { auth } from 'express-oauth2-jwt-bearer';

export const checkJwt = (req: any, res: any, next: any) => {
  const issuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL;
  const audience = process.env.AUTH0_AUDIENCE;

  if (!issuerBaseURL || !audience) {
    console.error('Missing Auth0 backend configuration (AUTH0_ISSUER_BASE_URL or AUTH0_AUDIENCE)');
    return res.status(500).json({ error: 'Auth0 backend configuration is missing.' });
  }

  const jwtMiddleware = auth({
    audience,
    issuerBaseURL,
  });

  return jwtMiddleware(req, res, next);
};
