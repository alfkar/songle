import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import {
  HoverCard as ShadcnHoverCard,
  HoverCardContent as ShadcnHoverCardContent,
  HoverCardTrigger as ShadcnHoverCardTrigger,
} from "@/components/ui/hover-card";


export const hoverCardVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro",
    },
  },
  defaultVariants: {
    font: "retro",
  },
});

function HoverCard({
  ...props
}) {
  return <ShadcnHoverCard {...props} />;
}

function HoverCardTrigger({
  className,
  asChild = true,
  ...props
}) {
  return (<ShadcnHoverCardTrigger className={cn(className)} asChild={asChild} {...props} />);
}

function HoverCardContent({
  children,
  className,
  font,
  ...props
}) {
  return (
    <ShadcnHoverCardContent
      className={cn("relative", hoverCardVariants({
        font,
        className,
      }))}
      {...props}>
      {children}
      <div
        className="absolute inset-0 border-x-6 -mx-1.5 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true" />
      <div
        className="absolute inset-0 border-y-6 -my-1.5 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true" />
    </ShadcnHoverCardContent>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
