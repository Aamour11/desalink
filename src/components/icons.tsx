import type { SVGProps } from "react";

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

export function CilameLogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M8.5 11a3.5 3.5 0 014.1-3.5" />
      <path d="M15.5 11a3.5 3.5 0 00-4.1-3.5" />
      <path d="M13.5 17.5a3.5 3.5 0 00-4.1-3.5" />
      <path d="M10.5 17.5a3.5 3.5 0 014.1-3.5" />
      <path d="M12 14v-4" />
    </svg>
  );
}
