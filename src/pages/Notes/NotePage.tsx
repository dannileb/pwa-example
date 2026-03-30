import { useNavBar } from "#/components/NavBar/useNavBar/useNavBar";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";

import { ROUTES } from "#/router/config";
import { NotePageContent } from "./NotePageContent";
import { notePageLoader } from "./helpers";

const NotePage = () => {
  useNavBar({ backLink: { url: ROUTES.NOTES_LIST }, title: "Заметки" });
  const notePromise = useLoaderData<ReturnType<typeof notePageLoader>>();

  return (
    <section
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Suspense fallback={<h2>Загрузка заметки...</h2>}>
        <Await resolve={notePromise}>
          {(note) => <NotePageContent loadedNote={note} />}
        </Await>
      </Suspense>
    </section>
  );
};

export default NotePage;
