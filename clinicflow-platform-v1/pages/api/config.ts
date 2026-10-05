import type { NextApiRequest, NextApiResponse } from "next";

type ConfigResponse = {
  apiUrl: string;
};

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ConfigResponse>
) {
  let apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:5000/api/v1";

  // If Render injected BACKEND_HOST via Blueprint service link
  if (process.env.BACKEND_HOST) {
    const host = process.env.BACKEND_HOST;
    apiUrl = host.startsWith("http")
      ? `${host}/api/v1`
      : `https://${host}/api/v1`;
  }

  res.status(200).json({ apiUrl });
}
