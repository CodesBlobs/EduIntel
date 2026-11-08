import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/15 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.99]',
  {
    variants: {
      variant: {
        default:
          'bg-[#191918] text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:bg-[#2C2C2A]',
        amber:
          'bg-amber-600 text-white shadow-[0_1px_2px_rgba(217,119,6,0.2)] hover:bg-amber-700',
        soft:
          'bg-[#F4F3EF] text-[#191918] hover:bg-[#EAE8E1] border border-black/[0.05]',
        outline:
          'border border-[#E6E4DD] bg-white text-[#191918] shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:bg-[#F8F7F4]',
        ghost:
          'text-[#575653] hover:bg-[#F4F3EF] hover:text-[#191918]',
        emerald:
          'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700',
      },
      size: {
        default: 'h-9 px-3.5 py-2',
        sm: 'h-8 rounded-lg px-2.5 text-[11px]',
        lg: 'h-10 rounded-xl px-4 text-xs font-semibold',
        icon: 'h-8 w-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors',
  {
    variants: {
      variant: {
        neutral: 'bg-[#F4F3EF] text-[#575653] border border-black/[0.06]',
        amber: 'bg-amber-50/90 text-amber-800 border border-amber-200/70',
        emerald: 'bg-emerald-50/90 text-emerald-800 border border-emerald-200/70',
        rose: 'bg-rose-50/90 text-rose-800 border border-rose-200/70',
        indigo: 'bg-indigo-50/90 text-indigo-800 border border-indigo-200/70',
        sky: 'bg-sky-50/90 text-sky-800 border border-sky-200/70',
        dark: 'bg-[#191918] text-stone-100',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-[#E8E7E2] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.02),0_8px_24px_rgba(15,23,42,0.02)]',
        className
      )}
      {...props}
    />
  )
})
Card.displayName = 'Card'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded-xl border border-[#E2E0D8] bg-[#FBFBFA] px-3 py-1.5 text-sm text-[#191918] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-colors placeholder:text-[#8A8884] focus:border-stone-400 focus:bg-white focus:outline-none focus:ring-3 focus:ring-stone-900/[0.06]',
        className
      )}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded-xl border border-[#E2E0D8] bg-[#FBFBFA] px-3 py-1.5 text-xs font-medium text-[#191918] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-colors focus:border-stone-400 focus:bg-white focus:outline-none focus:ring-3 focus:ring-stone-900/[0.06] cursor-pointer',
        className
      )}
      {...props}
    />
  )
})
Select.displayName = 'Select'
