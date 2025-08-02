import { LogoIcon } from "@/components/icons";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute h-full w-full animate-pulse rounded-full bg-primary/20"></div>
        <div className="absolute h-16 w-16 animate-pulse rounded-full bg-primary/40 [animation-delay:0.2s]"></div>
        <LogoIcon className="h-10 w-10 text-primary" />
      </div>
      <h1 className="font-headline text-2xl font-bold text-primary animate-pulse [animation-delay:0.4s]">
        DesaLink UMKM
      </h1>
    </div>
  );
}
