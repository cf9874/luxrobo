/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/signin",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
