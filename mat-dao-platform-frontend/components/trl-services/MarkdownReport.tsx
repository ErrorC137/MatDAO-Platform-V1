"use client"

export function MarkdownReport({ content }: { content: string }) {
  const lines = content.split("\n")

  return (
    <div className="prose prose-invert max-w-none text-sm">
      {lines.map((line, i) => {
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="mb-2 mt-4 text-base font-bold text-white/90">
              {line.replace("### ", "")}
            </h3>
          )
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="mb-2 mt-4 text-lg font-bold text-white/95">
              {line.replace("## ", "")}
            </h2>
          )
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="mb-1 font-semibold text-white/80">
              {line.replace(/\*\*/g, "")}
            </p>
          )
        }
        if (line.startsWith("* ") || line.startsWith("- ")) {
          return (
            <li key={i} className="ml-4 list-disc text-white/65">
              {line.replace(/^[\*\-] /, "")}
            </li>
          )
        }
        if (line.trim() === "") return <br key={i} />
        return (
          <p key={i} className="mb-1 text-white/65">
            {line}
          </p>
        )
      })}
    </div>
  )
}
