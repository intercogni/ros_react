/**
 * ╭╴RosPublisherNode
 * ╰--> A ROS Component used to Publish Data into ROS Topics via Websocket
 * ╭╴Oportunitas (Taib Izzat Samawi); 16/Nov/2023
 * ╰--> @intercogni-ros-react | @Barunastra_ITS | @Intercogni
 **/

import { useRememberedRos, RosLib } from '../common/components'
import { useEffect, useState } from 'react'

export default function RosPublisherNode({
    topic,
    msg_type,
    msg,
    throttle_rate,
    latch,
    queue_length,
    continuous_stream,
    children,
    style,
    ...userProps
}: {
    topic              : string
    msg_type           : string
    msg                : any
    throttle_rate     ?: any
    latch             ?: any
    queue_length      ?: any
    continuous_stream ?: boolean
    children          ?: React.ReactNode
    style             ?: any
}) {
    // Remember the ROS mentioned in the wrapper of this element
    const RosInstance = useRememberedRos()

    // Publication Timer
    const [timer_tick, setTimerTick] = useState(false)

    const Topic = new RosLib.Topic({
        ros          : RosInstance,
        name         : `${topic}`,
        messageType  : `${msg_type}`,
        throttleRate : `${throttle_rate}`,
        latch        : `${latch}`,
        queue_length : `${queue_length}`
    })

    useEffect(() => {
        if (continuous_stream === true) {
            const delay_period = Math.round(1000 / (throttle_rate || 1))
            const timer        = setTimeout(() => {
                const Cur_Msg = new RosLib.Message(msg)
                Topic.publish(Cur_Msg)
                console.log(`publishing ${Cur_Msg.data} to ${topic}`)
                setTimerTick(!timer_tick)
            }, delay_period)
            return function () {
                clearTimeout(timer)
            }
        }
    }, [timer_tick])

    useEffect(() => {
        if (continuous_stream !== true) {
            Topic.publish(msg)
            console.log(`publishing msg to ${RosInstance.url}`)
        }
    }, [msg])

    useEffect(() => {
        return function () {
            Topic.unadvertise()
        }
    }, [])

    return <div style = {style}>{children}</div>
}