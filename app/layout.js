import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "FactiFyAI",
  description: "Rule-based content verification tool.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black/50 backdrop-blur-sm min-h-screen flex flex-col animate-fadeIn">
        <Header />
        <main className="flex-1 pt-20 animate-slideUp">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
