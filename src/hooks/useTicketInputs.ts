import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function useTicketInputs(
  initialName = "",
  initialId = "",
  initialTicketId = ""
) {
  const [nameInput, setNameInput] = useState(initialName);
  const [idInput, setIdInput] = useState(initialId);
  const [ticketIdInput, setTicketIdInput] = useState(initialTicketId);

  const [debouncedName] = useDebounce(nameInput, 600);
  const [debouncedId] = useDebounce(idInput, 600);
  const [debouncedTicketId] = useDebounce(ticketIdInput, 600);

  return {
    nameInput,
    setNameInput,
    idInput,
    setIdInput,
    ticketIdInput,
    setTicketIdInput,
    debouncedName,
    debouncedId,
    debouncedTicketId,
  };
}
