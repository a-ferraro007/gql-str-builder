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

        console.log(requestQueries);

        return request + TOKENS.WHITE_SPACE + requestQueries + TOKENS.CLOSED_BRACKET;
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

            templateStr += this.#buildQueryFields(Array.from(queryFields.values()), str);
        }

        return templateStr + TOKENS.CLOSED_BRACKET;
    };

    #buildQueryFields = (
        fields: Array<string> | Array<string | [string, GraphQLQueryFields]>,
        templateStr: string
    ): any => {
        if (fields.length === 0) return templateStr + TOKENS.CLOSED_BRACKET;
        const field = fields.shift() as string | Array<any>;
        if (typeof field === "string") {
            templateStr += field + TOKENS.WHITE_SPACE;
            return this.#buildQueryFields(fields, templateStr);
        } else if (field instanceof Array) {
            const nestedQuery = field.shift() + TOKENS.WHITE_SPACE + TOKENS.OPEN_BRACKET;
            const nestedQueryFields = Array.from(field[0].values()) as Array<any>;
            templateStr += nestedQuery + TOKENS.WHITE_SPACE;
            return this.#buildQueryFields(nestedQueryFields, templateStr);
        }

        return this.#buildQueryFields(fields, templateStr + TOKENS.CLOSED_BRACKET);
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
            TOKENS.OPEN_BRACKET);
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
                        [
                            "inner",
                            new Set([
                                "inner-one",
                                "inner-two",
                                "inner-three",
                                [
                                    "inner-inner",
                                    new Set(["inner-inner-one", "inner-inner-two", "inner-inner-three"]),
                                ],
                            ]),
                        ],
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

const { gqlQueryMap } = new GraphQLQueryConstructMap([input]);
// console.log(gqlQueryMap.GetAvailabilities);
