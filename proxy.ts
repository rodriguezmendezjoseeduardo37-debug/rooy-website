import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      // 1. Si intenta entrar a /admin, verificamos el correo
      if (req.nextUrl.pathname.startsWith("/admin")) {
        // Reemplaza esto con tu correo real
        return token?.email === "rodriguezmendezjoseeduardo37@gmail.com"
      }
      
      // 2. Para cualquier otra ruta definida en 'matcher', solo requiere estar logueado
      return !!token
    },
  },
})

export const config = {
  matcher: [
    "/perfil/:path*", 
    "/admin/:path*", 
    "/checkout/:path*"
  ]
}