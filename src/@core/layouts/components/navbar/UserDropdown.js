// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { Settings, Power } from 'react-feather'

// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'
import useJwt from '@src/@core/auth/jwt/useJwt'
import { getUserTypeLabel } from '@src/helpers'
import { useMemo } from 'react'

const UserDropdown = () => {
  const { jwt } = useJwt()
  const user = jwt.getUser()

  const colorMemo = useMemo(() => {
    const stateNum = Math.floor(Math.random() * 6),
      states = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-primary', 'light-secondary'],
      color = states[stateNum]
    return color
  }, [user?.name])

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle href="/" tag="a" className="nav-link dropdown-user-link" onClick={(e) => e.preventDefault()}>
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name fw-bold">{user?.name}</span>
          <span className="user-status">{user?.type ? getUserTypeLabel(user.type) : user?.email}</span>
        </div>
        {user?.photo && <Avatar img={defaultAvatar} imgHeight="40" imgWidth="40" status="online" />}
        {!user?.photo && (
          <Avatar
            color={colorMemo}
            imgHeight="40"
            imgWidth="40"
            status="online"
            content={user?.name ?? 'Not Available'}
            initials
          />
        )}
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to="/settings">
          <Settings size={14} className="me-75" />
          <span className="align-middle">Settings</span>
        </DropdownItem>
        <DropdownItem className="w-100" onClick={() => jwt.logout()}>
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
