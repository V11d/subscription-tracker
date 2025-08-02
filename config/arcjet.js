import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node"

const aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
        // Shield protects your app from common attacks e.g. SQL injection
        shield({ mode: "LIVE" }),
        // Create a bot detection rule
        detectBot({
            mode: "LIVE",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                "POSTMAN", // Allow Postman for API testing
            ],
        }),
        tokenBucket({
            mode: "LIVE",
            refillRate: 5, // Refill 5 tokens per interval
            interval: 10, // Refill every 10 seconds
            capacity: 10, // Bucket capacity of 10 tokens
        }),
    ],
})

export default aj