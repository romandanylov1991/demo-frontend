import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { settings } from 'config/settings'
import { Status } from 'types'

const { host } = settings.backend

type CreateApplicationArgs = {
  phoneNumber: string
  firstName: string
  lastName: string
  email: string
  birthDate: string
  ssn: string
  income: string
  addresses: {
    zipCode: string
    type: string
    country: string
    state: string
    city: string
    address1: string
    address2?: string
  }[]
}

type CreateApplicationResult = {
  status: string
  journeyApplicationStatus: Status
  journeyApplicationToken: string
  journeyToken: string
}

export const applicationsApi = createApi({
  reducerPath: 'applicationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: host
  }),
  tagTypes: ['Applications'],
  endpoints: (builder) => ({
    application: builder.query<string, string>({
      query: (applicationId: string) => ({
        url: `applications/${applicationId}`,
        method: 'GET'
      }),
      providesTags: (result) => [{ type: 'Applications', id: result }]
    }),
    createApplication: builder.mutation<CreateApplicationResult, CreateApplicationArgs>({
      query: (body) => ({
        url: `/applications`,
        method: 'POST',
        body
      })
    })
  })
})

export const { useCreateApplicationMutation } = applicationsApi
