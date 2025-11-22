import { useState, useCallback, useEffect } from "react";
import {
  getMessages,
  getNextPage,
  getPreviousPage,
  convertToUIMessages,
} from "@/lib/api/message";
import {
  GetMessagesParams,
  MessagesPageResponse,
  ApiMessage,
  SortDirection,
  MessageSortField,
  createSortParam,
} from "@/types/message";

interface UseMessagesOptions {
  roomId: string;
  pageSize?: number;
  sortField?: MessageSortField;
  sortDirection?: SortDirection;
  autoFetch?: boolean; // 자동으로 첫 페이지 로드 (기본값: true)
}

export function useMessages(options: UseMessagesOptions) {
  const {
    roomId,
    pageSize = 50,
    sortField = "createdAt",
    sortDirection = "asc",
    autoFetch = true,
  } = options;

  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pageInfo, setPageInfo] = useState<{
    currentPage: number;
    totalPages: number;
    totalElements: number;
    size: number;
  } | null>(null);

  const sort = createSortParam(sortField, sortDirection);

  // 메시지 목록 조회
  const fetchMessages = useCallback(
    async (page: number = 0) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getMessages({
          roomId,
          page,
          size: pageSize,
          sort,
        });

        setMessages(response.detail.content);
        setPageInfo({
          currentPage: response.detail.number,
          totalPages: response.detail.totalPages,
          totalElements: response.detail.totalElements,
          size: response.detail.size,
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error("조회 실패");
        setError(error);
        setMessages([]);
        setPageInfo(null);
      } finally {
        setIsLoading(false);
      }
    },
    [roomId, pageSize, sort]
  );

  // 다음 페이지 로드
  const loadNextPage = useCallback(async () => {
    if (!pageInfo || isLoading) return;

    const currentPage = pageInfo.currentPage;
    if (currentPage + 1 >= pageInfo.totalPages) return;

    await fetchMessages(currentPage + 1);
  }, [pageInfo, isLoading, fetchMessages]);

  // 이전 페이지 로드
  const loadPreviousPage = useCallback(async () => {
    if (!pageInfo || isLoading) return;

    const currentPage = pageInfo.currentPage;
    if (currentPage <= 0) return;

    await fetchMessages(currentPage - 1);
  }, [pageInfo, isLoading, fetchMessages]);

  // 특정 페이지로 이동
  const goToPage = useCallback(
    async (page: number) => {
      if (!pageInfo || isLoading) return;

      if (page < 0 || page >= pageInfo.totalPages) {
        console.warn(`Invalid page number: ${page}`);
        return;
      }

      await fetchMessages(page);
    },
    [pageInfo, isLoading, fetchMessages]
  );

  // 새로고침 (현재 페이지 다시 로드)
  const refresh = useCallback(async () => {
    const currentPage = pageInfo?.currentPage ?? 0;
    await fetchMessages(currentPage);
  }, [pageInfo, fetchMessages]);

  // 초기 로드
  useEffect(() => {
    if (autoFetch && roomId) {
      fetchMessages(0);
    }
  }, [autoFetch, roomId, fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    pageInfo,
    fetchMessages,
    loadNextPage,
    loadPreviousPage,
    goToPage,
    refresh,
    hasNextPage: pageInfo
      ? pageInfo.currentPage + 1 < pageInfo.totalPages
      : false,
    hasPreviousPage: pageInfo ? pageInfo.currentPage > 0 : false,
  };
}

/**
 * 무한 스크롤을 위한 메시지 훅
 */
export function useInfiniteMessages(options: UseMessagesOptions) {
  const {
    roomId,
    pageSize = 50,
    sortField = "createdAt",
    sortDirection = "asc",
    autoFetch = true,
  } = options;

  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const sort = createSortParam(sortField, sortDirection);

  // 첫 페이지 로드
  const fetchInitialMessages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMessages([]);
    setCurrentPage(0);
    setHasMore(true);

    try {
      const response = await getMessages({
        roomId,
        page: 0,
        size: pageSize,
        sort,
      });

      setMessages(response.detail.content);
      setCurrentPage(0);
      setHasMore(response.detail.number + 1 < response.detail.totalPages);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("조회 실패");
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, pageSize, sort]);

  // 다음 페이지 추가 로드
  const fetchMoreMessages = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    setError(null);

    try {
      const nextPage = currentPage + 1;
      const response = await getMessages({
        roomId,
        page: nextPage,
        size: pageSize,
        sort,
      });

      setMessages((prev) => [...prev, ...response.detail.content]);
      setCurrentPage(nextPage);
      setHasMore(response.detail.number + 1 < response.detail.totalPages);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("조회 실패");
      setError(error);
    } finally {
      setIsFetchingMore(false);
    }
  }, [roomId, pageSize, sort, currentPage, isFetchingMore, hasMore]);

  // 초기 로드
  useEffect(() => {
    if (autoFetch && roomId) {
      fetchInitialMessages();
    }
  }, [autoFetch, roomId, fetchInitialMessages]);

  return {
    messages,
    isLoading,
    isFetchingMore,
    error,
    hasMore,
    fetchInitialMessages,
    fetchMoreMessages,
  };
}
