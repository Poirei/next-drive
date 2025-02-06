import SvgIcon from "@/components/logo";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default function Home() {
  return (
    <HeroGeometric
      badge={
        <div className="flex flex-col items-center gap-x-2">
          <SvgIcon height={75} width={75} />
          <p className="text-xl font-medium">
            nextdrive inc<span className="text-red-500">.</span>
          </p>
        </div>
      }
      title1="Supercharged File Sharing."
      title2="Share Smarter, Secure Access."
    />
  );
}
