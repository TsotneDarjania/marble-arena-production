"use client";

import { useAppContext } from "@/app/context/AppContexty";
import Shadow from "../Shadow";

export default function ShadowWrapper() {
  const { isShadowOpen, setIsShadowOpen, setIsAuthModalOpen } = useAppContext();

  if (!isShadowOpen) return null;

  return (
    <Shadow
      onClick={() => {
        setIsShadowOpen(false);
        setIsAuthModalOpen(false);
      }}
    />
  );
}
