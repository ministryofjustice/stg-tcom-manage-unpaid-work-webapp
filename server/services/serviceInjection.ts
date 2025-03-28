import PopService from './PopService'
import { PopServiceInterface } from './PopServiceInterface'

//  can be changed to DB service or mock service
function getPopService(): PopServiceInterface {
  return PopService
}

export default getPopService
