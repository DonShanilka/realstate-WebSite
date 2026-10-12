import { useMemo, useState } from "react";

export interface DashboardBooking {
  id: number;
  propertyTitle: string;
  buyerName: string;
  date: string;
  status: string;
}

interface BookingCalendarProps {
  bookings: DashboardBooking[];
}

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

export default function BookingCalendar({ bookings }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(() =>
    getDateKey(new Date()),
  );

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [currentMonth]);

  const bookingDates = useMemo(() => {
    const dates = new Set<string>();

    bookings.forEach((booking) => {
      const date = new Date(booking.date);

      if (!Number.isNaN(date.getTime())) {
        dates.add(getDateKey(date));
      }
    });

    return dates;
  }, [bookings]);

  const selectedBookings = bookings.filter((booking) => {
    const date = new Date(booking.date);

    return !Number.isNaN(date.getTime()) && getDateKey(date) === selectedDate;
  });

  function changeMonth(amount: number) {
    setCurrentMonth(
      (month) => new Date(month.getFullYear(), month.getMonth() + amount, 1),
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Schedule
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
            Booking calendar
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          >
            ›
          </button>
        </div>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-700">
        {formatDate(currentMonth)}
      </p>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="py-2 text-xs font-medium text-slate-400">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />;
          }

          const dateKey = getDateKey(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day),
          );

          const hasBooking = bookingDates.has(dateKey);
          const selected = selectedDate === dateKey;

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => setSelectedDate(dateKey)}
              aria-pressed={selected}
              className={`relative flex h-10 items-center justify-center rounded-xl text-sm transition ${
                selected
                  ? "bg-slate-900 font-semibold text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {day}

              {hasBooking && (
                <span
                  className={`absolute bottom-1 h-1 w-1 rounded-full ${
                    selected ? "bg-white" : "bg-blue-600"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <h3 className="text-sm font-semibold text-slate-900">
          Bookings on{" "}
          {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </h3>

        {selectedBookings.length === 0 ? (
          <p className="mt-3 text-sm leading-6 text-slate-500">
            No bookings scheduled for this date.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {selectedBookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <p className="text-sm font-medium text-slate-900">
                  {booking.propertyTitle}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Buyer: {booking.buyerName}
                </p>

                <p className="mt-2 text-xs font-medium capitalize text-slate-600">
                  {booking.status.replaceAll("_", " ").toLowerCase()}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
