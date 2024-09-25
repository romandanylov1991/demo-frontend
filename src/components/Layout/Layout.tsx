import React from 'react'
import MainMenu from 'components/MainMenu'

import styles from './Layout.module.scss'

type Props = {
  menuPosition?: 'horizontal' | 'inline'
}

const Layout = ({ children, menuPosition = 'horizontal' }: Props & React.PropsWithChildren) => {
  return (
    <div className={menuPosition === 'inline' ? styles.containerHorizontal : styles.containerVertical}>
      <div className={styles.menu}>
        <MainMenu mode={menuPosition} />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  )
}

export default Layout
