import { supabase } from '@/lib/supabase';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface List {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface ListItem {
  id: string;
  title: string;
  completed: boolean;
  list_id: string;
  user_id: string;
  created_at: string;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    // Get the JWT token
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Create base query with token

    const baseQuery = fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_API_URL}/api`,
      prepareHeaders: (headers) => {
        if (session?.access_token) {
          headers.set('Authorization', `Bearer ${session.access_token}`);
        }
        return headers;
      },
    });

    return baseQuery(args, api, extraOptions);
  },
  tagTypes: ['LISTS', 'LIST_ITEMS'],
  endpoints: (builder) => ({
    // Lists endpoints
    getLists: builder.query<List[], void>({
      query: () => '/lists',
      providesTags: ['LISTS'],
    }),
    createList: builder.mutation<List, { name: string }>({
      query: (body) => ({
        url: '/lists',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['LISTS'],
    }),
    deleteList: builder.mutation<void, string>({
      query: (id) => ({
        url: `/lists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LISTS', 'LIST_ITEMS'],
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        const optimisticData = dispatch(
          api.util.updateQueryData('getLists', undefined, (draft: List[]) => {
            return draft.filter((list: List) => list.id !== args);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          optimisticData.undo();
        }
      },
    }),
    updateList: builder.mutation<List, { id: string; updates: Partial<List> }>({
      query: ({ id, updates }) => ({
        url: `/lists/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['LISTS'],
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        const optimisticData = dispatch(
          api.util.updateQueryData('getLists', undefined, (draft: List[]) => {
            const list = JSON.parse(JSON.stringify(draft)).find((list: List) => list.id === args.id);
            if (list) {
              return draft.map((list: List) => (list.id === args.id ? { ...list, ...args.updates } : list));
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          optimisticData.undo();
        }
      },
    }),

    // ListItems endpoints
    getListItems: builder.query<ListItem[], void>({
      query: () => '/todos',
      providesTags: ['LIST_ITEMS'],
    }),
    createListItem: builder.mutation<ListItem, { title: string; list_id: string }>({
      query: (body) => ({
        url: '/todos',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['LIST_ITEMS'],
    }),
    updateListItem: builder.mutation<ListItem, { id: string; updates: Partial<ListItem> }>({
      query: ({ id, updates }) => ({
        url: `/todos/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['LIST_ITEMS'],

      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        const optimisticData = dispatch(
          // Gathering current state of the updated todo from RTK Query cache
          api.util.updateQueryData('getListItems', undefined, (draft: ListItem[]) => {
            const todo = JSON.parse(JSON.stringify(draft)).find((todo: ListItem) => todo.id === args.id);

            // If the todo is found, update it with the new values
            if (todo) {
              return draft.map((todo: ListItem) => (todo.id === args.id ? { ...todo, ...args.updates } : todo));
            }

            // If the todo is not found, return the original draft
            return draft;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          optimisticData.undo();
        }
      },
    }),
    deleteListItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LIST_ITEMS'],
    }),
  }),
});

export const {
  useGetListsQuery,
  useCreateListMutation,
  useDeleteListMutation,
  useUpdateListMutation,
  useGetListItemsQuery,
  useCreateListItemMutation,
  useUpdateListItemMutation,
  useDeleteListItemMutation,
} = api;
