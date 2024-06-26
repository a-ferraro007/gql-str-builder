export type GraphqlQueryConstruct = {
    type: "query" | "mutation";
    requestName: string;
    requestParameters: RequestParameters;
    queries: Array<GraphQLQuery>;
};

export type RequestParameters = {
    arg: string;
    argType: string;
};

export type GraphQLQuery = {
    queryName: string;
    queryParameters: string;
    queryFields: GraphQLQueryFields;
};

export enum TOKENS {
    BANG = "!",
    COLON = ":",
    CASH = "$",
    OPEN_PAREN = "(",
    CLOSED_PAREN = ")",
    OPEN_BRACKET = "{",
    CLOSED_BRACKET = "}",
    WHITE_SPACE = " ",
    NEW_LINE = "\n",
}

export type GraphQLQueryFields = Set<string | [string, GraphQLQueryFields]>;
