import { default as e } from 'express';
import { verifyRequestSignature } from '@slack/events-api';

declare module 'http' {
    interface IncomingMessage {
        rawBody: string;
    }
}

const slackRequestVerifier = (signingSecret: string) => {
    return (req: e.Request, _res: e.Response, next: e.NextFunction) => {
        // throws if signature is invalid
        verifyRequestSignature({
            signingSecret: signingSecret,
            requestSignature: req.header('X-Slack-Signature') || '',
            requestTimestamp: Number(req.header('X-Slack-Request-Timestamp')) || 0,
            body: req.rawBody
        })
        next();
    }
}

const applySlackVerifier = (target: e.IRouter, path: string, signingSecret: string) => {
    target.use(e.json({
        // adds a rawBody property to the http.IncomingMessage object
        // so it can be passed to the verifyRequestSignature function
        verify: (req, _res, buf, encoding) => {
            req.rawBody = buf.toString(encoding);
        }
    }));

    target.use(path, slackRequestVerifier(signingSecret));
}

export { applySlackVerifier };
