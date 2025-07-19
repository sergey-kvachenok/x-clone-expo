export type MessageType = {
  id: number
  text: string
  fromUser: boolean // true if message is from current user, false if from other user
  timestamp: Date
  time: string
}

export type ConversationType = {
  id: number
  user: {
    name: string
    username: string
    avatar: string
    verified: boolean
  }
  lastMessage: string
  time: string
  timestamp: Date
  messages: MessageType[]
}

export const CONVERSATIONS: ConversationType[] = [
  {
    id: 1,
    user: {
      name: 'James Doe',
      username: 'jamesdoe',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      verified: false,
    },
    lastMessage: 'Thanks for sharing that article! Really helpful insights.',
    time: '2h',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    messages: [
      {
        id: 1,
        text: 'Hey! Did you see that new article about React Native performance?',
        fromUser: false,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        time: '4h',
      },
      {
        id: 2,
        text: "No, I haven't! Could you share the link?",
        fromUser: true,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        time: '4h',
      },
      {
        id: 3,
        text: 'Thanks for sharing that article! Really helpful insights.',
        fromUser: true,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        time: '2h',
      },
      {
        id: 4,
        text: "Sure! Here's the link: https://reactnative.dev/blog/2023/01/12/optimizing-performance",
        fromUser: false,
        timestamp: new Date(Date.now() - 110 * 60 * 1000),
        time: '1h',
      },
      {
        id: 5,
        text: 'Wow, the part about bundle size optimization is amazing!',
        fromUser: true,
        timestamp: new Date(Date.now() - 100 * 60 * 1000),
        time: '1h',
      },
      {
        id: 6,
        text: 'I know right! Have you tried implementing any of those techniques?',
        fromUser: false,
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        time: '1h',
      },
      {
        id: 7,
        text: 'Yes! I implemented lazy loading and saw 30% improvement',
        fromUser: true,
        timestamp: new Date(Date.now() - 80 * 60 * 1000),
        time: '1h',
      },
      {
        id: 8,
        text: "That's incredible! Which components did you lazy load?",
        fromUser: false,
        timestamp: new Date(Date.now() - 70 * 60 * 1000),
        time: '1h',
      },
      {
        id: 9,
        text: 'Mostly heavy screens like Settings and Profile. Used React.lazy()',
        fromUser: true,
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        time: '1h',
      },
      {
        id: 10,
        text: 'Smart approach! Did you face any issues with navigation?',
        fromUser: false,
        timestamp: new Date(Date.now() - 50 * 60 * 1000),
        time: '50m',
      },
      {
        id: 11,
        text: 'Initially yes, but React Navigation handles it well with Suspense',
        fromUser: true,
        timestamp: new Date(Date.now() - 40 * 60 * 1000),
        time: '40m',
      },
      {
        id: 12,
        text: "I should try that! Any other performance tips you'd recommend?",
        fromUser: false,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        time: '30m',
      },
      {
        id: 13,
        text: 'FlashList instead of FlatList is a game changer for large lists!',
        fromUser: true,
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        time: '20m',
      },
    ],
  },
  {
    id: 2,
    user: {
      name: 'Coffee Lover',
      username: 'coffeelover',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      verified: false,
    },
    lastMessage: "See you at the meetup tomorrow! Don't forget to bring your laptop.",
    time: '2d',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: 1,
        text: 'Are you planning to attend the React meetup this weekend?',
        fromUser: false,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        time: '3d',
      },
      {
        id: 2,
        text: "Yes! I've been looking forward to it. Should be great networking.",
        fromUser: true,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        time: '3d',
      },
      {
        id: 3,
        text: "See you at the meetup tomorrow! Don't forget to bring your laptop.",
        fromUser: false,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        time: '2d',
      },
    ],
  },
  {
    id: 3,
    user: {
      name: 'Alex Johnson',
      username: 'alexj',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      verified: false,
    },
    lastMessage: 'Great collaboration on the project. The demo was impressive!',
    time: '3d',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: 1,
        text: "How's the progress on the mobile app project?",
        fromUser: false,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        time: '4d',
      },
      {
        id: 2,
        text: 'Going really well! Just finished the authentication flow. Want to see a demo?',
        fromUser: true,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        time: '4d',
      },
      {
        id: 3,
        text: 'Great collaboration on the project. The demo was impressive!',
        fromUser: false,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        time: '3d',
      },
    ],
  },
  {
    id: 4,
    user: {
      name: 'Design Studio',
      username: 'designstudio',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      verified: true,
    },
    lastMessage: 'The new designs look fantastic. When can we schedule a review?',
    time: '1w',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: 1,
        text: "We've finished the initial mockups for your app. They're ready for review!",
        fromUser: false,
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        time: '1w',
      },
      {
        id: 2,
        text: "Awesome! Can't wait to see them. The timeline works perfectly.",
        fromUser: true,
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        time: '1w',
      },
      {
        id: 3,
        text: 'The new designs look fantastic. When can we schedule a review?',
        fromUser: false,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        time: '1w',
      },
    ],
  },
]
