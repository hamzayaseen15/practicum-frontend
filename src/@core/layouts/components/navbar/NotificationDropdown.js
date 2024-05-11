// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Bell } from 'react-feather'

// ** Reactstrap Imports
import { Badge, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown, Spinner } from 'reactstrap'
import { useQuery } from '@tanstack/react-query'
import { getUserNotification, updateUserNotification} from '@src/apis'
import ErrorAlert from '@src/@core/components/error-alert'
import { NOTIFICATION_STATUS } from '@src/constants'
import { Link } from 'react-router-dom'
import { getNotificationLink } from '@src/helpers'
import { Button } from 'reactstrap';
import { useMutation} from '@tanstack/react-query'


const NotificationDropdown = () => {
  const mutation = useMutation({ mutationFn: updateUserNotification });

  const notificationQuery = useQuery({
    queryKey: ['user-notifications'],
    queryFn: getUserNotification,
    refetchInterval: 5000
  })

  // Function to handle the "Read all notifications" button click
  const handleReadAllNotificationsClick = async () => {
    try {
      await mutation.mutateAsync(); // Call the mutation function to mark all notifications as read
      notificationQuery.refetch(); // Refetch notifications to update the count
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // ** Function to render Notifications
  /*eslint-disable */
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component="li"
        className="media-list scrollable-container"
        options={{
          wheelPropagation: false
        }}
      >
        {notificationQuery.isPending && (
          <div className="list-item d-flex align-items-center">
            <div className="list-item-body flex-grow-1">
              <Spinner color="primary" />
            </div>
          </div>
        )}
        {notificationQuery.data?.data?.length < 1 && (
          <a
            className="d-flex"
            href="#"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            <div className="list-item d-flex align-items-center">
              <div className="list-item-body flex-grow-1">No notification</div>
            </div>
          </a>
        )}
        {notificationQuery.isError && <ErrorAlert error={notificationQuery.error} />}

        {notificationQuery.data?.data?.map((item, index) => {
          const link = getNotificationLink(item);
          const titleColor = item.title === 'New Message' ? 'text-primary' : item.title === 'New Support Ticket' ? 'text-danger' : '';

          return (
            <Link
              key={index}
              className="d-flex"
              to={link}
              onClick={(e) => {
                if (link === '#') e.preventDefault();
              }}
            >
              <div className="list-item d-flex align-items-start">
                <div className={titleColor}>
                  {item.title} <br></br>
                  <small className="text-primary notification-text">{item.message}</small>
                </div>
              </div>
            </Link>
          );
        })}
      </PerfectScrollbar>
    )
  }
  /*eslint-enable */

  return (
    <UncontrolledDropdown tag="li" className="dropdown-notification nav-item me-25">
      <DropdownToggle tag="a" className="nav-link" href="/" onClick={(e) => e.preventDefault()}>
        <Bell size={21} />
        {!!notificationQuery.data?.data?.filter(
           (notification) => notification.status === NOTIFICATION_STATUS.UNREAD
            )?.length > 0 && (
        <Badge pill color="danger" className="badge-up">
          {notificationQuery.data?.data?.filter(
             (notification) => notification.status === NOTIFICATION_STATUS.UNREAD
             )?.length}
        </Badge>
          )}
      </DropdownToggle>
      <DropdownMenu end tag="ul" className="dropdown-menu-media mt-0">
        <li className="dropdown-menu-header">
          <DropdownItem className="d-flex" tag="div" header>
            <h4 className="notification-title mb-0 me-auto">Notifications</h4>
            <Badge tag="div" color="light-primary" pill>
              {
                notificationQuery.data?.data?.filter(
                  (notification) => notification.status === NOTIFICATION_STATUS.UNREAD
                )?.length
              }
            </Badge>
          </DropdownItem>
        </li>
        {renderNotificationItems()}
        {!!notificationQuery.data?.data?.length && (
          <li className="dropdown-menu-footer">
            <Button color="primary" block onClick={handleReadAllNotificationsClick}>
              Mark All Notifications As Read
            </Button>
          </li>
        )}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
