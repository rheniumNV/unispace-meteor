import { fetchFeedback } from "@unispace-meteor/miragex/dist/dev/resFeedback/fetch";
import { config } from "./config";

const feedbackLink = config.feedbackLink;

if (!feedbackLink) {
  throw new Error("FEEDBACK_LINK is not set.");
}

fetchFeedback({
  link: feedbackLink,
  outputPath: __dirname,
});
