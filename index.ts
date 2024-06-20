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

            templateStr += this.#buildQueryFields(queryFields, str);
        }
        return templateStr;
    };

    #buildQueryFields = (
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
    requestName: "GetConsultationAvailabilities",
    requestParameters: {
        arg: "request",
        argType: "ConsultationAvailabilitiesInput",
    },
    queries: [
        {
            queryName: "consultationAvailabilities",
            queryParameters: "request",
            queryFields: new Set([
                "availableDate",
                "isAvailable",
                "appointmentStatus",
                "durationInMinutes",
                [
                    "serviceProviders",
                    new Set([
                        "advisorId",
                        "attorneyId",
                        "advisorName",
                        "middleName",
                        "lastName",
                        "firmId",
                        "advisorProfileUrl",
                        "storageAccountId",
                    ]),
                ],
            ]),
        },
    ],
};

const secondInput: GraphqlQueryConstruct = {
    type: "query",
    requestName: "PostConsultationAvailabilities",
    requestParameters: {
        arg: "request",
        argType: "ConsultationAvailabilitiesInput",
    },
    queries: [
        {
            queryName: "consultationNoAvailabilities",
            queryParameters: "request",
            queryFields: new Set(["availableDate", ["advisors", new Set(["advisorId", "storageAccountId"])]]),
        },
    ],
};

const { gqlQueryMap } = new GraphQLQueryConstructMap([input, secondInput]);
console.log(gqlQueryMap.GetConsultationAvailabilities);
