import { GraphQLClient } from "graphql-request";

const endpoint = "/graphql";
const client = new GraphQLClient(endpoint);

export default client;
