import type { Metadata } from "next";
import "@/app/globals.css";
import "@/app/assest/colors.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'; 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <PrimeReactProvider>
          {children}
        </PrimeReactProvider> 
  );
}
