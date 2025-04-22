"use client";
import useEventsByProducer from "../hooks/useEventsByProducer";

export default function EventsList() {
  const { events, loading } = useEventsByProducer();

  if (loading) return <p className="text-white">Cargando eventos...</p>;
  if (events.length === 0)
    return <p className="text-white">No tienes eventos creados aún.</p>;

  return (
    <ul className="grid gap-4 mt-6">
      {events.map((event) => (
        <li
          key={event.id}
          className="bg-gray-800 border border-gray-700 p-4 rounded-xl shadow text-white"
        >
          <h3 className="text-lg font-bold">{event.name}</h3>
          <p>{event.location}</p>
          <p>{event.date.toDate().toLocaleString()}</p>
        </li>
      ))}
    </ul>
  );
}
