/* eslint-disable implicit-arrow-linebreak */
// ** react imports
import { useState } from 'react'

import PropTypes from 'prop-types'

import { useQuery } from '@tanstack/react-query'
import Header from './Header'

// ** hooks imports
import { useSkin } from '@src/utility/hooks/useSkin'

// ** data table imports
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'

// ** reactstrap imports
import { Input } from 'reactstrap'

// ** feather icons imports
import { ChevronDown } from 'react-feather'

// ** Spinner Import
import Spinner from '@src/@core/components/spinner/Loading-spinner'

// ** Styles
import '@styles/react/apps/app-invoice.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import ErrorAlert from '../error-alert'

const Table = ({
  queryKey,
  queryFn,
  columns,
  pageSize = 10,
  page = 1,
  searchField = '',
  defaultSortField = 'created_at',
  defaultSortOrder = 'desc'
}) => {
  const { skin } = useSkin()

  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState(defaultSortField)
  const [sortOrder, setSortOrder] = useState(defaultSortOrder)
  const [currentPage, setCurrentPage] = useState(page)
  const [rowsPerPage, setRowsPerPage] = useState(pageSize)

  const dataQuery = useQuery({
    queryKey: [...queryKey, searchField, search, sortField, sortOrder, currentPage, rowsPerPage],
    queryFn: () =>
      queryFn({
        filters: { [searchField]: search },
        sort: [{ field: sortField, type: sortOrder }],
        page: currentPage,
        perPage: rowsPerPage
      })
  })

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1)
  }

  const handleSort = (column, sortDirection) => {
    if (column.sortField) {
      setSortField(column.sortField)
      setSortOrder(sortDirection)
    }
  }

  const handleFilter = (val) => {
    setSearch(val)
  }

  const CustomPagination = () => {
    const pageCount = Math.ceil(dataQuery.data.data.pagination.total / dataQuery.data.data.pagination.limit)

    return (
      <div className="d-flex align-items-center justify-content-between">
        <div className="form-group m-0 p-1" style={{ width: '10rem' }}>
          <Input
            id="page-size"
            name="select"
            type="select"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(e.target.value)}
          >
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
            <option>250</option>
            <option>500</option>
            <option>1000</option>
          </Input>
        </div>
        <ReactPaginate
          nextLabel=""
          breakLabel="..."
          previousLabel=""
          pageCount={pageCount}
          activeClassName="active"
          breakClassName="page-item"
          pageClassName={'page-item'}
          breakLinkClassName="page-link"
          nextLinkClassName={'page-link'}
          pageLinkClassName={'page-link'}
          nextClassName={'page-item next'}
          previousLinkClassName={'page-link'}
          previousClassName={'page-item prev'}
          onPageChange={(page) => handlePagination(page)}
          forcePage={currentPage !== 0 ? currentPage - 1 : 0}
          containerClassName={'pagination react-paginate justify-content-end p-1'}
        />
      </div>
    )
  }

  return (
    <>
      {dataQuery.isError && <ErrorAlert error={dataQuery.error} />}

      <DataTable
        theme={skin === 'light' ? 'default' : 'dark'}
        noHeader
        pagination
        sortServer
        paginationServer
        subHeader={true}
        columns={columns}
        responsive={true}
        onSort={handleSort}
        data={dataQuery?.data?.data?.results ?? []}
        sortIcon={<ChevronDown />}
        className="react-dataTable"
        paginationDefaultPage={currentPage}
        paginationComponent={CustomPagination}
        subHeaderComponent={
          searchField ? (
            <Header value={search} statusValue={''} rowsPerPage={rowsPerPage} handleFilter={handleFilter} />
          ) : null
        }
        progressPending={dataQuery.isLoading}
        progressComponent={<Spinner className="my-3" />}
      />
    </>
  )
}

Table.propTypes = {
  queryKey: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  queryFn: PropTypes.func.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  pageSize: PropTypes.number,
  page: PropTypes.number,
  searchField: PropTypes.string,
  defaultSortField: PropTypes.string,
  defaultSortOrder: PropTypes.string
}

export default Table
