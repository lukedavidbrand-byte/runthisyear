export default function handler(req, res) {
  const clientId = process.env.STRAVA_CLIENT_ID;

  const redirectUri =
    "https://YOUR-VERCEL-APP.vercel.app/api/callback";

  const url =
    `https://www.strava.com/oauth/authorize` +
    `?client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&approval_prompt=auto` +
    `&scope=read,activity:read`;

  res.redirect(url);
}
