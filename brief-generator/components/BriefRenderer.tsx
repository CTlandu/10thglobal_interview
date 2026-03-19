"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface BriefRendererProps {
  content: string;
  className?: string;
}

export function BriefRenderer({ content, className }: BriefRendererProps) {
  return (
    <div className={cn("prose prose-sm max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom rendering for blockquotes (used for Alternative Routing)
          blockquote: ({ children }) => (
            <blockquote className="not-italic border-l-4 border-amber-400 bg-amber-50 pl-4 pr-3 py-2 my-3 rounded-r-md text-amber-800">
              {children}
            </blockquote>
          ),
          // Style headings
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              {children}
            </h1>
          ),
          h2: ({ children }) => {
            const text = String(children);
            const isAlternative =
              text.includes("备选") ||
              text.includes("平替") ||
              text.includes("Alternative");
            return (
              <h2
                className={cn(
                  "text-base font-semibold mt-5 mb-2",
                  isAlternative
                    ? "text-amber-700 flex items-center gap-1"
                    : "text-gray-800"
                )}
              >
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = String(children);
            const isAlternative =
              text.includes("平替") || text.includes("Alternative");
            return (
              <h3
                className={cn(
                  "text-sm font-semibold mt-3 mb-1.5",
                  isAlternative ? "text-amber-600" : "text-gray-700"
                )}
              >
                {children}
              </h3>
            );
          },
          // Style tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full text-xs border-collapse border border-gray-200 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-gray-100 px-3 py-2 text-left font-semibold text-gray-700 border border-gray-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-1.5 border border-gray-200 text-gray-600">
              {children}
            </td>
          ),
          // Style code blocks (used for TBD items)
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className="block bg-gray-100 rounded-md p-3 text-xs font-mono text-gray-800">
                  {children}
                </code>
              );
            }
            const text = String(children);
            const isTBD = text.includes("TBD") || text.includes("待确认");
            return (
              <code
                className={cn(
                  "rounded px-1.5 py-0.5 text-xs font-medium",
                  isTBD
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                {children}
              </code>
            );
          },
          // Style list items
          li: ({ children }) => (
            <li className="text-sm text-gray-700 my-0.5">{children}</li>
          ),
          // Style paragraphs
          p: ({ children }) => (
            <p className="text-sm text-gray-700 my-2 leading-relaxed">
              {children}
            </p>
          ),
          // Style strong (bold)
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          // Style horizontal rule
          hr: () => <hr className="my-4 border-gray-200" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
