import { getServerSession } from 'next-auth';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const calendar = google.calendar('v3');

export async function POST(req) {
  try {
    const { startDate, endDate } = await req.json();
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oAuth2Client.setCredentials({
      access_token: session?.user?.accessToken, // Get the access token from the session
    });

    const params = {
      calendarId: 'primary',
      auth: oAuth2Client,
      timeMin: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
      timeMax: endDate ? new Date(endDate).toISOString() : new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    };

    const response = await calendar.events.list(params);
    const events = response.data.items || [];

    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
