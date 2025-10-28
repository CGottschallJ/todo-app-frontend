import { useState } from 'react';
import { Dialog, DialogDescription, DialogTitle, DialogHeader, DialogFooter, DialogContent, DialogClose } from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useDeleteListMutation } from '@/store/api';

export default function DropdownDeleteListDialog({ listId }: { listId: string }) {
  const [deleteList, { isLoading }] = useDeleteListMutation();
  const [open, setOpen] = useState(false);

  const handleDeleteList = async () => {
    await deleteList(listId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Delete List
      </DropdownMenuItem>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete List</DialogTitle>
          <DialogDescription>Are you sure you want to delete this list?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDeleteList} disabled={isLoading}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
