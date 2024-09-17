import { BuiltInProviderType } from "next-auth/providers/index";
import { LiteralUnion, ClientSafeProvider } from "next-auth/react";

export type Providers = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
> | null;
