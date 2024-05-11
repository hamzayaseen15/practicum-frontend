import PropTypes from 'prop-types'
import { Col, Input, Row } from 'reactstrap'

const Header = ({ handleFilter, value }) => {
  return (
    <div className="invoice-list-table-header w-100 py-2">
      <Row>
        <Col
          lg="12"
          className="actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0"
        >
          <div className="d-flex align-items-center">
            <label htmlFor="search-invoice">Search</label>
            <Input
              id="search-invoice"
              className="ms-50 me-2 w-100"
              type="text"
              value={value}
              onChange={(e) => handleFilter(e.target.value)}
              placeholder="Search..."
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

Header.propTypes = {
  handleFilter: PropTypes.func.isRequired,
  value: PropTypes.string
}

export default Header
