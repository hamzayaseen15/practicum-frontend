// ** React Imports
import { Outlet } from 'react-router-dom'

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/HorizontalLayout'

// ** Menu Items Array
import getNavigation from '@src/navigation/horizontal'

const HorizontalLayout = (props) => {
  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])

  return (
    <Layout getMenuData={getNavigation} {...props}>
      <Outlet />
    </Layout>
  )
}

export default HorizontalLayout
