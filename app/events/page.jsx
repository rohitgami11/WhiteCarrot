"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import FetchEvents from "@libs/fetchEvents";
import EventTable from "@components/EventTable";
import DateRangeSelector from "@components/DateRangeSelector";

const EventsPage = () => {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Helper function to check if the access token is expired
  const isTokenExpired = (expiresAt) => {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return expiresAt <= currentTime;
  };

  // Fetch events using the FetchEvents utility
  const fetchGoogleCalendarEvents = async (startDate, endDate) => {
    try {
      let accessToken = session?.user?.accessToken;

      // If token is expired, refresh it
      if (isTokenExpired(session?.user?.expires)) {
        const refreshResponse = await fetch("/api/auth/refresh-token");
        const refreshData = await refreshResponse.json();

        if (refreshData.access_token) {
          accessToken = refreshData.access_token;
        } else {
          alert("Session expired, please sign in again.");
          return;
        }
      }

      // Fetch events with the updated or valid token
      const eventsData = await FetchEvents(accessToken, startDate, endDate);
      setEvents(eventsData || []);
      console.log(eventsData[0]);
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Failed to fetch events.");
    }
  };

  // Handle "Fetch All Events" button click
  const handleFetchAllEvents = async () => {
    setLoading(true);
    await fetchGoogleCalendarEvents(); // No startDate or endDate, fetch all events
    setLoading(false);
  };

  // Handle date range fetch button
  const handleFetchDateRange = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    await fetchGoogleCalendarEvents(startDate, endDate);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Google Calendar Events</h1>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : session ? (
        <>
          <div className="flex gap-4 items-center mb-6">
            <button
              onClick={handleFetchAllEvents}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Fetching Events..." : "Fetch All Events"}
            </button>
            <div className="flex gap-4 items-center">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              />
              <button
                onClick={handleFetchDateRange}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={loading}
              >
                {loading ? "Fetching Events..." : "Fetch Events by Range"}
              </button>
            </div>
          </div>
          {loading ? (
            <p className="mt-4 text-gray-600">Fetching events...</p>
          ) : events.length > 0 ? (
            <EventTable events={events} />
          ) : (
            <p className="mt-4 text-gray-600">No events to display. Fetch all events or select a date range.</p>
          )}
        </>
      ) : (
        <p className="text-red-500">You need to sign in to view your events.</p>
      )}
    </div>
  );
};

export default EventsPage;
