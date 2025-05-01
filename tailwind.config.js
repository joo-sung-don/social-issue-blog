/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  safelist: [
    // 레이아웃 관련
    'container', 'flex', 'grid', 'block', 'inline-block', 'hidden',
    'flex-col', 'flex-row', 'items-center', 'items-start', 'items-end',
    'justify-center', 'justify-between', 'justify-start', 'justify-end',
    'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-5', 'gap-6', 'gap-8', 'gap-10',
    'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4',
    'col-span-1', 'col-span-2', 'col-span-3', 'col-span-full',
    
    // 여백 및 크기 관련
    'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10',
    'px-1', 'px-2', 'px-3', 'px-4', 'px-5', 'px-6', 'px-8',
    'py-1', 'py-2', 'py-3', 'py-4', 'py-5', 'py-6', 'py-8',
    'pt-1', 'pt-2', 'pt-3', 'pt-4', 'pt-5', 'pl-2', 'pl-3', 'pl-4',
    'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'mx-auto', 
    'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5', 'mb-6', 'mb-8', 'mb-10',
    'mt-1', 'mt-2', 'mt-3', 'mt-4', 'mt-5', 'mt-auto',
    'w-full', 'w-auto', 'w-1/2', 'w-1/3', 'w-1/4', 'w-screen',
    'h-full', 'h-auto', 'h-screen', 'h-40', 'h-60', 'h-80',
    'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-full',
    
    // 테두리 및 모서리 관련
    'border', 'border-t', 'border-b', 'border-l', 'border-r',
    'rounded-sm', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full',
    'rounded-t-lg', 'rounded-b-lg',
    
    // 색상 관련 - 배경
    'bg-white', 'bg-black', 'bg-transparent',
    'bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'bg-gray-300', 'bg-gray-400', 'bg-gray-500',
    'bg-red-50', 'bg-red-100', 'bg-red-500', 'bg-red-600', 'bg-red-700',
    'bg-blue-50', 'bg-blue-100', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
    'bg-green-50', 'bg-green-100', 'bg-green-500', 'bg-green-600',
    'bg-yellow-50', 'bg-yellow-100', 'bg-yellow-500',
    'bg-indigo-50', 'bg-indigo-100', 'bg-indigo-500',
    
    // 색상 관련 - 텍스트
    'text-white', 'text-black',
    'text-gray-50', 'text-gray-100', 'text-gray-200', 'text-gray-300', 
    'text-gray-400', 'text-gray-500', 'text-gray-600', 'text-gray-700', 'text-gray-800', 'text-gray-900',
    'text-red-500', 'text-red-600', 'text-red-700',
    'text-blue-500', 'text-blue-600', 'text-blue-700',
    'text-green-500', 'text-green-600',
    'text-yellow-500', 'text-yellow-600',
    'text-indigo-500', 'text-indigo-600',
    
    // 텍스트 관련
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
    'font-normal', 'font-medium', 'font-semibold', 'font-bold',
    'text-left', 'text-center', 'text-right',
    'underline', 'line-through', 'uppercase', 'lowercase', 'capitalize',
    'leading-tight', 'leading-normal', 'leading-relaxed', 'leading-loose',
    'tracking-tight', 'tracking-normal', 'tracking-wide',
    'line-clamp-1', 'line-clamp-2', 'line-clamp-3',
    
    // 효과 관련
    'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl',
    'opacity-0', 'opacity-25', 'opacity-50', 'opacity-75', 'opacity-100',
    'overflow-hidden', 'overflow-auto', 'overflow-scroll',
    'object-cover', 'object-contain', 'object-fill',
    
    // 트랜지션 및 애니메이션
    'transition', 'duration-100', 'duration-200', 'duration-300', 'duration-500',
    'ease-in', 'ease-out', 'ease-in-out',
    'hover:scale-105', 'hover:opacity-90', 'hover:shadow-lg',
    'transform', 'rotate-45', 'rotate-90', 'scale-95', 'scale-100', 'scale-105',
    
    // 위치 관련
    'static', 'relative', 'absolute', 'fixed', 'sticky',
    'inset-0', 'top-0', 'right-0', 'bottom-0', 'left-0', 'z-10', 'z-20', 'z-50',
    
    // 반응형 프리픽스 (이 클래스들에 대한 반응형 변형도 생성)
    'sm:flex', 'md:flex', 'lg:flex', 'xl:flex',
    'sm:grid', 'md:grid', 'lg:grid', 'xl:grid',
    'sm:hidden', 'md:hidden', 'lg:hidden', 'xl:hidden',
    'sm:grid-cols-2', 'md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
} 