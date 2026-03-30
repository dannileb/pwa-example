import { Note, notesDB } from "#/databases/notesDatabase";
import { useCallback, useState } from "react";
import { NoteCard } from "./NoteCard";
import classes from "./NotesList.module.css";
import { href, useNavigate } from "react-router";
import { useMessageToastContext } from "#/components/MessageToast/useMessageToast/MessageToastContext";
import { ROUTES } from "#/router/config";
import { Button } from "#/ui/Button/Button";
import { FormOutlined } from "@ant-design/icons";

interface NotesListContentProps {
  loadedNotes: Note[];
}

export const NotesListContent = ({ loadedNotes }: NotesListContentProps) => {
  const navigate = useNavigate();
  const { addToast } = useMessageToastContext();
  const [notes, setNotes] = useState<Note[]>(loadedNotes);

  const handleAddNote = () => {
    notesDB.notes
      .add({ text: "", title: "" })
      .then((id) => {
        if (id) {
          navigate(href(ROUTES.NOTE_PAGE, { id: id.toString() }));
        }
      })
      .catch((e) => {
        console.debug(e);
        addToast({ text: "Ошибка при добавлении заметки", type: "error" });
      });
  };

  const handleDeleteNote = useCallback(
    (id: Note["id"]) => {
      const noteId = Number(id);
      if (!id) {
        return;
      }
      notesDB.notes
        .delete(noteId)
        .then(() => {
          setNotes((prev) => prev.filter((n) => n.id !== id));
        })
        .catch((error) => {
          addToast({ text: "Ошибка при удалении заметки", type: "error" });
          console.error("Ошибка при удалении заметки: ", error);
        });
    },
    [setNotes, addToast]
  );

  return (
    <>
      <ul className={classes.notes}>
        {notes?.map((note, index) => {
          return (
            <NoteCard key={index} note={note} onDeleteNote={handleDeleteNote} />
          );
        })}
      </ul>
      {notes && (
        <div className={classes.emptyMessage}>
          {!notes.length && <p>Список заметок пуст</p>}
          <Button onClick={handleAddNote} icon={<FormOutlined />}>
            Создать заметку
          </Button>
        </div>
      )}
    </>
  );
};
