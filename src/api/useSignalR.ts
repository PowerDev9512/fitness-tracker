import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";

import { url } from "./client";
import { useStore } from "../store/store";

export const useSignalR = () => {
  const { token } = useStore();

  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${url}socialHub`, {
        timeout: 1000000,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [token]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          setIsConnected(true);
          setIsConnecting(false);
          setIsReconnecting(false);
          setIsDisconnected(false);
        })
        .catch(() => {
          setIsConnected(false);
          setIsConnecting(false);
          setIsReconnecting(false);
          setIsDisconnected(true);
        });

      connection.onreconnecting(() => {
        setIsConnected(false);
        setIsConnecting(false);
        setIsReconnecting(true);
        setIsDisconnected(false);
      });

      connection.onreconnected(() => {
        setIsConnected(true);
        setIsConnecting(false);
        setIsReconnecting(false);
        setIsDisconnected(false);
      });
    }
  }, [connection]);

  return {
    connection,
    isConnected,
    isConnecting,
    isReconnecting,
    isDisconnected,
  };
};
