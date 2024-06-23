import {
    type GraphQLQuery,
    type GraphQLQueryFields,
    type GraphqlQueryConstruct,
    type RequestParameters,
    TOKENS,
} from "./types";

class GraphQLQueryMap {
    gqlQueryMap: Record<string, string>;
    /**
     * @param gqlQueryConstructs GraphqlQueryConstruct[]
     * @return gqlQueryMap
     */
    constructor(gqlQueryConstructs: GraphqlQueryConstruct[]) {
        this.gqlQueryMap = {} as Record<string, string>;
        for (const queryConstruct of gqlQueryConstructs) {
            this.gqlQueryMap[queryConstruct.requestName] = this.#buildGqlTemplateString(queryConstruct);
        }
    }

    #buildGqlTemplateString = (gqlQueryConstruct: GraphqlQueryConstruct) => {
        const { type, requestName, requestParameters, queries } = gqlQueryConstruct;
        const request = this.#buildRequest({ type, requestName, requestParameters }, ``);
        const requestQueries = this.#buildRequestQueries(queries, ``);
        return `${request}${TOKENS.WHITE_SPACE}${requestQueries}${TOKENS.CLOSED_BRACKET}`;
    };

    #buildRequestQueries = (queries: GraphQLQuery[], templateStr: string) => {
        for (const query of queries) {
            let str = ``;
            const { queryName, queryParameters, queryFields } = query;
            str +=
                queryName +
                TOKENS.OPEN_PAREN +
                "request: " +
                TOKENS.CASH +
                queryParameters +
                TOKENS.CLOSED_PAREN +
                TOKENS.OPEN_BRACKET +
                TOKENS.NEW_LINE;

            return `${templateStr}${this.#buildQueryFields(Array.from(queryFields.values()), str)}${
                TOKENS.CLOSED_BRACKET
            }${TOKENS.NEW_LINE}`;
        }
    };

    #buildQueryFields = (
        fields: Array<string> | Array<string | [string, GraphQLQueryFields]>,
        templateStr: string
    ): any => {
        if (fields.length === 0) {
            return templateStr;
        }

        const field = fields.shift() as string | Array<any>;
        if (typeof field === "string") {
            templateStr += `${field}${TOKENS.WHITE_SPACE}${TOKENS.NEW_LINE}`;
        } else {
            templateStr += `${TOKENS.WHITE_SPACE}${field.shift()}${TOKENS.WHITE_SPACE}${TOKENS.OPEN_BRACKET}${
                TOKENS.NEW_LINE
            }`;

            templateStr = `${this.#buildQueryFields(Array.from(field[0].values()), templateStr)}${
                TOKENS.CLOSED_BRACKET
            }${TOKENS.NEW_LINE}`;
        }

        return this.#buildQueryFields(fields, templateStr);
    };

    #buildRequest = (
        {
            type,
            requestName,
            requestParameters,
        }: {
            type: string;
            requestName: string;
            requestParameters: RequestParameters;
        },
        templateStr: string
    ) => {
        return (templateStr +=
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
            TOKENS.CLOSED_PAREN +
            TOKENS.OPEN_BRACKET +
            TOKENS.NEW_LINE);
    };
}

export class GqlQueryBuilder extends GraphQLQueryMap {
    constructor(gqlQueryConstructs: GraphqlQueryConstruct[]) {
        super(gqlQueryConstructs);
    }

    // TODO: pretty print query string
    prettyPrint = () => {
        console.log("not implemented yet");
    };
}
