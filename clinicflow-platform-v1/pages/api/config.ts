import type { NextApiRequest, NextApiResponse } from "next";

type ConfigResponse = {
  apiUrl: string;
};

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ConfigResponse>
) {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:5000/api/v1";

  res.status(200).json({ apiUrl });
}
