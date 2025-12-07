import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
        className={cn(
            "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
            // Enhanced visibility with stronger borders and colors
            "border-slate-300 dark:border-slate-600",
            "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-blue-500 data-[state=checked]:border-purple-400",
            "data-[state=unchecked]:bg-slate-200 dark:data-[state=unchecked]:bg-slate-700 data-[state=unchecked]:border-slate-400 dark:data-[state=unchecked]:border-slate-500",
            "shadow-inner hover:shadow-md transition-shadow",
            className
        )}
        {...props}
        ref={ref}
    >
        <SwitchPrimitives.Thumb
            className={cn(
                "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-1 ring-slate-300 dark:ring-slate-600 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
                // Add subtle glow effect when checked
                "data-[state=checked]:ring-purple-300 data-[state=checked]:shadow-[0_0_8px_rgba(168,85,247,0.4)]"
            )}
        />
    </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
