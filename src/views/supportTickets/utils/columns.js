import moment from 'moment'
import { Badge, Button, Spinner } from 'reactstrap'
import { Link } from 'react-router-dom'
import { SUPPORT_TICKET_PRIORITY, SUPPORT_TICKET_STATUS } from '@src/constants'
import { getSupportTicketPriorityLabel, getSupportTicketStatusLabel } from '@src/helpers'

// ** Table columns
export const columns = ({ handleDelete, deleting }) => {
  const cols = [
    {
      name: 'ID',
      sortable: true,
      sortField: '_id',
      width: '80px',
      selector: (row) => row._id
    },
    {
      name: 'Name',
      sortable: true,
      sortField: 'name',
      selector: (row) => row.name
    },
    {
      name: 'Status',
      sortable: true,
      sortField: 'status',
      selector: (row) => (
        <Badge color={row.status === SUPPORT_TICKET_STATUS.PENDING ? 'primary' : 'success'}>
          {getSupportTicketStatusLabel(row.status)}
        </Badge>
      )
    },
    {
      name: 'Priority',
      sortable: true,
      sortField: 'priority',
      selector: (row) => (
        <Badge color={row.priority === SUPPORT_TICKET_PRIORITY.NORMAL ? 'success' : 'danger'}>
          {getSupportTicketPriorityLabel(row.priority)}
        </Badge>
      )
    },
    {
      name: 'Created By',
      selector: (row) => row.created_by.name
    },
    {
      name: 'Created At',
      sortable: true,
      sortField: 'created_at',
      cell: (row) => {
        return row?.created_at ? moment(row.created_at).format('DD-MM-YYYY') : 'N/A'
      }
    },
    {
      name: 'Action',
      minWidth: '210px',
      cell: (row) => (
        <div className="column-action">
          <Button color="primary" size="sm" className="m-1" tag={Link} to={`/support-tickets/${row._id}/edit`}>
            Edit
          </Button>
          <Button type="button" color="danger" size="sm" onClick={() => handleDelete(row._id)} disabled={deleting}>
            {deleting && <Spinner size="sm" />} Delete
          </Button>
        </div>
      )
    }
  ]
  return cols
}
