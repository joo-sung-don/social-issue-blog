/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['afppkxoactqarlnnhdpa.supabase.co', 'via.placeholder.com', 'images.unsplash.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 