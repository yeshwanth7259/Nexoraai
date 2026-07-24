import "./globals.css";

export const metadata = {
  title: 'Nexora AI',
  description: 'Nexora AI by Yashnav Technologies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
