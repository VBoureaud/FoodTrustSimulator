import React, { useState, useEffect } from "react";
import { Store } from 'react-notifications-component';
import { useChannel } from "./AblyReactEffect";

type AblyMsg = {
  connectionId: string;
  data: string;
  name: string;
  timestamp: number;
};
type Props = {
  channel: string;
  callback: Function;
}
const WebSocketAbly = (props: Props) => {
  /*useEffect(() => {
    console.log('didMount');
    return () => console.log('didUnmount');
  }, []);*/

  const [channel, ably] = useChannel(props.channel, (message: AblyMsg) => {
    if (message && message.name === props.channel) {
      Store.addNotification({
        //title: "Notification",
        message: message.data,
        type: "default",
        insert: "bottom",
        container: "bottom-left",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
          pauseOnHover: true,
          click: false,
          touch: false,
        }
      });
      if (props.callback)
        props.callback();
    }
  });

  return <></>;
}

export default WebSocketAbly;