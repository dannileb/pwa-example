import { Note, notesDB } from "#/databases/notesDatabase";
import { Button } from "#/ui/Button/Button";
import { TextField } from "#/ui/TextField/TextField";
import { ShareAltOutlined } from "@ant-design/icons";
import classes from "./NotePage.module.css";
import { useMessageToastContext } from "#/components/MessageToast/useMessageToast/MessageToastContext";
import { useNavigate, useParams } from "react-router";
import { useMatchMedia } from "#/hooks/useMatchMedia";
import { useWebShare } from "#/hooks/useWebShare";
import { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { TextArea } from "#/ui/TextArea/TextArea";

interface NotePageContentProps {
  loadedNote: Note | undefined;
}

export const NotePageContent = ({ loadedNote }: NotePageContentProps) => {
  const { addToast } = useMessageToastContext();

  const { id } = useParams();
  const navigate = useNavigate();

  const isWideScreen = useMatchMedia("(min-width: 1024px)");

  const { share, canShare } = useWebShare();

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [note, setNote] = useState<Note | undefined>(loadedNote);

  useEffect(() => {
    if (loadedNote) {
      if (!loadedNote.text) {
        setIsEdit(true);
      }
    }
  }, [loadedNote]);

  const handleUpdateNote = useCallback(
    async (title: string, text: string) => {
      try {
        const noteId = Number(id);
        const res = await notesDB.notes.update(noteId, { title, text });
        console.debug(res);
      } catch (error) {
        console.error("Ошибка при обновлении заметки: ", error);
      }
    },
    [id]
  );

  const handleDeleteNote = useCallback(async () => {
    try {
      const noteId = Number(id);
      await notesDB.notes.delete(noteId);
      navigate("/notes");
    } catch (error) {
      addToast({ text: "Ошибка при удалении заметки", type: "error" });
      console.error("Ошибка при удалении заметки: ", error);
    }
  }, [id, navigate, addToast]);

  const controlButtons = useMemo(() => {
    if (!note) {
      return;
    }
    return (
      <div
        className={classNames(classes.toolbar, {
          [classes.toolbar_wideScreen]: isWideScreen,
        })}
      >
        <Button onClick={handleDeleteNote}>Удалить</Button>
        <Button
          onClick={() => {
            if (isEdit && note) {
              handleUpdateNote(note.title, note.text);
            }
            setIsEdit((prev) => !prev);
          }}
        >
          {isEdit ? "Сохранить" : "Редактировать"}
        </Button>
      </div>
    );
  }, [handleDeleteNote, handleUpdateNote, isEdit, note, isWideScreen]);
  return (
    <>
      <div className={classes.noteContainer}>
        {note ? (
          <>
            <div
              className={classes.titleWrapper}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {isEdit ? (
                <TextField
                  className={classes.title}
                  inputMode="text"
                  inputProps={{
                    placeholder: "Заголовок заметки",
                  }}
                  value={note.title}
                  onChange={(title) => {
                    setNote({ ...note, title });
                  }}
                />
              ) : (
                <h2>{note.title}</h2>
              )}
              {canShare && (
                <Button
                  view="clear"
                  icon={<ShareAltOutlined />}
                  onClick={() => {
                    share({ text: note.text, title: note.title }).catch(() => {
                      addToast({
                        text: "Произошла ошибка, попробуйте позже",
                        type: "error",
                      });
                    });
                  }}
                />
              )}
              {isWideScreen && controlButtons}
            </div>
            {isEdit ? (
              <TextArea
                className={classes.description}
                value={note.text}
                placeholder={"Текст заметки"}
                name="note-text"
                inputMode="text"
                onChange={(event) => {
                  setNote({ ...note, text: event.target.value });
                }}
              />
            ) : (
              <p
                style={{
                  whiteSpace: "pre-wrap",
                }}
              >
                {note.text}
              </p>
            )}
          </>
        ) : (
          <p>Заметка не найдена!</p>
        )}
      </div>
      {!isWideScreen && controlButtons}
    </>
  );
};
