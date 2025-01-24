export default function EventTable({ events }) {
  const moment = require('moment-timezone');

  if (events.length === 0) {
    return <p>No events found.</p>
  }

  return (
    <div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Event Name</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Time</th>
            <th className="px-4 py-2 border">Location</th>
            <th className="px-4 py-2 border">Description</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => {
            // Convert start time to Indian timezone
            const startTime = moment(event.start.dateTime).tz('Asia/Kolkata');

            return (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{event.summary || 'No Title'}</td>
                <td className="px-4 py-2 border">{startTime.format('YYYY-MM-DD')}</td>
                <td className="px-4 py-2 border">{startTime.format('HH:mm')}</td>
                <td className="px-4 py-2 border">{event.location || 'No Location'}</td>
                <td className="px-4 py-2 border">{event.description || 'No Description'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}