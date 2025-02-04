import type { Metadata } from "next";
import "@/app/globals.css";
import "@/app/assest/colors.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'; 
import { Sidebar } from "@/app/components/sidebar";
import { PrimeReactProvider } from "primereact/api";
import Header from "@/app/components/header";
import { BreadCrumbCommon } from "@/app/components/breadcrumb";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <PrimeReactProvider>
        <AntdRegistry>
            <div className="grid grid-cols-12 h-screen bg-white dark:bg-gray-900">
                <div className="col-span-1 lg:col-span-1 bg-white hidden lg:block p-4">
                <Sidebar/>
                </div>
                <div className="col-span-12 lg:col-span-11 h-screen flex flex-col">
                    <div className="bg-white flex items-center px-4">
                        <Header/>
                    </div>
                    <div className="bg-background flex-1 rounded-tl-lg lg:rounded-tl-[3rem] p-2 lg:p-6 overflow-auto shadow-inner" >
                        <BreadCrumbCommon/>
                        <Suspense fallback={<div>Loading...</div>}>
                          {children}
                        </Suspense>
                    </div>
                </div>
            </div>
          </AntdRegistry>
      </PrimeReactProvider>
  );
}
