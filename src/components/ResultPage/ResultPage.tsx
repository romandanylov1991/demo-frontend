import { useEffect } from 'react'
import Confetti from 'react-confetti'
import { useNavigate, useLocation } from 'react-router-dom'
import { MehOutlined } from '@ant-design/icons'

import { AppRoutes } from 'app-routes'
import styles from './ResultPage.module.scss'

type Props = {
  type: 'success' | 'denied'
}

const ResultPage = ({ type }: Props) => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!location.state?.redirectedInsideApp) {
      navigate(AppRoutes.main)
    }
  }, [])

  return (
    <div className={styles.container}>
      {type === 'success' && (
        <>
          <Confetti numberOfPieces={100} gravity={0.03} />
          <h1>Success</h1>
          <p>Your application has been approved!</p>
        </>
      )}
      {type === 'denied' && (
        <>
          <h1>Denied</h1>
          <p>Your application has been denied.</p>
          <MehOutlined className={styles.deniedIcon} />
        </>
      )}
    </div>
  )
}

export default ResultPage
