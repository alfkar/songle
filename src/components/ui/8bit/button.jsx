import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { Button as ShadcnButton } from "@/components/ui/button";


export const buttonVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro",
    },
    variant: {
      default: "bg-foreground",
      destructive: "bg-foreground",
      outline: "bg-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-9 px-4 py-2 has-[>svg]:px-3",
      sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      icon: "size-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Button({
  children,
  asChild,
  isError,
  ...props
}) {
  const { variant, size, className, font } = props;

  return (
    <ShadcnButton
      {...props}
      className={cn(
        "rounded-none active:translate-y-1 transition-transform relative inline-flex items-center justify-center",
        font !== "normal" && "retro",
        isError ? "shake-error border-red-500" : "",
        className
      )}
      size={size}
      variant={variant}
      asChild={asChild}>
      <div className="overflow-hidden">
        {children}

        {variant !== "ghost" && variant !== "link" && size !== "icon" && (
          <>
            {/* Pixelated border */}
            <div
              className={cn("absolute -top-1.5 w-1/2 left-1.5 h-1.5", isError ? "bg-red-500" : "bg-foreground dark:bg-ring")} />
            <div
              className={cn("absolute -top-1.5 w-1/2 right-1.5 h-1.5", isError ? "bg-red-500" : "bg-foreground dark:bg-ring")} />
            <div
              className={cn("absolute -bottom-1.5 w-1/2 left-1.5 h-1.5", isError ? "bg-red-500" : "bg-foreground dark:bg-ring")} />
            <div
              className={cn("absolute -bottom-1.5 w-1/2 right-1.5 h-1.5", isError ? "bg-red-500" : "bg-foreground dark:bg-ring")} />
            <div className={cn("absolute top-0 left-0 size-1.5", isError ? "bg-red-500" : "bg-foreground dark:bg-ring")} />
            <div className={cn("absolute top-0 right-0 size-1.5", isError ? "bg-red-500" : "bg-foreground dark:bg-ring")} />
            <div className={cn("absolute bottom-0 left-0 size-1.5", isError ? "bg-red-500" : "bg-foreground dark:bg-ring")} />
            <div className={cn("absolute bottom-0 right-0 size-1.5", isError ? "bg-red-500" : "bg-foreground dark:bg-ring")} />
            <div
              className={cn("absolute top-1.5 -left-1.5 h-2/3 w-1.5", isError ? "bg-red-500" : "bg-foreground dark:bg-ring")} />
            <div
              className={cn("absolute top-1.5 -right-1.5 h-2/3 w-1.5", isError ? "bg-red-500" : "bg-foreground dark:bg-ring")} />
            {variant !== "outline" && (
              <>
                <div className="absolute top-0 left-0 w-full h-1.5 bg-foreground/20" />
                <div className="absolute top-1.5 left-0 w-3 h-1.5 bg-foreground/20" />

                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-foreground/20" />
                <div className="absolute bottom-1.5 right-0 w-3 h-1.5 bg-foreground/20" />
              </>
            )}
          </>
        )}

        {size === "icon" && (
          <>
            <div
              className="absolute top-0 left-0 w-full h-[5px] md:h-1.5 bg-foreground dark:bg-ring pointer-events-none" />
            <div
              className="absolute bottom-0 w-full h-[5px] md:h-1.5 bg-foreground dark:bg-ring pointer-events-none" />
            <div
              className="absolute top-1 -left-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
            <div
              className="absolute bottom-1 -left-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
            <div
              className="absolute top-1 -right-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
            <div
              className="absolute bottom-1 -right-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring pointer-events-none" />
          </>
        )}
      </div>
    </ShadcnButton>
  );
}

export { Button };
