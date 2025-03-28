import PopService from './PopService'
import { PopServiceInterface } from './PopServiceInterface'
import SupervisorService from './SupervisorService'
import { SupervisorServiceInterface } from './SupervisorServiceInterface'

// can be changed to DB service or mock service
export function getPopService(): PopServiceInterface {
  return PopService
}

export function getSupervisorService(): SupervisorServiceInterface {
  return SupervisorService
}
