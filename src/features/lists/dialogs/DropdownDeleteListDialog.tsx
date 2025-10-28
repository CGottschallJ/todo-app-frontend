import { Dialog, DialogDescription, DialogTitle, DialogTrigger, DialogHeader, DialogFooter, DialogContent, DialogClose } from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useDeleteListMutation } from '@/store/api';

export default function DropdownDeleteListDialog({ listId }: { listId: string }) {
  const [deleteList, { isLoading }] = useDeleteListMutation();

  const handleDeleteList = async () => {
    await deleteList(listId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete List</DropdownMenuItem>
      </DialogTrigger>
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
