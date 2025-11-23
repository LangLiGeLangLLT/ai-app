import type { NextConfig } from 'next'
import './envConfig'

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.md': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.SERVER_BASE_URL}/api/:path*`,
        basePath: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'ngrok-skip-browser-warning',
            value: 'true',
          },
        ],
        basePath: false,
      },
    ]
  },
}

export default nextConfig
