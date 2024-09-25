import { AppEnvs } from "./core/read-env";

export async function getUserUri() {
  try {
    const response = await fetch("https://api.calendly.com/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AppEnvs.CALENDLY_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching user info: ${response.statusText}`);
    }

    const data = await response.json();
    return data.resource.uri; // This is the user's URI
  } catch (error) {
    throw error;
  }
}

// Fetch scheduled events for the user
export async function getScheduledEvents(userEmail: string) {
  // const userUri = await getUserUri(); // Get the logged-in user's URI

  try {
    const response = await fetch(
      `https://api.calendly.com/scheduled_events?organization=${encodeURIComponent(
        AppEnvs.CALENDLEY_ORGANIZATION_URI
      )}&&invitee_email=${userEmail}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${AppEnvs.CALENDLY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching Calendly events: ${response.statusText}`);
    }

    const data = await response.json();
    return data.collection; // Return an array of scheduled events
  } catch (error) {
    throw error;
  }
}

export async function getInviteeDetails(event_uuid: string) {
  try {
    const response = await fetch(
      `https://api.calendly.com/scheduled_events/${event_uuid}/invitees`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${AppEnvs.CALENDLY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching invitees: ${response.statusText}`);
    }

    const data = await response.json();
    return data.collection; // Return an array of scheduled events
  } catch (error) {
    throw error;
  }
}
