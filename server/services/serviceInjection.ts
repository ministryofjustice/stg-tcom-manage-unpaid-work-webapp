import PrototypePopService from './PrototypePopService'
import { PopService } from './PopService'

// can be changed to DB service or mock service
export default function getPopService(): PopService {
  return PrototypePopService
}
