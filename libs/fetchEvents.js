import axios from 'axios';

const FetchEvents = async (accessToken, startDate, endDate) => {
  try {
    const response = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        timeMin: startDate ? new Date(startDate).toISOString() : undefined,
        timeMax: endDate ? new Date(endDate).toISOString() : undefined,
        maxResults: 2500,
        singleEvents: true,
        orderBy: 'startTime'
      }
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return [];
  }
};

export default FetchEvents;