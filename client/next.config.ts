import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["zrsnnjdebbazgbxmttvh.supabase.co"], // ✅ Add your Supabase project domain here
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
