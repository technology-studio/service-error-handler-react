/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2021-09-02T16:09:67+02:00
 * @Copyright: Technology Studio
**/

import React, {
  useCallback,
  useMemo,
  useState,
} from 'react'
import type { ServiceErrorException } from '@txo/service-prop'
import {
  isEmptyObject,
  removeKeys,
} from '@txo/functional'
import { useLatest } from '@txo/hooks-react'
import {
  ContextServiceErrorExceptionMap,
  ErrorHandler,
  ErrorHandlerAttributes,
  ErrorHandlerContext,
  errorHandlerManager,
} from '@txo-peer-dep/service-error-handler-react'
import { Log } from '@txo/log'

import { collectServiceErrorList } from '../Api/ServiceErrorHelper'
import { EMPTY_ARRAY } from '../Model/Types'

const log = new Log('@txo.service-react-error-handler.Components.ErrorHandlerContainer')

type Props = {
  children: React.ReactNode,
}

const emptyErrorHandler: ErrorHandler = (attributes: ErrorHandlerAttributes) => attributes.children

type NextErrorHandlerFactory = () => ErrorHandler
const nextErrorHandlerFactory = (
  errorHandlerSequence: ErrorHandler[],
): NextErrorHandlerFactory => {
  let index = 0
  return () => (
    errorHandlerSequence && errorHandlerSequence.length > index
      ? errorHandlerSequence[index++]
      : emptyErrorHandler
  )
}

export const handleNext = (attributes: ErrorHandlerAttributes): React.ReactNode => {
  const nextErrorHandler = attributes.next?.()
  return nextErrorHandler
    ? nextErrorHandler(attributes)
    : attributes.children
}

export const ErrorHandlerContainer = (props: Props): JSX.Element => {
  const [contextServiceErrorExceptionMap, setContextServiceErrorExceptionMap] = useState<ContextServiceErrorExceptionMap>({})
  const contextServiceErrorExceptionMapRef = useLatest(contextServiceErrorExceptionMap)
  log.debug('RENDER', { contextServiceErrorExceptionMap: contextServiceErrorExceptionMapRef.current })
  const errorHandlerSequence = errorHandlerManager.getHandlerSequence() ?? EMPTY_ARRAY

  const addServiceErrorException = useCallback((exception: ServiceErrorException) => {
    if (contextServiceErrorExceptionMapRef.current[exception.context] === exception) {
      return
    }
    errorHandlerManager.emit(exception)
    const nextContextServiceErrorExceptionMap = {
      ...contextServiceErrorExceptionMapRef.current,
      [exception.context]: exception,
    }
    setContextServiceErrorExceptionMap(nextContextServiceErrorExceptionMap)
    contextServiceErrorExceptionMapRef.current = nextContextServiceErrorExceptionMap
  }, [contextServiceErrorExceptionMapRef])

  const removeServiceErrorException = useCallback((context: string) => {
    if (context in contextServiceErrorExceptionMapRef.current) {
      const nextContextServiceErrorExceptionMap = removeKeys(contextServiceErrorExceptionMapRef.current, [context]) as ContextServiceErrorExceptionMap
      setContextServiceErrorExceptionMap(nextContextServiceErrorExceptionMap)
      contextServiceErrorExceptionMapRef.current = nextContextServiceErrorExceptionMap
    }
  }, [contextServiceErrorExceptionMapRef])

  const removeAllServiceErrors = useCallback(() => {
    if (!isEmptyObject(contextServiceErrorExceptionMapRef.current)) {
      const nextContextServiceErrorExceptionMap = {}
      setContextServiceErrorExceptionMap(nextContextServiceErrorExceptionMap)
      contextServiceErrorExceptionMapRef.current = nextContextServiceErrorExceptionMap
    }
  }, [contextServiceErrorExceptionMapRef])

  const content = useMemo(() => {
    if (isEmptyObject(contextServiceErrorExceptionMap)) {
      return props.children
    }
    const serviceErrorList = collectServiceErrorList(contextServiceErrorExceptionMap)
    const next = nextErrorHandlerFactory(errorHandlerSequence)
    const rootErrorHandler = next()
    return rootErrorHandler({
      contextServiceErrorExceptionMap,
      next,
      addServiceErrorException,
      removeServiceErrorException,
      removeAllServiceErrors,
      serviceErrorList,
      children: props.children,
    })
  }, [addServiceErrorException, contextServiceErrorExceptionMap, errorHandlerSequence, props.children, removeAllServiceErrors, removeServiceErrorException])

  const contextValue = useMemo(() => ({
    addServiceErrorException,
    removeServiceErrorException,
    removeAllServiceErrors,
  }), [addServiceErrorException, removeAllServiceErrors, removeServiceErrorException])

  return (
    <ErrorHandlerContext.Provider
      value={contextValue}
    >
      {content}
    </ErrorHandlerContext.Provider>
  )
}
