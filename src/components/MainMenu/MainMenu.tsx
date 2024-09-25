import { CSSProperties } from 'react'
import { Menu, MenuProps } from 'antd'
import { useLocation, Link } from 'react-router-dom'
import { CheckOutlined } from '@ant-design/icons'

import styles from './MainMenu.module.scss'

import { AppRoutes } from 'app-routes'

type MenuItem = Required<MenuProps>['items'][number]

const getItem = (label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem => {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem
}

const iconStyleDark = { fontSize: 20, color: 'rgba(255, 255, 255, 0.85)' }
const iconStyleLight = { fontSize: 20, color: 'rgba(21,21,21,0.85)' }

const items = (iconStyle: CSSProperties): MenuItem[] => [getItem(<Link to={AppRoutes.apply}>Apply</Link>, AppRoutes.apply, <CheckOutlined style={iconStyle} />)]

type Props = {
  mode: 'horizontal' | 'inline'
}

const MainMenu = ({ mode }: Props) => {
  const location = useLocation()

  const menuItems = items(mode === 'horizontal' ? iconStyleLight : iconStyleDark)

  return (
    <Menu
      className={mode === 'horizontal' ? styles.container : styles.containerInline}
      selectedKeys={[location.pathname]}
      mode={mode}
      theme={mode === 'horizontal' ? 'light' : 'dark'}
      items={menuItems}
    />
  )
}

export default MainMenu
