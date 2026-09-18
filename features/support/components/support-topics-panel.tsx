"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { SupportSearchField } from "@/features/support/components/support-search-field";
import { SupportSearchResults } from "@/features/support/components/support-search-results";
import { SupportStateMessage } from "@/features/support/components/support-state-message";
import { SupportTopicGrid } from "@/features/support/components/support-topic-grid";
import {
  useSupportSearchQuery,
  useSupportTopicsQuery,
} from "@/services/queries/support.queries";

type SupportTopicsPanelProps = {
  onNavigate?: () => void;
  searchAutoFocus?: boolean;
  showHeading?: boolean;
};

export function SupportTopicsPanel({
  onNavigate,
  searchAutoFocus = false,
  showHeading = true,
}: SupportTopicsPanelProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const isSearching = debouncedSearch.trim().length > 0;

  const topicsQuery = useSupportTopicsQuery();
  const searchQuery = useSupportSearchQuery(debouncedSearch, isSearching);

  return (
    <div className="akili-support-panel">
      <SupportSearchField
        value={search}
        onChange={setSearch}
        autoFocus={searchAutoFocus}
      />

      {isSearching ? (
        searchQuery.isLoading || searchQuery.isFetching ? (
          <SupportStateMessage variant="loading" />
        ) : searchQuery.isError ? (
          <SupportStateMessage
            variant="error"
            error={searchQuery.error}
            onRetry={() => void searchQuery.refetch()}
          />
        ) : (
          <SupportSearchResults
            query={debouncedSearch.trim()}
            hits={searchQuery.data ?? []}
            onNavigate={onNavigate}
          />
        )
      ) : (
        <>
          {showHeading && (
            <h2 className="akili-support-panel__heading">Tópicos de ajuda</h2>
          )}
          {topicsQuery.isLoading ? (
            <SupportStateMessage variant="loading" />
          ) : topicsQuery.isError ? (
            <SupportStateMessage
              variant="error"
              error={topicsQuery.error}
              onRetry={() => void topicsQuery.refetch()}
            />
          ) : (topicsQuery.data?.length ?? 0) === 0 ? (
            <SupportStateMessage variant="empty" />
          ) : (
            <SupportTopicGrid
              topics={topicsQuery.data ?? []}
              onNavigate={onNavigate}
            />
          )}
        </>
      )}
    </div>
  );
}
