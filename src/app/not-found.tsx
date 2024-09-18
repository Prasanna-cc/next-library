import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function NotFound({
  children,
}: //   params: { locale },
{
  children: React.ReactNode;
  //   params: { locale: string };
}) {
  return (
    <html lang={"en"}>
      <body className={inter.className}>
        <div className="flex flex-col justify-center m-auto items-center">
          <h1 className="font-semibold">404 | Not Found!!!</h1>
        </div>
      </body>
    </html>
  );
}
