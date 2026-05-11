/** @type {import('next').NextConfig} */
const configuracion = {
  images: {
    domains: ['tu-proyecto.supabase.co', 'localhost']
  },
  experimental: {
    serverActions: true
  }
}
module.exports = configuracion
