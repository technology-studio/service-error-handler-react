/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2021-09-10T20:09:27+02:00
 * @Copyright: Technology Studio
**/

import type {
  ServiceOperationError,
} from '@txo/service-prop'
import {
  ServiceErrorKey,
} from '@txo/service-prop'

export const containsNonNetworkError = (serviceOperationError: ServiceOperationError): boolean => (
  serviceOperationError.serviceErrorList.some(error => error.key as ServiceErrorKey !== ServiceErrorKey.NETWORK_ERROR)
)
