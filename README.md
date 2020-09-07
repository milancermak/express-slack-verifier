# express-slack-verifier

An Express middleware to [verify](https://api.slack.com/authentication/verifying-requests-from-slack) requests from Slack.

## Why?

The [`@slack/events-api`](https://slack.dev/node-slack-sdk/events-api) does already provide an `expressMiddleware()` that gives you the signature verification. However, it also hijacks the processing of the event outside of the HTTP request-response loop of Express. This is an issue when deploying a Slackbot in on a serverless platform, where all the work has to be done within that request-response cycle.

This module then provides a simple middleware built on top of `slack/events-api` that verifies the request signature and, if valid, passes the request processing along the Express middleware stack.

## How?

Use the `applySlackVerifier` function the module exports. It attaches a middleware to a route under which you serve the requests coming from Slack.

```nodejs
import { default as e } from 'express';
import { applySlackVerifier } from 'express-slack-verifier';

const slackSigningSecret = '123456abcdefg';
const slackRouter = e.Router();

applySlackVerifier(router, '/', slackSigningSecret);

router.post('/event', (req, res) => {
    // handle a slack event here
});
```
