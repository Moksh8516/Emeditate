import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
children:React.ReactNode;
variant?: "primary" | "secondary" | "dark";
type?: "button" | "submit" | "reset";
disabled?: boolean;
size?: "sm" | "md" | "lg";
className?: string;
Icon?:React.ReactNode;
}

function Button({children, type="button", variant="primary",size="md", disabled=false, className,Icon, ...props }:ButtonProps) {

    const variants = {
        primary: "bg-gray-100 text-gray-800 font-semibold py-2",
        secondary: "bg-transparent text-gray-100 font-semibold py-2 ",
        dark: "bg-gray-800 hover:bg-gray-900  duration-100 text-white font-semibold py-2 ",
      };

      const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-md",
        lg: "px-8 py-4 text-lg",
      };
    
  return (
    <button
    type={type}
    disabled={disabled}
    className={`${variants[variant]} ${sizes[size]} ${className} rounded-lg shadow-sm transition ease-in-out focus:outline-none border-none hover:scale-105 duration-150 whitespace-nowrap `}
    {...props}
  >
    {Icon}
    {children}
  </button>
  )
}

export default Button;