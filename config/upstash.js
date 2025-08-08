import { Client as workflow_client } from "@upstash/workflow"

export const client = new workflow_client({
    baseUrl: process.env.QSTASH_URL,
    token: process.env.QSTASH_TOKEN,
})