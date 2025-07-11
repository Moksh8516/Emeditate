import React from "react";

type MyBackgroundProps = {
  children: React.ReactNode;
};

const MyBackground: React.FC<MyBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full px-6 md:px-10 pt-4 bg-gradient-to-br from-indigo-800 via-gray-800 to-blue-700">
    {children}
</div>
  );
};

export default MyBackground
