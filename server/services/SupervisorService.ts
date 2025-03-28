import { Request } from 'express'
import { SupervisorServiceInterface } from './SupervisorServiceInterface'
import { Placement } from '../routes/data/supervisor-placements'

const SupervisorService: SupervisorServiceInterface = {
  findPlacement(req: Request, placementId: string): Placement | null {
    const placements: Placement[] = req.session.placements || []
    return placements.find((p: Placement) => p.id === placementId) || null
  },
}

export default SupervisorService
