import { useNavBar } from "#/components/NavBar/useNavBar/useNavBar";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import { ROUTES } from "#/router/config";
import { notesListLoader } from "./helpers";
import { NotesListContent } from "./NotesListContent";

function NotesList() {
  useNavBar({ backLink: { url: ROUTES.START_PAGE }, title: "Заметки" });
  const notesPromise = useLoaderData<ReturnType<typeof notesListLoader>>();

  return (
    <section>
      <Suspense fallback={<h2>Загрузка заметок...</h2>}>
        <Await resolve={notesPromise}>
          {(notes) => <NotesListContent loadedNotes={notes} />}
        </Await>
      </Suspense>
    </section>
  );
}

export default NotesList;
