import { bffClient } from "@/services/bff/client";
import type {
  SupportFaqDetail,
  SupportFaqSearchHit,
  SupportFaqTopicDetail,
  SupportFaqTopicSummary,
} from "@/types/domain/support-faq";

export const supportBff = {
  listTopics() {
    return bffClient<SupportFaqTopicSummary[]>("/api/support/faq/topics");
  },

  getTopic(uuid: string) {
    return bffClient<SupportFaqTopicDetail>(`/api/support/faq/topics/${uuid}`);
  },

  getFaq(uuid: string) {
    return bffClient<SupportFaqDetail>(`/api/support/faq/${uuid}`);
  },

  search(search: string) {
    const query = new URLSearchParams({ search });
    return bffClient<SupportFaqSearchHit[]>(
      `/api/support/faq/search?${query.toString()}`
    );
  },
};
