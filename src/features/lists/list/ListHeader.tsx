import { useState } from 'react';
import ListDropdown from './ListDropdown';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaCheck } from 'react-icons/fa6';
import { useUpdateListMutation } from '@/store/api';

interface ListHeaderProps {
  listName: string;
  listId: string;
  completedListItems: number;
  incompletedListItems: number;
}

export default function ListHeader({ listName, listId, completedListItems, incompletedListItems }: ListHeaderProps) {
  const [isListNameEditing, setIsListNameEditing] = useState(false);
  const [editedListName, setEditedListName] = useState(listName);
  const [updateList] = useUpdateListMutation();

  const handleEditListClick = () => {
    setIsListNameEditing(true);
  };

  const handleSaveListName = () => {
    updateList({ id: listId, updates: { name: editedListName } });
    setIsListNameEditing(false);
  };

  return (
    <div className="flex items-center justify-between flex-col gap-2 w-full">
      <div className="flex items-center justify-between w-full">
        {isListNameEditing ? (
          <Input type="text" value={editedListName} placeholder={listName} onChange={(e) => setEditedListName(e.target.value)} className="w-full" />
        ) : (
          <h1 className="text-2xl font-bold">{listName}</h1>
        )}
        {isListNameEditing && (
          <Button variant="icon" size="icon" onClick={handleSaveListName}>
            <FaCheck />
          </Button>
        )}

        {!isListNameEditing && <ListDropdown listId={listId} handleEditListClick={handleEditListClick} />}
      </div>
      <div className="flex flex-row gap-2 text-left w-full">
        <span className="text-sm text-gray-500">{completedListItems} completed</span>
        <span className="text-sm text-gray-500">{incompletedListItems} incompleted</span>
      </div>
    </div>
  );
}
