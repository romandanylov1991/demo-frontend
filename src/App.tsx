import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { Layout } from 'components'
import { AppRoutes } from './app-routes'

const ApplicationsList = lazy(() => import('features/applications/pages/ApplicationsList'))
const CreateApplication = lazy(() => import('features/applications/pages/CreateApplication'))
const ResultPage = lazy(() => import('components/ResultPage'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingOutlined />}>
        <Routes>
          <Route path={AppRoutes.main} element={<Layout>Hi there</Layout>} />
          <Route
            path={AppRoutes.admin}
            element={
              <Layout menuPosition="inline">
                <ApplicationsList />
              </Layout>
            }
          />
          <Route
            path={AppRoutes.applications}
            element={
              <Layout menuPosition="inline">
                <ApplicationsList />
              </Layout>
            }
          />
          <Route
            path={AppRoutes.apply}
            element={
              <Layout>
                <CreateApplication />
              </Layout>
            }
          />
          <Route
            path={AppRoutes.success}
            element={
              <Layout>
                <ResultPage type="success" />
              </Layout>
            }
          />
          <Route
            path={AppRoutes.denied}
            element={
              <Layout>
                <ResultPage type="denied" />
              </Layout>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
