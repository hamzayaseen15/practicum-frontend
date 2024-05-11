import useJwt from '@src/@core/auth/jwt/useJwt'
import { USER_TYPE } from '@src/constants'
import { Clock, File, HardDrive, Home, MessageSquare, User, Users } from 'react-feather'

// eslint-disable-next-line react-hooks/rules-of-hooks
const { jwt } = useJwt()
export default () => [
  {
    id: 'home',
    title: 'Home',
    icon: <Home size={20} />,
    navLink: '/home'
  },
  {
    id: 'users',
    title: 'Users',
    icon: <User size={20} />,
    navLink: '/users',
    hide: jwt.getUser()?.type !== USER_TYPE.ADMIN
  },
  {
    id: 'events',
    title: 'Events',
    icon: <Clock size={20} />,
    navLink: '/events'
  },
  {
    id: 'communities',
    title: 'Communities',
    icon: <Users size={20} />,
    navLink: '/communities',
    hide: ![USER_TYPE.ADMIN, USER_TYPE.SUB_ADMIN, USER_TYPE.USER].includes(jwt.getUser()?.type)
  },
  {
    id: 'resources',
    title: 'Resources',
    icon: <File size={20} />,
    navLink: '/resources'
  },
  {
    id: 'support-tickets',
    title: 'Incident Reports',
    icon: <HardDrive size={20} />,
    navLink: '/support-tickets'
  },
  // {
  //   id: 'community-chat',
  //   title: 'Community Chat',
  //   icon: <MessageSquare size={20} />,
  //   navLink: `/communities/${jwt.getUser()?.community}/chat`,
  //   hide: jwt.getUser()?.type !== USER_TYPE.USER && !jwt.getUser()?.community
  // }
]
