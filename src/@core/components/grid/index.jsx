import { useSkin } from '@src/utility/hooks/useSkin'
import { useQuery } from '@tanstack/react-query'
import { AgGridReact } from 'ag-grid-react'
import PropTypes from 'prop-types'
import ComponentSpinner from '../spinner/Loading-spinner'
import { getResponseErrorMessage } from '@src/helpers'

const Grid = ({ columns, queryFn, queryKey }) => {
  const { skin } = useSkin()

  const dataQuery = useQuery({
    queryKey,
    queryFn
  })

  if (dataQuery.isLoading) {
    return (
      <div>
        <ComponentSpinner />
      </div>
    )
  }

  if (dataQuery.isError) {
    return (
      <div className="alert alert-danger" role="alert ">
        {getResponseErrorMessage(dataQuery.error)}
      </div>
    )
  }

  return (
    <div className={`ag-theme-quartz${skin === 'dark' ? '-dark' : ''}`} style={{ minHeight: 100 }}>
      <AgGridReact
        rowData={dataQuery.data.data}
        columnDefs={columns}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50, 100, 250, 500, 1000]}
      />
    </div>
  )
}

Grid.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  queryFn: PropTypes.func.isRequired,
  queryKey: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
}

export default Grid
