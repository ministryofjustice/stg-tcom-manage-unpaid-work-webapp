const messages = [
  {
    subject: 'Missed appointment',
    date: '11 March 2024',
    id: '5cdc4302-3ad3-4378-b3e3-6ae0731ab4a1',
    status: 'unread',
    description:
      'You failed to attend your scheduled probation appointment on 10 March 2024. This is a breach of your supervision requirements. Please contact your probation practitioner as soon as possible to discuss this matter.',
    items: [
      {
        html: 'You failed to attend your scheduled probation appointment on 10 March 2024. This is a breach of your supervision requirements. Please contact your probation practitioner as soon as possible to discuss this matter.',
        type: 'received',
        timestamp: '11 March 2024',
        sender: 'Your probation practitioner',
      },
    ],
  },

  {
    subject: 'Message from your probation practitioner',
    date: '10 March 2024',
    id: 'c8ab26a7-e4d3-4f78-82a2-98fec61e79e5',
    status: 'new',
    description: 'Please contact me as soon as possible to discuss your progress.',
    items: [
      {
        html: 'Please contact me as soon as possible to discuss your progress.',
        type: 'received',
        timestamp: '10 March 2024',
        sender: 'Your probation practitioner',
      },
    ],
  },
  {
    subject: 'Documentation request from your probation practitioner',
    date: '10 March 2024',
    id: 'c8ab26a7-e4d3-4f78-82a2-98fec61e79d45',
    status: 'new',
    description: 'Please contact me as soon as possible to discuss your progress.',
    items: [
      {
        html: 'Please provide documentation for your recent employment. This is required as part of your supervision conditions.',
        type: 'received',
        timestamp: '10 March 2024',
        sender: 'Your probation practitioner',
      },
    ],
  },
]

export default messages
