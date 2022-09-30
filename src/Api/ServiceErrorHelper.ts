/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2021-09-10T20:09:27+02:00
 * @Copyright: Technology Studio
**/

import type {
  ServiceError,
  ServiceErrorException,
} from '@txo/service-prop'
import {
  ServiceErrorKey,
} from '@txo/service-prop'
import type { ContextServiceErrorExceptionMap } from '@txo-peer-dep/service-error-handler-react'

export const collectServiceErrorList = (contextServiceErrorExceptionMap: ContextServiceErrorExceptionMap): ServiceError[] => (
  Object.keys(contextServiceErrorExceptionMap).reduce<ServiceError[]>(
    (serviceErrorList, context) => {
      const exception = contextServiceErrorExceptionMap[context]
      serviceErrorList.push(...exception.serviceErrorList)
      return serviceErrorList
    },
    [],
  )
)

export const containsError = (contextServiceErrorExceptionMap: ContextServiceErrorExceptionMap): boolean => (
  Object.keys(contextServiceErrorExceptionMap).length > 0
)

export const containsNonNetworkError = (exception: ServiceErrorException): boolean => (
  exception.serviceErrorList.some(error => error.key !== ServiceErrorKey.NETWORK_ERROR)
)
