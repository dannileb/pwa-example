import { notesDB } from "#/databases/notesDatabase";
import { useMessageToastContext } from "#/components/MessageToast/useMessageToast/MessageToastContext";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

export const ShareTargetHandler = () => {
  const { addToast } = useMessageToastContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const title = searchParams.get("title") ?? "";
    const text = searchParams.get("text") ?? "";

    try {
      notesDB.notes.add({ text, title }).then((noteId) => {
        navigate(`/notes/${noteId}`);
      });
    } catch (e) {
      console.debug(e);
      addToast({ text: "Ошибка импорта заметки", type: "error" });
    }
  }, [addToast, navigate, searchParams]);

  return (
    <div>
      Создаём новую заметку <LoadingOutlined />
    </div>
  );
};
