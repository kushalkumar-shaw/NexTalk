import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit", 
});

export const metadata: Metadata = {
  title: "NexTalk",
  description: "Real-time team communication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-chat-bg text-text-main`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <SocketProvider>
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: { background: "#313338", color: "#fff", border: "1px solid #4a4d52" },
                  success: { iconTheme: { primary: "#23a55a", secondary: "#fff" } },
                  error: { iconTheme: { primary: "#f04747", secondary: "#fff" } },
                  duration: 4000,
                }}
              />
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
