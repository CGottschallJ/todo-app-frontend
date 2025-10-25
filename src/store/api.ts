import { supabase } from '@/lib/supabase';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface List {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

interface Todo {
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
      baseUrl: `https://todo-app-backend-production-5872.up.railway.app/api`,
      prepareHeaders: (headers) => {
        console.log('API URL', import.meta.env.VITE_API_URL);
        if (session?.access_token) {
          headers.set('Authorization', `Bearer ${session.access_token}`);
        }
        return headers;
      },
    });

    return baseQuery(args, api, extraOptions);
  },
  tagTypes: ['LISTS', 'TODOS'],
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
      invalidatesTags: ['LISTS', 'TODOS'],
    }),
    // Todos endpoints
    getTodos: builder.query<Todo[], void>({
      query: () => '/todos',
      providesTags: ['TODOS'],
    }),
    createTodo: builder.mutation<Todo, { title: string; list_id: string }>({
      query: (body) => ({
        url: '/todos',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TODOS'],
    }),
    updateTodo: builder.mutation<Todo, { id: string; updates: Partial<Todo> }>({
      query: ({ id, updates }) => ({
        url: `/todos/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['TODOS'],
    }),
    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TODOS'],
    }),
  }),
});

export const { useGetListsQuery, useCreateListMutation, useDeleteListMutation, useGetTodosQuery, useCreateTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation } = api;
