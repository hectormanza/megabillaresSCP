import Nav from './components/NavLogin'
import { AuthProvider } from './components/auth-context'
import './globals.css'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
    <html lang="en">
      <body >
        <Nav/>
        {children}
        </body>
    </html>
    </AuthProvider>
  )
}
