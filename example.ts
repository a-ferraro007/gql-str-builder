import { GqlQueryBuilder, type GraphqlQueryConstruct } from ".";

const query: GraphqlQueryConstruct = {
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

const queryTwo: GraphqlQueryConstruct = {
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

const { gqlQueryMap } = new GqlQueryBuilder([query, queryTwo]);
console.log(gqlQueryMap);
