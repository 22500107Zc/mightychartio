import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
      
      // Create ripple effect
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRipples(prev => [...prev, { x, y, id }]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
      
      onClick?.(e);
    };
    
    return (
      <Comp 
        className={cn(
          buttonVariants({ variant, size, className }),
          "relative overflow-hidden group/btn",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/0 before:via-primary/30 before:to-accent/0",
          "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
        )} 
        ref={ref} 
        onClick={handleClick} 
        {...props}
      >
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-gradient-to-r from-primary via-accent to-primary animate-ping pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '10px',
              height: '10px',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        <span className="relative z-10">{props.children}</span>
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
