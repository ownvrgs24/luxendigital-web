import { LOGO_URL } from "@/content/brand";

/**
 * LuxenMark — renders the custom full Luxen Digital gold mark or icon.
 */
export function LuxenMark({
  className = "h-8 w-auto",
}: {
  className?: string;
}) {
  return (
    <img
      src={LOGO_URL}
      alt="Luxen Digital"
      width={1254}
      height={1254}
      className={`object-contain select-none ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}
