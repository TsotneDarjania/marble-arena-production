import { getHeroEmbedVideoLink } from "@/app/utils/supabase/actions/getHeroVideo";
import Hero from "./Hero";

export default async function HeroWrapper() {
  const videoLink = await getHeroEmbedVideoLink();

  return <Hero embedLink={videoLink} />;
}
