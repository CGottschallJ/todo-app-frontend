import React, { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateListItemMutation } from '@/store/api';
import { FaPlus, FaSpinner, FaCheck, FaXmark } from 'react-icons/fa6';

export default function NewListItemField({ listId }: { listId: string }) {
  const [newListItemInputValue, setNewListItemInputValue] = useState('');
  const [successfullyAddedListItem, setSuccessfullyAddedListItem] = useState<boolean | null>(null);
  const [createListItem, { isLoading: itemIsBeingAdded }] = useCreateListItemMutation();

  // Event Handlers
  const handleCreateListItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListItemInputValue.trim()) return;
    const result = await createListItem({ title: newListItemInputValue, list_id: listId });

    // If the call to add a list item fails, set the state to false and show an alert
    if (result.error) {
      alert(result.error);
      setSuccessfullyAddedListItem(false);
      setTimeout(() => {
        setSuccessfullyAddedListItem(null);
      }, 2000);
      return;
    }

    // If the call to add a list item succeeds, set the state to true and clear the input field
    if (result.data) {
      setSuccessfullyAddedListItem(true);
      setTimeout(() => {
        setSuccessfullyAddedListItem(null);
      }, 2000);
    }

    setNewListItemInputValue('');
  };

  return (
    <form onSubmit={handleCreateListItem} className="flex items-center gap-2 w-full">
      <Input type="text" value={newListItemInputValue} onChange={(e) => setNewListItemInputValue(e.target.value)} placeholder="Add an item" className="w-full h-12 rounded-xl" />
      <Button type="submit" variant="icon" size="icon" disabled={itemIsBeingAdded} className="rounded-full" onClick={handleCreateListItem}>
        {!itemIsBeingAdded && !successfullyAddedListItem && <FaPlus />}
        {itemIsBeingAdded && <FaSpinner className="text-gray-500 animate-spin" />}
        {successfullyAddedListItem === true && <FaCheck className="text-green-500" />}
        {successfullyAddedListItem === false && <FaXmark className="text-red-500" />}
      </Button>
    </form>
  );
}
