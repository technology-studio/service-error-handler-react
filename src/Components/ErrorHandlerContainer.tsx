/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2021-09-02T16:09:67+02:00
 * @Copyright: Technology Studio
**/

import React, {
  useCallback,
  useMemo,
} from 'react'
import type { ServiceOperationError } from '@txo/service-prop'
import {
  ErrorHandlerContext,
  errorHandlerManager,
} from '@txo-peer-dep/service-error-handler-react'

type Props = {
  children: React.ReactNode,
}

export const ErrorHandlerContainer = ({ children }: Props): JSX.Element => {
  const reportServiceOperationError = useCallback((exception: ServiceOperationError) => {
    errorHandlerManager.emit(exception)
  }, [])

  const contextValue = useMemo(() => ({
    reportServiceOperationError,
  }), [reportServiceOperationError])

  return (
    <ErrorHandlerContext.Provider
      value={contextValue}
    >
      {children}
    </ErrorHandlerContext.Provider>
  )
}
