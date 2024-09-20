import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
// import { LayoutProvider } from "@/components/LayoutProvider";
import { Toaster } from "@/components/ui/toaster";
import { MainNavMenu } from "@/components/MainNavMenu";
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale,
} from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { LocaleSelector } from "@/components/LocaleSelecter";
import { EdgeStoreProvider } from "@/lib/edgestore";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Knowledg",
//   description: "Your online bookstore",
// };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <AuthProvider>
      <html lang={locale}>
        <body className={inter.className}>
          <NextIntlClientProvider messages={messages}>
            <Navbar>
              <LocaleSelector />
              <MainNavMenu />
            </Navbar>
            <EdgeStoreProvider>
              <main>{children}</main>
            </EdgeStoreProvider>
            <Toaster />
          </NextIntlClientProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
