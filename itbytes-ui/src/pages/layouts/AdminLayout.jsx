import React, {useState} from 'react'
import Sidebar from '../../components/Sidebar'

function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
  return (
    <div>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
    </div>
  )
}

export default AdminLayout
