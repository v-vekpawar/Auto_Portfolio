import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://autoportfolio.vercel.app'),
  title: 'AutoPortfolio - Intelligent Automated Portfolio Generator',
  description: 'Generate beautiful, professional portfolio websites automatically using your LinkedIn and GitHub profiles. Create stunning portfolios in minutes with AI-powered data extraction.',
  keywords: 'portfolio, generator, linkedin, github, resume, automated, professional, AI, portfolio builder, web development',
  authors: [{ name: 'Vivek Pawar', url: 'https://github.com/v-vekpawar' }],
  creator: 'Vivek Pawar',
  publisher: 'AutoPortfolio',
  robots: 'index, follow',
  openGraph: {
    title: 'AutoPortfolio - Intelligent Automated Portfolio Generator',
    description: 'Generate beautiful, professional portfolio websites automatically using your LinkedIn and GitHub profiles.',
    url: 'https://autoportfolio.dev',
    siteName: 'AutoPortfolio',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AutoPortfolio - Intelligent Portfolio Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoPortfolio - Intelligent Automated Portfolio Generator',
    description: 'Generate beautiful, professional portfolio websites automatically using your LinkedIn and GitHub profiles.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}