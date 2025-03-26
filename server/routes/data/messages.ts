const messages = [
  {
    subject: 'Missed appointment on 10 March 2025',
    date: '11 March 2025',
    id: '5cdc4302-3ad3-4378-b3e3-6ae0731ab4a1',
    status: 'unread',
    description:
      'You failed to attend your scheduled probation appointment on 10 March 2025. You have until 15 March 2025 to respond to this notice and explain why you missed this appointment. If you fail to do that, this might count as a breach of your supervision requirement and enforcement action might be taken.',
    items: [
      {
        html: 'You failed to attend your scheduled probation appointment on 10 March 2025. You have until 15 March 2025 to respond to this notice and explain why you missed this appointment. If you fail to do that, this might count as a breach of your supervision requirement and enforcement action might be taken.',
        type: 'received',
        timestamp: '11 March 2025',
        sender: 'Your probation practitioner',
      },
    ],
  },

  {
    subject: 'Plumbing job',
    date: '10 March 2025',
    id: 'c8ab26a7-e4d3-4f78-82a2-98fec61e79e5',
    status: 'new',
    description: `Here's a link to the job I told you about in our session today: https://www.jobs.gov.uk/plumbing-opportunity-12345 Let me know if you need help with applying for it`,
    items: [
      {
        html: `Here's a link to the job I told you about in our session today: https://www.jobs.gov.uk/plumbing-opportunity-12345 Let me know if you need help with applying for it`,
        type: 'received',
        timestamp: '10 March 2025',
        sender: 'Your probation practitioner',
      },
    ],
  },
  {
    subject: 'Documentation request from your probation practitioner',
    date: '10 March 2025',
    id: 'c8ab26a7-e4d3-4f78-82a2-98fec61e79d45',
    status: 'new',
    description:
      'Please provide documentation for your recent employment. This could be your employment contract or a letter from your employer. This is required as part of your order conditions',
    items: [
      {
        html: 'Please provide documentation for your recent employment. This could be your employment contract or a letter from your employer. This is required as part of your order conditions',
        type: 'received',
        timestamp: '10 March 2025',
        sender: 'Your probation practitioner',
      },
    ],
  },
]

export default messages
