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
    const events = data.collection;

    const eventsDetails = await Promise.all(
      events.map(async (event: any) => {
        const meetLink = event.location?.join_url || "No Meet link";
        const eventUUID = event.uri.split("/").pop();
        const invitees = await getInviteeDetails(eventUUID);
        const organizers = event.event_memberships.map((membership: any) => ({
          name: membership.user_name,
          email: membership.user_email,
        }));
        const currentInvitee = invitees.filter(
          (invitee: any) => invitee.email === userEmail
        );
        return {
          name: event.name,
          professor: event.event_memberships[0].user_name,
          status: event.status,
          start_time: event.start_time,
          end_time: event.end_time,
          meetLink: meetLink,
          cancelLink: currentInvitee[0].cancel_url,
          rescheduleLink: currentInvitee[0].reschedule_url,
          organizers,
          // invitees: invitees.map((invitee: any) => ({
          //   name: invitee.name,
          //   email: invitee.email,
          // })),
        };
      })
    );
    return eventsDetails;
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
