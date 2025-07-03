import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import {
  Card as ShadcnCard,
  CardAction as ShadcnCardAction,
  CardContent as ShadcnCardContent,
  CardDescription as ShadcnCardDescription,
  CardFooter as ShadcnCardFooter,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle,
} from "@/components/ui/card";

import "./styles/retro.css";

export const cardVariants = cva("", {
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

function Card({
  ...props
}) {
  const { className, font } = props;

  return (
    <div
      className={cn("relative border-y-6 border-foreground dark:border-ring !p-0", className)}>
      <ShadcnCard
        {...props}
        className={cn("rounded-none border-0 !w-full", font !== "normal" && "retro", className)} />
      <div
        className="absolute inset-0 border-x-6 -mx-1.5 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true" />
    </div>
  );
}

function CardHeader({
  ...props
}) {
  const { className, font } = props;

  return (<ShadcnCardHeader className={cn(font !== "normal" && "retro", className)} {...props} />);
}

function CardTitle({
  ...props
}) {
  const { className, font } = props;

  return (<ShadcnCardTitle className={cn(font !== "normal" && "retro", className)} {...props} />);
}

function CardDescription({
  ...props
}) {
  const { className, font } = props;

  return (<ShadcnCardDescription className={cn(font !== "normal" && "retro", className)} {...props} />);
}

function CardAction({
  ...props
}) {
  const { className, font } = props;

  return (<ShadcnCardAction className={cn(font !== "normal" && "retro", className)} {...props} />);
}

function CardContent({
  ...props
}) {
  const { className, font } = props;

  return (<ShadcnCardContent className={cn(font !== "normal" && "retro", className)} {...props} />);
}

function CardFooter({
  ...props
}) {
  const { className, font } = props;

  return (
    <ShadcnCardFooter
      data-slot="card-footer"
      className={cn(font !== "normal" && "retro", className)}
      {...props} />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
