import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { applicationsApi } from 'features/applications/applications-api'

export const store = configureStore({
  reducer: {
    [applicationsApi.reducerPath]: applicationsApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(applicationsApi.middleware)
})

void setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
