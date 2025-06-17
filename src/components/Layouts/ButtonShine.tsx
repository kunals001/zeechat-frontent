import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

type ButtonShineProps = {
    text: string;
    className?: string;
};
 
export function AnimatedGradientTextDemo({ text, className }: ButtonShineProps) {
  return (
    <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 md:py-1.5 py-1 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
      <div
        className={cn(
          "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#93a3fc] via-[#398cff]/50 to-[#398cff]/30 bg-[length:300%_100%] p-[2px]",
        )}
        style={{
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "subtract",
          WebkitClipPath: "padding-box",
        }}
      />
      <AnimatedGradientText className={className}>
        {
          text
        }
      </AnimatedGradientText>
    </div>
  );
}