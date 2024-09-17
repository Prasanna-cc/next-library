// "use client";

// import { getProviders } from "next-auth/react";
// import { useState, useEffect } from "react";
// import { Providers } from "./models/providers.model";
// import { CustomSession } from "./authOptions";

// export const authController = () => {
//   // const { data: session } = useSession();
//   const [providers, setProviders] = useState<Providers>(null);
//   useEffect(() => {
//     const setAuthProviders = async () => {
//       const res: Providers = await getProviders();
//       setProviders(res);
//     };
//     setAuthProviders();
//   }, []);

//   return {
//     // session: session as CustomSession,
//     providers,
//   };
// };
