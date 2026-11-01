import { useDispatch, useSelector } from "react-redux";
import { READ_STATUS } from "../utils/constants";
import { selectLibrary } from "../store/selectors";
import { completeBook, startReading, toggleSaved } from "../store/slices/librarySlice";
import useRequireAuth from "./useRequireAuth";

/** Everything a card / page needs to know (and do) about one book's state.
 *  Actions return false when the visitor had to be sent to log in first. */
export default function useBookStatus(bookId) {
  const dispatch = useDispatch();
  const requireAuth = useRequireAuth();
  const { reading, completed, saved } = useSelector(selectLibrary);

  const status = reading.includes(bookId)
    ? READ_STATUS.READING
    : completed.includes(bookId)
    ? READ_STATUS.COMPLETED
    : READ_STATUS.NONE;

  const run = (type, thunk) => () => {
    if (!requireAuth({ type, bookId })) return false;
    dispatch(thunk(bookId));
    return true;
  };

  return {
    status,
    isSaved: saved.includes(bookId),
    start: run("start", startReading),
    complete: run("complete", completeBook),
    toggleSave: run("save", toggleSaved),
  };
}