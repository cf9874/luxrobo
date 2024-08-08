/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "dev-edaapi.luxrobo.com",
      "luxrobo-pub-development.s3.ap-northeast-2.amazonaws.com",
      "www.mouser.com",
      "www.mouser.kr",
      "ec2-13-125-200-107.ap-northeast-2.compute.amazonaws.com",
      "vctec.co.kr",
      "download.luxrobo.com",
    ],
    loader: "akamai",
    path: "/",
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NEXT_PUBLIC_NODE_ENV === "pro",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  exportTrailingSlash: true,
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/member/signin",
        permanent: true,
      },
      {
        source: "/workspace",
        destination: "/workspace/personal/projects",
        permanent: true,
      },
      {
        source: "/support",
        destination: "/support/notice",
        permanent: true,
      },
      {
        source: "/pixi",
        destination: "/pixi-test/test",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
