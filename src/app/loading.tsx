import { LogoIcon } from "@/components/icons";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute h-full w-full animate-pulse rounded-full bg-primary/20"></div>
        <div className="absolute h-16 w-16 animate-pulse rounded-full bg-primary/40 [animation-delay:0.2s]"></div>
        <LogoIcon className="h-10 w-10 text-primary" />
      </div>
    </div>
  );
}
