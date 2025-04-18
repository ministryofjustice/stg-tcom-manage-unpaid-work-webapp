export interface Placement {
  id: string
  title: string
  address: string
  nextSession: string
  slotsBooked: number
  totalSlots: number
  predictedTurnout: number
  attendees: Attendee[]
}
export interface Attendee {
  userId: string
  name: string
  attended: string
  risk: string
  riskClass: string
  status: string
  isRemoved: boolean
}

export const getPlacements = (): Placement[] => [
  {
    id: '5cdc4302-3ad3-4378-b3e3-6ae0734534hb4a1',
    title: 'Local Park Clean-up',
    address: '45 Park Road, London E2',
    nextSession: 'Today, 9am - 5pm',
    slotsBooked: 8,
    totalSlots: 20,
    predictedTurnout: 5,
    attendees: [
      {
        userId: 'P258053P',
        name: 'Joe Briggs',
        attended: '7 hours',
        risk: 'HIGH ROSH 9.0',
        riskClass: 'moj-badge--red',
        status: 'pending',
        isRemoved: false,
      },
      {
        userId: 'P258054P',
        name: 'Sarah Johnson',
        attended: '3 hours',
        risk: 'MEDIUM RSR 5.3',
        riskClass: 'moj-badge--bright-purple',
        status: 'pending',
        isRemoved: false,
      },
      {
        userId: 'P258055P',
        name: 'Michael Brown',
        attended: '15 hours',
        risk: 'LOW ROSH 2.1',
        riskClass: 'moj-badge--green',
        status: 'pending',
        isRemoved: false,
      },
      {
        userId: 'P258056P',
        name: 'Joe Bloggs',
        attended: '7 hours',
        risk: 'MEDIUM ROSH 5.1',
        riskClass: 'moj-badge--bright-purple',
        status: 'pending',
        isRemoved: false,
      },
      {
        userId: 'P258057P',
        name: 'Jane Jones',
        attended: '14 hours',
        risk: 'MEDIUM RSR 5.4',
        riskClass: 'moj-badge--bright-purple',
        status: 'pending',
        isRemoved: false,
      },
      {
        userId: 'P258063P',
        name: 'Steven Market',
        attended: '15 hours',
        risk: 'LOW ROSH 2.1',
        riskClass: 'moj-badge--green',
        status: 'pending',
        isRemoved: false,
      },
      {
        userId: 'P258028P',
        name: 'Jason Smith',
        attended: '7 hours',
        risk: 'HIGH ROSH 9.0',
        riskClass: 'moj-badge--red',
        status: 'pending',
        isRemoved: false,
      },
      {
        userId: 'P258094P',
        name: 'Wendy Reacher',
        attended: '12 hours',
        risk: 'MEDIUM RSR 5.3',
        riskClass: 'moj-badge--bright-purple',
        status: 'pending',
        isRemoved: false,
      },
    ],
  },
  {
    id: '5cdc4302-3ad3-4378-b3e3-6ae0731ab4a1',
    title: 'Community Garden Maintenance',
    address: '123 Green Lane, London SE1',
    nextSession: 'Tomorrow, 9am - 5pm',
    slotsBooked: 8,
    totalSlots: 15,
    predictedTurnout: 3,
    attendees: [
      {
        userId: 'P258053P',
        name: 'Joe Briggs',
        attended: '7 hours',
        risk: 'HIGH ROSH 9.0',
        riskClass: 'moj-badge--red',
        status: 'pending',
        isRemoved: false,
      },
      {
        userId: 'P258054P',
        name: 'Sarah Johnson',
        attended: '3 hours',
        risk: 'MEDIUM RSR 5.3',
        riskClass: 'moj-badge--bright-purple',
        status: 'pending',
        isRemoved: false,
      },
      {
        userId: 'P258055P',
        name: 'Michael Brown',
        attended: '15 hours',
        risk: 'LOW ROSH 2.1',
        riskClass: 'moj-badge--green',
        status: 'pending',
        isRemoved: false,
      },
      {
        userId: 'P258056P',
        name: 'Joe Bloggs',
        attended: '7 hours',
        risk: 'MEDIUM ROSH 5.1',
        riskClass: 'moj-badge--bright-purple',
        status: 'pending',
        isRemoved: false,
      },
      {
        userId: 'P258057P',
        name: 'Jane Jones',
        attended: '14 hours',
        risk: 'MEDIUM RSR 5.4',
        riskClass: 'moj-badge--bright-purple',
        status: 'pending',
        isRemoved: false,
      },
      {
        userId: 'P258063P',
        name: 'Steven Market',
        attended: '15 hours',
        risk: 'LOW ROSH 2.1',
        riskClass: 'moj-badge--green',
        status: 'pending',
        isRemoved: false,
      },
      {
        userId: 'P258028P',
        name: 'Jason Smith',
        attended: '7 hours',
        risk: 'HIGH ROSH 9.0',
        riskClass: 'moj-badge--red',
        status: 'pending',
        isRemoved: false,
      },
      {
        userId: 'P258094P',
        name: 'Wendy Reacher',
        attended: '12 hours',
        risk: 'MEDIUM RSR 5.3',
        riskClass: 'moj-badge--bright-purple',
        status: 'pending',
        isRemoved: false,
      },
    ],
  },
]

export default getPlacements()
