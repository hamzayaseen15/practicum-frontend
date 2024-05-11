import { Button, Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import { deleteSupportTicket, getSupportTickets } from '@src/apis'
import Swal from 'sweetalert2'
import Table from '@src/@core/components/table'
import { columns } from './utils/columns'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getResponseErrorMessage } from '@src/helpers'
import toast from 'react-hot-toast'

const List = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteSupportTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(['support-tickets'])
    },
    onError: (err) => {
      const message = getResponseErrorMessage(err, 'Something went wrong')
      toast.error(message)
    }
  })

  const handleDelete = (id) => {
    mutation.mutate(id)
  }

  const onDeleteClick = (id) => {
    Swal.fire({
      title: 'Delete Support Ticket',
      text: 'Are you sure you want to delete this support ticket?',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonText: 'No',
      showCloseButton: true
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        handleDelete(id)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SupportTickets</CardTitle>
        <Button color="primary" tag={Link} to="/support-tickets/create">
          Add
        </Button>
      </CardHeader>
      <CardBody>
        <div className="invoice-list-dataTable react-dataTable">
          <Table
            queryKey={['support-tickets']}
            queryFn={getSupportTickets}
            columns={columns({
              handleDelete: onDeleteClick,
              deleting: mutation.isPending
            })}
          />
        </div>
      </CardBody>
    </Card>
  )
}

export default List
