"use client";

import useEventsByProducer from "@/hooks/useEventsByProducer";

interface Props {
  selectedEventId: string | null;
  onSelect: (eventId: string) => void;
}

export default function EventSelector({ selectedEventId, onSelect }: Props) {
  const { events, loading } = useEventsByProducer();

  if (loading) return <p className="text-sm text-gray-400">Cargando eventos...</p>;
  if (events.length === 0)
    return (
      <p className="text-sm text-gray-400 italic">
        No tienes eventos creados aún.
      </p>
    );

  console.log(events);

  return (
    <div className="relative">
      <label
        htmlFor="event-select"
        className="block text-sm font-medium text-gray-300 mb-1.5"
      >
        Selecciona un evento:
      </label>
      <select
        id="event-select"
        value={selectedEventId || ""}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full appearance-none bg-gray-700 border border-gray-600 text-white px-4 py-2.5 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base hover:bg-gray-600 transition-colors cursor-pointer"
      >
        <option value="" disabled className="text-gray-500">
          -- Selecciona un evento --
        </option>
        {events.map((event) => (
          <option
            key={event.id}
            value={event.id}
            className="bg-gray-700 text-white"
          >
            {event.name} -{" "}
            {new Date(event.date.seconds * 1000).toLocaleDateString()}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 top-7 flex items-center px-2 text-gray-400">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}
