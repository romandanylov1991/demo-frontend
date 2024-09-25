import React, { useEffect } from 'react'
import alloySDK from '@alloyidentity/web-sdk'
import { Button, Typography } from 'antd'
import { Status } from 'types'

import { settings } from 'config/settings'
import styles from './Alloy.module.scss'

const { alloy } = settings

type CallbackData = {
  journey_application_token: string
  journey_application_status: string
  sdk: {
    sdkEvent: string
  }
}

export type CallbackDataResult = {
  journeyApplicationToken: string
  journeyApplicationStatus: Status
  event: string
}

type Props = {
  journeyApplicationToken: string
  journeyToken: string
  callback: (data: CallbackDataResult) => void
}

const Alloy = (props: Props) => {
  useEffect(() => {
    void alloySDK.init({
      key: alloy.sdkKey,
      journeyApplicationToken: props.journeyApplicationToken,
      journeyToken: props.journeyToken,
      apiUrl: alloy.sdkApiUrl,
      appUrl: alloy.sdkAppUrl,
      customerSlug: alloy.customerSlug,
      production: false
    })
    return () => {
      alloySDK.close()
    }
  }, [])

  const alloyCallback = (data: CallbackData) => {
    props.callback({
      journeyApplicationToken: data.journey_application_token,
      journeyApplicationStatus: data.journey_application_status.toLowerCase() as Status,
      event: data.sdk.sdkEvent
    })
  }

  const onOpen = async () => {
    alloySDK.open(alloyCallback, 'alloy-component')
  }

  return (
    <div className={styles.container}>
      <Typography.Title>Help us verify your identity</Typography.Title>
      <Typography.Text>
        You will be asked to go through a process to verify your identity. This process helps us ensure that we are meeting the compliance standards and provide the best experience
        tailored to you.
      </Typography.Text>
      <Button type="primary" onClick={onOpen}>
        I'm ready
      </Button>
    </div>
  )
}

export default Alloy
