import { useState, useEffect } from 'react'
import { Button, Form, Divider, Input, InputNumber, Select } from 'antd'
import { UndoOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { faker } from '@faker-js/faker'
import { toast } from 'react-toastify'

import { AppRoutes } from 'app-routes'
import { default as Alloy, CallbackDataResult } from 'components/Alloy/Alloy'
import styles from './CreateApplication.module.scss'
import { stateOptions } from './stateOptions'
import { useCreateApplicationMutation } from '../../applications-api'

type FormValues = {
  firstName: string
  lastName: string
  email: string
  birthDate: string
  ssn: string
  phoneNumber: string
  income: string
  address1: string
  address2: string
  city: string
  state: string
  zipCode: string
}

const CreateApplication = () => {
  const [journeyApplicationToken, setJourneyApplicationToken] = useState<string>()
  const [journeyToken, setJourneyToken] = useState<string>()

  const [form] = Form.useForm<FormValues>()
  const navigate = useNavigate()

  const [createApplication, { isLoading }] = useCreateApplicationMutation()

  useEffect(() => {
    const journeyApplicationToken = localStorage.getItem('journeyApplicationToken')
    const journeyToken = localStorage.getItem('journeyToken')

    if (journeyApplicationToken && journeyToken) {
      setJourneyApplicationToken(journeyApplicationToken)
      setJourneyToken(journeyToken)
    }
  }, [])

  const generateFakeData = (type: 'success' | 'denied' | 'any' = 'any') => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    const isSuccess = type === 'success'
    const isDenied = type === 'denied'

    form.setFieldsValue({
      firstName,
      lastName,
      email: faker.internet.email({ firstName: firstName.toLowerCase(), lastName: lastName.toLowerCase() }),
      birthDate: '1987-06-05',
      ssn: isSuccess ? faker.helpers.fromRegExp(/[0-9]{9}/) : '111111111',
      phoneNumber: faker.helpers.fromRegExp(/555-555-[0-9]{4}/),
      income: '72000',
      address1: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: isSuccess ? '99998' : isDenied ? '99999' : faker.location.zipCode()
    })
  }

  const alloyCallback = (data: CallbackDataResult) => {
    if (data.journeyApplicationStatus === 'approved') {
      cleanSavedData()
      navigate(AppRoutes.success, { state: { redirectedInsideApp: true } })
      return
    }

    if (data.journeyApplicationStatus === 'denied') {
      cleanSavedData()
      navigate(AppRoutes.denied, { state: { redirectedInsideApp: true } })
      return
    }
  }

  const onFinishHandler = async (values: FormValues) => {
    await createApplication({
      phoneNumber: values.phoneNumber,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      birthDate: values.birthDate,
      ssn: values.ssn,
      income: values.income,
      addresses: [
        {
          zipCode: values.zipCode,
          type: 'primary',
          country: 'US',
          state: values.state,
          city: values.city,
          address1: values.address1,
          address2: values.address2
        }
      ]
    })
      .unwrap()
      .then((result) => {
        toast.success('Application created successfully!')
        form.resetFields()

        if (result.journeyApplicationStatus === 'pending') {
          setJourneyApplicationToken(result.journeyApplicationToken)
          setJourneyToken(result.journeyToken)
          localStorage.setItem('journeyApplicationToken', result.journeyApplicationToken)
          localStorage.setItem('journeyToken', result.journeyToken)

          return
        }

        if (result.journeyApplicationStatus === 'approved') {
          navigate(AppRoutes.success, { state: { redirectedInsideApp: true } })
          return
        }

        if (result.journeyApplicationStatus === 'denied') {
          navigate(AppRoutes.denied, { state: { redirectedInsideApp: true } })
          return
        }
      })
      .catch((error: any) => toast.error(error.data.message.join('\n')))
  }

  const onFinishFailed = (errorInfo: any) => {
    toast.error(errorInfo?.errorFields?.map((errField: any) => errField.errors.join('\n')).join('\n'))
  }

  const cleanSavedData = () => {
    localStorage.removeItem('journeyApplicationToken')
    localStorage.removeItem('journeyToken')
    setJourneyApplicationToken(undefined)
    setJourneyToken(undefined)
    form.resetFields()
  }

  return (
    <div className={styles.container}>
      <Button type="link" onClick={() => cleanSavedData()}>
        <UndoOutlined /> Reset
      </Button>
      <Divider />
      {journeyApplicationToken && journeyToken && <Alloy journeyApplicationToken={journeyApplicationToken} journeyToken={journeyToken} callback={alloyCallback} />}
      {(!journeyApplicationToken || !journeyToken) && (
        <>
          <div className={styles.header}>
            <Button type="dashed" onClick={() => generateFakeData()}>
              Generate User
            </Button>
            <Button type="primary" onClick={() => generateFakeData('success')}>
              Generate User (Success)
            </Button>
            <Button type="primary" danger onClick={() => generateFakeData('denied')}>
              Generate User (Denied)
            </Button>
          </div>
          <Form
            name="sendApplication"
            layout="vertical"
            form={form}
            style={{ width: '100%', marginTop: '20px' }}
            onFinish={onFinishHandler}
            onFinishFailed={onFinishFailed}
            disabled={isLoading}
          >
            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Fill in this field!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Fill in this field!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Fill in this field!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Birth Date" name="birthDate" rules={[{ required: true, message: 'Fill in this field!' }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="SSN"
              name="ssn"
              rules={[
                { required: true, message: 'Fill in this field!' },
                () => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error('Fill in this field!'))
                    }
                    const stringValue = value.toString()
                    if (stringValue.length !== 9 || !/^\d{9}$/.test(stringValue)) {
                      return Promise.reject(new Error('Income must be 9 digits!'))
                    }
                    return Promise.resolve()
                  }
                })
              ]}
            >
              <Input maxLength={9} />
            </Form.Item>
            <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true, message: 'Fill in this field!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Income" name="income" rules={[{ required: true, message: 'Fill in this field!' }]}>
              <InputNumber />
            </Form.Item>
            <Form.Item label="Address 1" name="address1" rules={[{ required: true, message: 'Fill in this field!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Address 2" name="address2">
              <Input />
            </Form.Item>
            <Form.Item label="City" name="city" rules={[{ required: true, message: 'Fill in this field!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="State" name="state" rules={[{ required: true, message: 'Fill in this field!' }]}>
              <Select options={stateOptions} placeholder="Select state" showSearch optionFilterProp="label" />
            </Form.Item>
            <Form.Item label="Zip Code" name="zipCode" rules={[{ required: true, message: 'Fill in this field!' }]}>
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Send
            </Button>
          </Form>
        </>
      )}
    </div>
  )
}

export default CreateApplication
