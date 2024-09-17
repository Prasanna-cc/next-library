import "@/styles/globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale,
} from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// export const metadata = {
//   title: "Knowledg",
//   description: "Your online bookstore",
// };

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

export default async function SignUpLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <>
      <AuthProvider>
        <html lang={locale}>
          <body className={inter.className}>
            <NextIntlClientProvider messages={messages}>
              <Navbar></Navbar>
              <main>
                <hr></hr>
                <div className=" py-14 flex flex-col items-center justify-center">
                  {children}
                </div>
              </main>
              <Toaster />
            </NextIntlClientProvider>
          </body>
        </html>
      </AuthProvider>
    </>
  );
}
