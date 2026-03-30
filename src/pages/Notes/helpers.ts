import { notesDB } from "#/databases/notesDatabase";
import { ROUTES } from "#/router/config";
import { ActionFunctionArgs, ParamParseKey, Params } from "react-router";

interface NotePageArgs extends ActionFunctionArgs {
  params: Params<ParamParseKey<typeof ROUTES.NOTE_PAGE>>;
}

export const notePageLoader = async ({ params }: NotePageArgs) => {
  if (params) {
    const noteId = Number(params.id);
    if (noteId) {
      return notesDB.notes.get(noteId);
    }
  }
  return;
};

export const notesListLoader = async () => {
  return notesDB.notes.toArray();
};
