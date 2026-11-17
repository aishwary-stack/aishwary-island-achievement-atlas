import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";

import { ContactPort } from "@/components/voyage/ContactPort";
import { FireflySky } from "@/components/voyage/FireflySky";
import { ForkScene } from "@/components/voyage/ForkScene";
import { IslandDialog } from "@/components/voyage/IslandDialog";
import { PassageSection } from "@/components/voyage/PassageSection";
import { VideoVoyage } from "@/components/voyage/VideoVoyage";
import { VoyageNav } from "@/components/voyage/VoyageNav";
import type { Island, PassageId } from "@/data/portfolio";
import { DEFAULT_PASSAGE, isPassageId } from "@/lib/voyage";

const TITLE = "Aishwary Nagaria · Founder, Builder & Dual-IIM Scholar";
const DESCRIPTION =
  "Sail the Grand Line with Aishwary Nagaria: Founder & CTO of Open Cupboard, studying at IIM Kozhikode (BMS) and IIM Bangalore (BBA DBE) at the same time.";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { passage?: PassageId } =>
    isPassageId(search["passage"]) ? { passage: search["passage"] } : {},
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  const search = Route.useSearch();
  const passage = search.passage ?? DEFAULT_PASSAGE;
  const navigate = useNavigate({ from: "/" });
  const [openIsland, setOpenIsland] = useState<Island | null>(null);

  const choose = useCallback(
    (id: PassageId) => {
      void navigate({ search: { passage: id }, replace: true, resetScroll: false });
      // Wait for the new passage to render, then sail to it.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => document.getElementById("passage")?.scrollIntoView({ behavior: "smooth" })),
      );
    },
    [navigate],
  );

  return (
    <div id="top" className="relative">
      <FireflySky />
      <VoyageNav passage={passage} onChoose={choose} />
      <main>
        <VideoVoyage />
        <ForkScene passage={passage} onChoose={choose} />
        <PassageSection passage={passage} onChoose={choose} onOpen={setOpenIsland} />
        <ContactPort />
      </main>
      <IslandDialog island={openIsland} onClose={() => setOpenIsland(null)} />
    </div>
  );
}
