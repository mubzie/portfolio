/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: '/image/**',
      }
    ]
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      "exclude": /node_modules/,
      "use": ["raw-loader", "glslify-loader"]
    });

    return config;
  }
}

module.exports = nextConfig

