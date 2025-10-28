import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FaEllipsis } from 'react-icons/fa6';
import DropdownDeleteListDialog from '../dialogs/DropdownDeleteListDialog';

export default function ListDropdown({ listId, handleEditListClick }: { listId: string; handleEditListClick: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="icon">
          <FaEllipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleEditListClick}>Edit Name</DropdownMenuItem>
        <DropdownDeleteListDialog listId={listId} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
