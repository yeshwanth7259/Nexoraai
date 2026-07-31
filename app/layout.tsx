import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";

export const metadata = {
  title: 'Nexora AI',
  description: 'Nexora AI by Yashnav Technologies',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
