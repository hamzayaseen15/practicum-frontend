import moment from 'moment'
import { Button, Spinner } from 'reactstrap'
import { Link } from 'react-router-dom'
import { USER_TYPE } from '@src/constants'

// ** Table columns
export const columns = ({ handleDelete, deleting, user }) => {
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
      name: 'Description',
      sortable: true,
      sortField: 'name',
      selector: (row) => row.description
    },
    {
      name: 'Created At',
      sortable: true,
      sortField: 'created_at',
      cell: (row) => {
        return row?.created_at ? moment(row.created_at).format('DD-MM-YYYY') : 'N/A'
      }
    }
  ]

  if (user?.type === USER_TYPE.USER) {
    cols.push({
      name: 'Action',
      minWidth: '100px',
      cell: (row) => (
        <div className="column-action">
          <Button color="primary" size="sm" className="me-1" tag={Link} to={`/communities/${row._id}/chat`}>
            Chat
          </Button>
        </div>
      )
    });
  } else if ([USER_TYPE.ADMIN, USER_TYPE.SUB_ADMIN].includes(user?.type)) {
    cols.push({
      name: 'Action',
      minWidth: '210px',
      cell: (row) => (
        <div className="column-action">
          <Button color="primary" size="sm" className="me-1" tag={Link} to={`/communities/${row._id}/chat`}>
            Chat
          </Button>
          <Button color="primary" size="sm" className="me-1" tag={Link} to={`/communities/${row._id}/edit`}>
            Edit
          </Button>
          <Button type="button" color="danger" size="sm" onClick={() => handleDelete(row._id)} disabled={deleting}>
            {deleting && <Spinner size="sm" />} Delete
          </Button>
        </div>
      )
    });
  }
  
  return cols
}
