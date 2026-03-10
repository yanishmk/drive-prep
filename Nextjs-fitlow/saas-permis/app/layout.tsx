import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AccessStatusBadge } from "@/components/saas/AccessStatusBadge";
import { ProfileConnectedIcon } from "@/components/saas/ProfileConnectedIcon";
import { FloatingCoachChat } from "@/components/saas/FloatingCoachChat";
import { AuthRedirectBridge } from "@/components/auth/AuthRedirectBridge";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Drive-Prep | Simulations SAAQ Quebec",
  description:
    "Drive-Prep est une plateforme SaaS simple pour s'entrainer aux simulations d'examen theorique de conduite au Quebec.",
  icons: {
    icon: "/brand/drive-prep-logo.svg",
    shortcut: "/brand/drive-prep-logo.svg",
    apple: "/brand/drive-prep-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA">
      <body className={`${manrope.variable} ${spaceGrotesk.variable} antialiased`}>
        <AuthRedirectBridge />
        <AccessStatusBadge />
        <ProfileConnectedIcon />
        <FloatingCoachChat />
        {children}
      </body>
    </html>
  );
}
