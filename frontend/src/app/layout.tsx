import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@base/contexts/AuthContext";
import { ConfirmationDialogProvider } from "@base/contexts/ConfirmationDialogContext";
import { Toaster } from "react-hot-toast";
import PageTransition from "@base/components/layout/TransitionEffects";
import PrivateRoute from "@base/components/layout/PrivateRoute";

export const metadata: Metadata = {
  title: "Shadow Monarch Finance",
  description: "Gerencie suas finanças como um caçador Rank-S",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className="dark">
      <body className="bg-theme-dark">
        <AuthProvider>
          <ConfirmationDialogProvider>
            <Toaster 
              position="top-right" 
              reverseOrder={false}
              toastOptions={{
                className: 'bg-theme-dark-secondary border border-theme-primary/50 text-slate-200 shadow-theme-glow',
                success: {
                  className: 'bg-green-900/50 border border-green-500/50 text-theme-success-light',
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#14532d',
                  }
                },
                error: {
                  className: 'bg-red-900/50 border border-red-500/50 text-theme-error-light',
                  iconTheme: {
                    primary: '#f87171',
                    secondary: '#7f1d1d',
                  }
                }
              }}
            />
            <PageTransition>
              <PrivateRoute>
                {children}
              </PrivateRoute>
            </PageTransition>
          </ConfirmationDialogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
