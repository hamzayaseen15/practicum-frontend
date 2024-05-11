import Avatar from '@components/avatar'
import moment from 'moment'
import { Button, Spinner } from 'reactstrap'
import { Link } from 'react-router-dom'
import { getUserTypeLabel } from '@src/helpers'

// ** renders client column
const renderTitleIcon = (row) => {
  const stateNum = Math.floor(Math.random() * 6),
    states = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-primary', 'light-secondary'],
    color = states[stateNum]

  return <Avatar color={color} className="me-50" content={row.name ?? 'Not Available'} initials />
}

// ** Table columns
export const columns = ({ handleDelete, deleting, user }) => [
  {
    name: 'ID',
    sortable: true,
    sortField: '_id',
    width: '80px',
    selector: (row) => row._id
  },
  {
    name: 'Name',
    // minWidth: '350px',
    sortable: true,
    sortField: 'name',
    selector: (row) => row.name,
    cell: (row) => {
      return (
        <div className="d-flex justify-content-left align-items-center">
          {renderTitleIcon(row)}
          <div className="d-flex flex-column">
            <h6 className="user-name text-truncate mb-0">{row.name}</h6>
          </div>
        </div>
      )
    }
  },
  {
    name: 'Email',
    minWidth: '164px',
    sortable: true,
    sortField: 'email',
    selector: (row) => row.email
  },
  {
    name: 'Type',
    maxWidth: '50px',
    sortable: true,
    sortField: 'type',
    selector: (row) => getUserTypeLabel(row.type)
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
        <Button color="primary" size="sm" className="m-1" tag={Link} to={`/users/${row._id}/edit`}>
          Edit
        </Button>
        {user._id !== row._id && (
          <Button type="button" color="danger" size="sm" onClick={() => handleDelete(row._id)} disabled={deleting}>
            {deleting && <Spinner size="sm" />} Delete
          </Button>
        )}
      </div>
    )
  }
]
