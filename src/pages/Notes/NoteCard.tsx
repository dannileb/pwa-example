import { SectionCard } from "#/components/SectionCard";
import { Note } from "#/databases/notesDatabase";
import { href, useNavigate } from "react-router";
import { ROUTES } from "#/router/config";
import { Menu, MenuItem, MenuTrigger } from "#/ui/Menu/Menu";
import { Popover } from "#/ui/Popover/Popover";
import { Pressable } from "react-aria-components";
interface NoteCardProps {
  note: Note;
  onDeleteNote: (id: Note["id"]) => void;
}

export const NoteCard = ({ note, onDeleteNote }: NoteCardProps) => {
  const navigate = useNavigate();

  return (
    <li>
      <MenuTrigger trigger="longPress">
        <Pressable>
          <div role="button">
            <SectionCard
              title={note.title || "Без названия"}
              description={note.text}
              onClick={() => {
                navigate(href(ROUTES.NOTE_PAGE, { id: note.id?.toString() }));
              }}
            />
          </div>
        </Pressable>
        <Popover>
          <Menu>
            <MenuItem
              onClick={() => {
                onDeleteNote(note.id);
              }}
            >
              Удалить
            </MenuItem>
          </Menu>
        </Popover>
      </MenuTrigger>
    </li>
  );
};
