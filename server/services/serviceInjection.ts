import PopService from './PopService'
import { PopServiceInterface } from './PopServiceInterface'

// can be changed to DB service or mock service
export default function getPopService(): PopServiceInterface {
  return PopService
}
