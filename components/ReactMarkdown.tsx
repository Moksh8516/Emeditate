import React from "react";
import ReactMarkdown from "react-markdown";
function ReactMark(text: { text: string }) {
  return (
    <ReactMarkdown
      skipHtml={true}
      components={{
        p: ({ children, ...props }) => (
          <p className="m-0 mb-2 last:mb-0" {...props}>
            {children}
          </p>
        ),
        strong: ({ children, ...props }) => (
          <strong className="font-bold" {...props}>
            {children}
          </strong>
        ),
        em: ({ children, ...props }) => (
          <em className="italic" {...props}>
            {children}
          </em>
        ),
        ul: ({ children, ...props }) => (
          <ul className="list-disc list-inside ml-2 mb-2" {...props}>
            {children}
          </ul>
        ),
        ol: ({ children, ...props }) => (
          <ol className="list-decimal list-inside ml-2 mb-2" {...props}>
            {children}
          </ol>
        ),
        li: ({ children, ...props }) => (
          <li className="mb-1" {...props}>
            {children}
          </li>
        ),
        code: ({ className, children, ...props }) => {
          return !className ? (
            <code
              className="bg-gray-900/50 px-2 py-1 rounded text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          ) : (
            <code
              className="block bg-gray-900/50 p-2 rounded text-sm font-mono mb-2 overflow-x-auto"
              {...props}
            >
              {children}
            </code>
          );
        },
        pre: ({ children, ...props }) => (
          <pre
            className="bg-gray-900/50 p-3 rounded mb-2 overflow-x-auto"
            {...props}
          >
            {children}
          </pre>
        ),
        h1: ({ children, ...props }) => (
          <h1 className="text-xl font-bold mb-2" {...props}>
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 className="text-lg font-bold mb-2" {...props}>
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 className="text-base font-bold mb-2" {...props}>
            {children}
          </h3>
        ),
        a: ({ children, ...props }) => (
          <a
            className="underline hover:opacity-80"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            {children}
          </a>
        ),
        blockquote: ({ children, ...props }) => (
          <blockquote
            className="border-l-4 border-indigo-400 pl-3 italic mb-2"
            {...props}
          >
            {children}
          </blockquote>
        ),
      }}
    >
      {text.text}
    </ReactMarkdown>
  );
}
export default ReactMark;
