/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2021-09-06T14:09:35+02:00
 * @Copyright: Technology Studio
**/

import React from 'react'
import type {
  ServiceErrorException,
} from '@txo/service-prop'

type Context = {
  addServiceErrorException: (serviceErrorException: ServiceErrorException) => void,
  removeServiceErrorException: (context: string) => void,
  removeAllServiceErrors: () => void,
}

export const ErrorHandlerContext = React.createContext<Context>({
  addServiceErrorException: () => undefined,
  removeServiceErrorException: () => undefined,
  removeAllServiceErrors: () => undefined,
})
