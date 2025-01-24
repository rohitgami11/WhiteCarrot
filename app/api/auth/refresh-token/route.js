import { NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';

export async function GET(req) {
  const session = await getSession({ req });
  
  if (!session || !session.user.refreshToken) {
    return NextResponse.json({ error: 'No refresh token found' }, { status: 400 });
  }

  const refreshToken = session.user.refreshToken;
  const clientId = process.env.GOOGLE_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  try {
    // Step 1: Request a new access token using the refresh token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    // Step 2: Store the new access token and update session if needed
    const newAccessToken = data.access_token;
    const newExpiresIn = data.expires_in;

    // Optionally, update session or return the new token directly
    return NextResponse.json({
      access_token: newAccessToken,
      expires_in: newExpiresIn,
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
  }
}
