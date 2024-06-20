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
