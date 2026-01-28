import { Inngest } from "inngest";

// Initialize the Inngest client
export const inngest = new Inngest({
  id: "ticketing-system", // Unique App ID
  eventKey: process.env.INNGEST_EVENT_KEY, // Optional in Dev, Required in Prod
});
