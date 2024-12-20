# Push Notifications

We alert our cashiers to new activity in their Anypay account with native push
notifications. These messages are delivered by the mobile operating system's built-
in alerting capability. To simplify sending messages to multiple types of operating
systems we use Firebase Cloud Messaging to abstract differences.

## Environment Variables

The following environment variables must be provided:

- FIREBASE_SERVER_KEY

