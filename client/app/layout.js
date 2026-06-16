import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'AdHub Kenya — Buy & Sell Anything Online',
  description: 'Kenya\'s fastest growing classified ads marketplace. Find great deals on electronics, vehicles, property, fashion, and more. Post your ad for free today!',
  keywords: 'buy sell Kenya, classified ads Kenya, online marketplace Kenya, second hand Kenya',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme) {
                  if (theme === 'dark') {
                    document.documentElement.removeAttribute('data-theme');
                  } else {
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                }
              } catch (e) {}
            })();
          `
        }} />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{minHeight:'calc(100vh - 68px)'}}>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
