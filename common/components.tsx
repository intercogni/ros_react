import { createContext, useContext } from 'react'

import * as ROSLIB from 'roslib'
export const RosLib = ROSLIB

export const RosContext = createContext<typeof RosLib.Ros>(undefined)
export function useRememberedRos() {
    const RosInstance = useContext(RosContext)
    if (RosInstance === undefined) {
        throw new Error(
            'Intercogni ROS React-> Components must be wrapped by a <RosLink> element'
        )
    } 

    return RosInstance
}
