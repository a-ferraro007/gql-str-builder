# GraphQL Query Builder

A utility to construct GraphQL query template strings from predefined structures

## Usage

### Create the Query Builder Instance

Create an instance of the `GqlQueryBuilder` with the defined query constructs:

```javascript
const { gqlQueryMap } = new GqlQueryBuilder([input]);
gqlQueryMap.GetAvailabilities // Record<requestName, gqlTemplateStr> 
```


### Example GQL Query Structure 

GraphQL query constructs are defined by specifying the query type, request name, request parameters, and the request queries & their fields.
Query fields are defined with a Set of strings and can be nested with no max depth (as of now) using an [string, Set<string>].  

```javascript
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
```
### Example Output w/ prettier printing

```graphql
query GetAvailabilities($request: AvailabilitiesInput!) {
  availabilities(request: $request) {
    availableDate
    isAvailable
    appointmentStatus
    durationInMinutes
    providers {
      id
      adId
      firstName
      middleName
      inner {
        inner-one
        inner-two
        inner-three
        inner-inner {
          inner-inner-one
          inner-inner-two
          inner-inner-three
        }
      }
      lastName
      placeId
      profileUrl
      accountId
    }
  }
}
```
