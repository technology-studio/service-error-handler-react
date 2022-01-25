/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2021-09-06T13:09:68+02:00
 * @Copyright: Technology Studio
**/

import type {
  ServiceErrorException,
  ServiceError,
} from '@txo/service-prop'
import React from 'react'

export type ContextServiceErrorExceptionMap = Record<string, ServiceErrorException>

export type ErrorHandler = (attributes: ErrorHandlerAttributes) => React.ReactNode

export type ErrorHandlerAttributes = {
  children: React.ReactNode,
  next?: () => ErrorHandler,
  contextServiceErrorExceptionMap: ContextServiceErrorExceptionMap,
  addServiceErrorException: (serviceErrorException: ServiceErrorException) => void,
  removeServiceErrorException: (context: string) => void,
  removeAllServiceErrors: () => void,
  serviceErrorList: ServiceError[],
}
