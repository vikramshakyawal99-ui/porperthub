"use client";

import TeamGuard from "@/components/team/TeamGuard";
import SponsoredAdsPage from "@/app/admin/sponsored-ads/page";

export default function TeamSponsoredAdsPage() {
  return (
    <TeamGuard>
      {() => (
        <SponsoredAdsPage />
      )}
    </TeamGuard>
  );
}
