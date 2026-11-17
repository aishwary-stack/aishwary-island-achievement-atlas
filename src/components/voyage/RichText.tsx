import { Fragment } from "react";

import { splitLinks } from "@/lib/voyage";
import { cn } from "@/lib/utils";

/** Renders copy with every auto-linked name (like Open Cupboard) turned into a real link. */
export function RichText({ text, linkClassName }: { text: string; linkClassName?: string }) {
  return (
    <>
      {splitLinks(text).map((part, i) =>
        part.href ? (
          <a
            key={i}
            href={part.href}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "font-semibold underline decoration-2 underline-offset-[3px] transition-colors hover:decoration-[3px]",
              linkClassName,
            )}
          >
            {part.text}
          </a>
        ) : (
          <Fragment key={i}>{part.text}</Fragment>
        ),
      )}
    </>
  );
}
