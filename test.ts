import { GqlQueryBuilder } from ".";
import type { GraphqlQueryConstruct } from "./types";

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

const { gqlQueryMap } = new GqlQueryBuilder([input, secondInput]);
console.log(gqlQueryMap.GetAvailabilities);
console.log();
console.log(gqlQueryMap.PostAvailabilities);

// export const GET_APPOINTMENT_AVAILABILITY = `
//   query GetAvailabilities($request: AvailabilitiesInput!) {
//    availabilities(request: $request) {
//       availableDate
//       isAvailable
//       appointmentStatus
//       durationInMinutes
//       providers {
//         advisorId
//         id
//         adId
//         firstName
//         middleName
//         lastName
//         placeId
//         profileUrl
//         accountId
//       }
//     }
//   }
// `;

// const test = `
// query GetAvailabilities($request: AvailabilitiesInput!) {
//   availabilities (request: $request) {
//     availableDate
//     isAvailable
//     appointmentStatus
//     durationInMinutes
//     providers {
//       id
//       adId
//       firstName
//       middleName
//       inner {
//         inner-one
//         inner-two
//         inner-three
//         inner-inner {
//           inner-inner-one
//           inner-inner-two
//           inner-inner-three
//         }
//     }
//   }`;

// `
// query GetAvailabilities($request: AvailabilitiesInput!) {
//   availabilities(request: $request) {
//     availableDate
//     isAvailable
//     appointmentStatus
//     durationInMinutes
//     providers {
//       id
//       adId
//       firstName
//       middleName
//       inner {
//         inner-one
//         inner-two
//         inner-three
//         inner-inner {
//           inner-inner-one
//           inner-inner-two
//           inner-inner-three
//         }
//       }
//     }
//   }
// }`;
