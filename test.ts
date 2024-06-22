export const GET_APPOINTMENT_AVAILABILITY = `
  query GetAvailabilities($request: AvailabilitiesInput!) {
   availabilities(request: $request) {
      availableDate
      isAvailable
      appointmentStatus
      durationInMinutes
      providers {
        advisorId
        id
        adId
        firstName
        middleName
        lastName
        placeId
        profileUrl
        accountId
      }
    }
  }
`;

const test = `
query GetAvailabilities($request: AvailabilitiesInput!) {
  availabilities (request: $request) {
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
  }`;

`
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
    }
  }
}`;
