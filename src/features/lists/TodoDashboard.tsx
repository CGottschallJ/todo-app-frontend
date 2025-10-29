import { useState } from 'react';
import { useGetListsQuery, useCreateListMutation, useGetListItemsQuery } from '@/store/api';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { supabase } from '@/lib/supabase';
import { TodoList } from './list/List';
import { BiLoaderAlt } from 'react-icons/bi';
import { Input } from '@/components/ui/input';

export function TodoDashboard() {
  const [newListName, setNewListName] = useState('');
  const { data: lists, isLoading } = useGetListsQuery();
  const [createList] = useCreateListMutation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const { data: listItems } = useGetListItemsQuery();

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    await createList({ name: newListName });
    setNewListName('');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <BiLoaderAlt className="animate-spin text-gray-600 text-4xl" />
        <p className="text-gray-600 mt-4">Loading Your Lists...</p>
        <p className="text-gray-600 mt-2">Way to be proactive! Let's get some things done today!</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center flex-col md:flex-row justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Lists</h1>
          <div className="flex flex-col items-center gap-0 text-right">
            <p className="text-sm text-gray-600 mt-2 md:mt-0">{user?.email}</p>
            <Button variant="link" onClick={handleLogout} className="text-right w-auto h-auto p-0 m-0 md:self-end">
              logout
            </Button>
          </div>
        </div>

        {/* Create New List Form */}
        <form onSubmit={handleCreateList} className="my-8 flex gap-4">
          <Input
            type="text"
            value={newListName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewListName(e.target.value)}
            placeholder="New list name..."
            className="w-full md:w-1/3 rounded-xl"
          />
          <Button type="submit">Create List</Button>
        </form>

        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists?.map((list) => (
            <TodoList key={list.id} list={list} listItems={listItems?.filter((item) => item.list_id === list.id) || []} />
          ))}
        </div>

        {lists?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No lists yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
