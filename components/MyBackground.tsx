import React from "react";

type MyBackgroundProps = {
  children: React.ReactNode;
};

const MyBackground: React.FC<MyBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full px-6 md:px-10 pt-4 bg-gradient-to-br from-slate-800 via-indigo-900 to-blue-400">
    {children}
</div>
  );
};

export default MyBackground
