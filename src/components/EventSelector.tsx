"use client";

import useEventsByProducer from "@/hooks/useEventsByProducer";

interface Props {
  selectedEventId: string | null;
  onSelect: (eventId: string) => void;
}

export default function EventSelector({ selectedEventId, onSelect }: Props) {
  const { events, loading } = useEventsByProducer();

  if (loading) return <p className="text-white">Cargando eventos...</p>;
  if (events.length === 0)
    return <p className="text-white">No tienes eventos creados aún.</p>;

  console.log(events);

  return (
    <div className="mb-6">
      <label className="block text-white mb-2 text-sm font-semibold">
        Selecciona un evento:
      </label>
      <select
        value={selectedEventId || ""}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full bg-gray-800 text-white border border-gray-700 p-3 rounded-lg"
      >
        <option value="" disabled>
          -- Selecciona un evento --
        </option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.name} - {new Date(event.date.seconds * 1000).toLocaleDateString()}
          </option>
        ))}
      </select>
    </div>
  );
}
