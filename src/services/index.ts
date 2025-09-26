// Re-export all services from api.ts
export {
  default as api,
  authAPI,
  leadsAPI,
  clientsAPI,
  teamsAPI,
  dashboardAPI,
  usersAPI,
  apiUtils,
} from "./api";

// Default export for backward compatibility
export { default } from "./api";
