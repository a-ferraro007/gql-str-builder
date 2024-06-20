export const GET_APPOINTMENT_AVAILABILITY = `
  query GetConsultationAvailabilities($request: ConsultationAvailabilitiesInput!) {
    consultationAvailabilities(request: $request) {
      availableDate
      isAvailable
      appointmentStatus
      durationInMinutes
      serviceProviders {
        advisorId
        attorneyId
        advisorName
        firstName
        middleName
        lastName
        firmId
        advisorProfileUrl
        storageAccountId
      }
    }
  }
`;

`consultationAvailabilities(request: $request){consultationAvailabilities(request: $request){availableDate isAvailable appointmentStatus durationInMinutes serviceProviders {advisorId attorneyId advisorName middleName lastName firmId advisorProfileUrl storageAccountId }`;
