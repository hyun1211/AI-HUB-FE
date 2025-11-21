import { useState, useCallback, useEffect } from "react";
import {
  getChatRooms,
  getNextChatRoomsPage,
  createChatRoom,
  deleteChatRoom,
} from "@/lib/api/room";
import {
  ChatRoom,
  ChatRoomsPageResponse,
  GetChatRoomsParams,
  RoomSortField,
  SortDirection,
  createRoomSortParam,
  CreateChatRoomRequest,
} from "@/types/room";

interface UseRoomsOptions {
  pageSize?: number;
  sortField?: RoomSortField;
  sortDirection?: SortDirection;
  autoFetch?: boolean; // 자동으로 첫 페이지 로드 (기본값: true)
}

export function useRooms(options: UseRoomsOptions = {}) {
  const {
    pageSize = 20,
    sortField = "createdAt",
    sortDirection = "desc",
    autoFetch = true,
  } = options;

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pageInfo, setPageInfo] = useState<{
    currentPage: number;
    totalPages: number;
    totalElements: number;
    size: number;
  } | null>(null);

  const sort = createRoomSortParam(sortField, sortDirection);

  // 채팅방 목록 조회
  const fetchRooms = useCallback(
    async (page: number = 0) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getChatRooms({
          page,
          size: pageSize,
          sort,
        });

        setRooms(response.detail.content);
        setPageInfo({
          currentPage: response.detail.number,
          totalPages: response.detail.totalPages,
          totalElements: response.detail.totalElements,
          size: response.detail.size,
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error("조회 실패");
        setError(error);
        setRooms([]);
        setPageInfo(null);
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize, sort]
  );

  // 다음 페이지 로드
  const loadNextPage = useCallback(async () => {
    if (!pageInfo || isLoading) return;

    const currentPage = pageInfo.currentPage;
    if (currentPage + 1 >= pageInfo.totalPages) return;

    await fetchRooms(currentPage + 1);
  }, [pageInfo, isLoading, fetchRooms]);

  // 이전 페이지 로드
  const loadPreviousPage = useCallback(async () => {
    if (!pageInfo || isLoading) return;

    const currentPage = pageInfo.currentPage;
    if (currentPage <= 0) return;

    await fetchRooms(currentPage - 1);
  }, [pageInfo, isLoading, fetchRooms]);

  // 특정 페이지로 이동
  const goToPage = useCallback(
    async (page: number) => {
      if (!pageInfo || isLoading) return;

      if (page < 0 || page >= pageInfo.totalPages) {
        console.warn(`Invalid page number: ${page}`);
        return;
      }

      await fetchRooms(page);
    },
    [pageInfo, isLoading, fetchRooms]
  );

  // 새로고침 (현재 페이지 다시 로드)
  const refresh = useCallback(async () => {
    const currentPage = pageInfo?.currentPage ?? 0;
    await fetchRooms(currentPage);
  }, [pageInfo, fetchRooms]);

  // 채팅방 생성
  const createRoom = useCallback(
    async (request: CreateChatRoomRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await createChatRoom(request);
        // 생성 후 첫 페이지로 이동하여 새로 생성된 방 표시
        await fetchRooms(0);
        return response.detail;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("생성 실패");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchRooms]
  );

  // 채팅방 삭제
  const deleteRoom = useCallback(
    async (roomId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await deleteChatRoom(roomId);
        // 삭제 후 현재 페이지 새로고침
        await refresh();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("삭제 실패");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [refresh]
  );

  // 초기 로드
  useEffect(() => {
    if (autoFetch) {
      fetchRooms(0);
    }
  }, [autoFetch, fetchRooms]);

  return {
    rooms,
    isLoading,
    error,
    pageInfo,
    fetchRooms,
    loadNextPage,
    loadPreviousPage,
    goToPage,
    refresh,
    createRoom,
    deleteRoom,
    hasNextPage: pageInfo
      ? pageInfo.currentPage + 1 < pageInfo.totalPages
      : false,
    hasPreviousPage: pageInfo ? pageInfo.currentPage > 0 : false,
  };
}

/**
 * 무한 스크롤을 위한 채팅방 훅
 */
export function useInfiniteRooms(options: UseRoomsOptions = {}) {
  const {
    pageSize = 20,
    sortField = "createdAt",
    sortDirection = "desc",
    autoFetch = true,
  } = options;

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const sort = createRoomSortParam(sortField, sortDirection);

  // 첫 페이지 로드
  const fetchInitialRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRooms([]);
    setCurrentPage(0);
    setHasMore(true);

    try {
      const response = await getChatRooms({
        page: 0,
        size: pageSize,
        sort,
      });

      setRooms(response.detail.content);
      setCurrentPage(0);
      setHasMore(response.detail.number + 1 < response.detail.totalPages);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("조회 실패");
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, sort]);

  // 다음 페이지 추가 로드
  const fetchMoreRooms = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    setError(null);

    try {
      const nextPage = currentPage + 1;
      const response = await getChatRooms({
        page: nextPage,
        size: pageSize,
        sort,
      });

      setRooms((prev) => [...prev, ...response.detail.content]);
      setCurrentPage(nextPage);
      setHasMore(response.detail.number + 1 < response.detail.totalPages);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("조회 실패");
      setError(error);
    } finally {
      setIsFetchingMore(false);
    }
  }, [pageSize, sort, currentPage, isFetchingMore, hasMore]);

  // 채팅방 생성
  const createRoom = useCallback(
    async (request: CreateChatRoomRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await createChatRoom(request);
        // 생성 후 목록을 처음부터 다시 로드
        await fetchInitialRooms();
        return response.detail;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("생성 실패");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchInitialRooms]
  );

  // 채팅방 삭제
  const deleteRoom = useCallback(
    async (roomId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await deleteChatRoom(roomId);
        // 삭제 후 목록을 처음부터 다시 로드
        await fetchInitialRooms();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("삭제 실패");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchInitialRooms]
  );

  // 초기 로드
  useEffect(() => {
    if (autoFetch) {
      fetchInitialRooms();
    }
  }, [autoFetch, fetchInitialRooms]);

  return {
    rooms,
    isLoading,
    isFetchingMore,
    error,
    hasMore,
    fetchInitialRooms,
    fetchMoreRooms,
    createRoom,
    deleteRoom,
  };
}
