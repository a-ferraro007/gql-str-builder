import {
    type GraphQLQuery,
    type GraphQLQueryFields,
    type GraphqlQueryConstruct,
    type RequestParameters,
    TOKENS,
} from "./types";

class GraphQLQueryConstructMap {
    gqlQueryMap: Record<string, string>;
    /**
     *
     * @param gqlQueryConstructs GraphqlQueryConstruct[]
     */
    constructor(gqlQueryConstructs: GraphqlQueryConstruct[]) {
        this.gqlQueryMap = {} as Record<string, string>;
        for (const queryConstruct of gqlQueryConstructs) {
            //this.gqlQueryMap.set(queryConstruct.requestName, this.#buildTemplateString(queryConstruct));
            this.gqlQueryMap[queryConstruct.requestName] = this.#buildTemplateString(queryConstruct);
        }
    }

    #buildTemplateString = (gqlQueryConstruct: GraphqlQueryConstruct) => {
        const { type, requestName, requestParameters, queries } = gqlQueryConstruct;
        let templateStr = this.#buildRequest({ type, requestName, requestParameters }, ``);
        templateStr = this.#buildRequestQueries(queries, templateStr);

        return (templateStr += TOKENS.CLOSED_BRACKET);
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
                TOKENS.OPEN_BRACKET;

            templateStr += this.#buildQueryFields(queryFields.values(), str);
        }
        return templateStr;
    };

    #buildQueryFields = (
        fields: IterableIterator<string | [string, Set<string>]> | [string, Set<string>] | undefined, //GraphQLQueryFields
        templateStr: string
    ): string => {
        if (!fields) {
            return templateStr + TOKENS.CLOSED_BRACKET;
        }

        for (const field of fields) {
            if (typeof field === "string") {
                templateStr += field + TOKENS.WHITE_SPACE;
            } else if (field instanceof Array) {
                templateStr += field.shift() + TOKENS.WHITE_SPACE + TOKENS.OPEN_BRACKET;
                return this.#buildQueryFields(field, templateStr);
            } else if (field instanceof Set) {
                for (const f of field) {
                    templateStr += f + TOKENS.WHITE_SPACE;
                }
            }
        }
        return this.#buildQueryFields(undefined, templateStr);
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
            TOKENS.CLOSED_PAREN);
    };
}

const input: GraphqlQueryConstruct = {
    type: "query",
    requestName: "GetAvailabilities",
    requestParameters: {
        arg: "request",
        argType: "AvailabilitiesInput",
    },
    queries: [
        {
            queryName: "availabilities",
            queryParameters: "request",
            queryFields: new Set([
                "availableDate",
                "isAvailable",
                "appointmentStatus",
                "durationInMinutes",
                [
                    "providers",
                    new Set([
                        "id",
                        "adId",
                        "firstName",
                        "middleName",
                        "lastName",
                        "placeId",
                        "profileUrl",
                        "accountId",
                    ]),
                ],
            ]),
        },
    ],
};

const secondInput: GraphqlQueryConstruct = {
    type: "query",
    requestName: "PostAvailabilities",
    requestParameters: {
        arg: "request",
        argType: "AvailabilitiesInput",
    },
    queries: [
        {
            queryName: "noAvailabilities",
            queryParameters: "request",
            queryFields: new Set(["availableDate", ["advisors", new Set(["adId", "accountId"])]]),
        },
    ],
};

const { gqlQueryMap } = new GraphQLQueryConstructMap([input, secondInput]);
console.log(gqlQueryMap.GetAvailabilities);
