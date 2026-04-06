import api from "./api-client";

const kybLiveService = {
  verifyCompany: (registrationNumber: string) =>
    api.post("/v1/dispro/kyb/live/verify-company", { registrationNumber }),

  checkAnnualReturn: (registrationNumber: string) =>
    api.get(`/v1/dispro/kyb/live/annual-return/${registrationNumber}`),

  triggerAnnualRefresh: (registrationNumber: string) =>
    api.post("/v1/dispro/kyb/live/annual-refresh", { registrationNumber }),

  screenIndividual: (name: string, nationality?: string, idNumber?: string) =>
    api.post("/v1/dispro/kyb/live/screen", { name, nationality, idNumber }),

  screenDirectors: (directors: { name: string; nationality?: string; idNumber?: string }[]) =>
    api.post("/v1/dispro/kyb/live/screen-directors", directors),

  getSanctionsStats: () =>
    api.get("/v1/dispro/kyb/live/sanctions-stats"),
};

export default kybLiveService;
