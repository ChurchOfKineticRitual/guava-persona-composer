import { cn } from "@/lib/utils";

interface PersonaImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const PersonaImage = ({ src, alt, className }: PersonaImageProps) => {
  return (
    <div className={cn("w-28 h-[8.75rem] rounded-lg overflow-hidden border border-border", className)}>
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover object-top"
      />
    </div>
  );
};