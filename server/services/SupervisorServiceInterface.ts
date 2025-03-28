import { Request } from 'express'
import { Placement } from '../routes/data/supervisor-placements'

export interface SupervisorServiceInterface {
  findPlacement(req: Request, placementId: string): Placement | null
}
