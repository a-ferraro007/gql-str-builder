import {
    type GraphQLQuery,
    TOKENS,
    type GraphQLQueryFields,
    type RequestParameters,
    type GraphqlQueryConstruct,
} from "./types";

const buildQueries = (queries: GraphQLQuery[], templateString: string): string => {
    for (const query of queries) {
        let templateStr = ``;
        const { queryName, queryParameters, queryFields } = query;
        templateStr +=
            queryName +
            TOKENS.OPEN_PAREN +
            "request: " +
            TOKENS.CASH +
            queryParameters +
            TOKENS.CLOSED_PAREN +
            TOKENS.OPEN_BRACKET;

        templateStr = buildQueryFields(queryFields, templateStr);
        templateString += templateStr;
    }

    return templateString;
};

const buildQueryFields = (
    fields: GraphQLQueryFields | [string, Set<string>] | undefined,
    templateStr: string
): string => {
    if (!fields) {
        return templateStr + TOKENS.CLOSED_BRACKET;
    }

    const iterator = fields.values();
    for (const field of iterator) {
        if (typeof field === "string") {
            templateStr += field + TOKENS.WHITE_SPACE;
        } else if (field instanceof Array) {
            templateStr += field.shift() + TOKENS.WHITE_SPACE + TOKENS.OPEN_BRACKET;
            return buildQueryFields(field, templateStr);
        } else if (field instanceof Set) {
            for (const f of field) {
                templateStr += f + TOKENS.WHITE_SPACE;
            }
        }
    }
    return buildQueryFields(undefined, templateStr);
};

const buildRequest = (
    {
        type,
        requestName,
        requestParameters,
    }: {
        type: string;
        requestName: string;
        requestParameters: RequestParameters;
    },
    templateString: string
): string => {
    templateString =
        type +
        TOKENS.WHITE_SPACE +
        requestName +
        TOKENS.OPEN_PAREN +
        TOKENS.CASH +
        requestParameters.arg +
        TOKENS.COLON +
        TOKENS.WHITE_SPACE +
        requestParameters.argType +
        TOKENS.BANG +
        TOKENS.CLOSED_PAREN;

    return templateString;
};

/**
 *
 * @param query - GraphQL javascript object
 * @returns string - gql template string
 */
export const constructGQLQueryString = (query: GraphqlQueryConstruct): string => {
    const { type, requestName, requestParameters, queries } = query;
    let templateStr = ``;
    templateStr = buildQueries(queries, buildRequest({ type, requestName, requestParameters }, templateStr));

    return templateStr + TOKENS.CLOSED_BRACKET;
};
