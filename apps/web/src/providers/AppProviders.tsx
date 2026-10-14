"use client";

import ReactQueryProvider from "./QueryProvider";
import SocketProvider from "./SocketProvider";
import { AuthProvider } from "@/modules/authentication/providers/AuthProvider";
// import { Toaster } from "react-hot-toast";
import { Toaster } from "sonner";
import ThemeProvider from "./ThemeProvider";

import type { PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren
) {
    return (
        <ReactQueryProvider>
            <ThemeProvider>
                <AuthProvider>
                    <SocketProvider>
                        {children}
                    </SocketProvider>

                  <Toaster
                    position="top-right"
                    duration={4000}
                    richColors
                    closeButton
                    />
                </AuthProvider>
            </ThemeProvider>
        </ReactQueryProvider>
    );
}