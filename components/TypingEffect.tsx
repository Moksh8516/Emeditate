import { useEffect, useState } from "react";

{/* Add this component above your chat container */}
interface TypingEffectProps {
  text: string;
}

export const TypingEffect = ({ text }: TypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
console.log(text);
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 20); // Adjust typing speed here (lower = faster)
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span className="source-text">{displayedText}</span>
  );
};


/*   
        <div className="mb-24 p-10">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex mb-6 ${msg.isUser ? "justify-end" : "justify-start"}`}
            >
              <div className="flex items-end gap-2">
                {!msg.isUser && (
                  <div className="self-end">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full">
                      <GiLotus className="text-white text-sm" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[85%] lg:max-w-[70%] rounded-3xl px-5 py-3 ${
                    msg.isUser
                      ? "bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-br-none"
                      : "bg-gray-800/80 backdrop-blur-md text-gray-100 rounded-bl-none border border-gray-700"
                  }`}
                >
                  <div className="flex flex-wrap items-start">
                    <p
                      className={
                        msg.isUser ? "text-indigo-50" : "text-gray-200"
                      }
                    >
                      {msg.text}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex mb-6 justify-start">
              <div className="bg-gray-800/80 backdrop-blur-md text-gray-100 rounded-3xl rounded-bl-none px-5 py-3 border border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <span className="text-sm text-indigo-300">Reflecting...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
 */