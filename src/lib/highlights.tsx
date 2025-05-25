import React from "react";

export function highlightText(text: string, query: string): React.ReactNode {
  if (!query || !text) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() 
          ? <mark key={i} className="bg-teal-100 text-teal-800 px-1 rounded-sm">{part}</mark> 
          : part
      )}
    </>
  );
} 