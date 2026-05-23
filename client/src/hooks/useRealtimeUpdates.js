import { useEffect, useEffectEvent, useState } from "react";
import { connectRealtime } from "../services/realtimeService";

function normalizeLiveEvent(payload, fallbackTitle) {
  return {
    id: `${payload?.type || fallbackTitle}-${payload?.timestamp || Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: payload?.title || fallbackTitle,
    message: payload?.message || "Live event received.",
    timestamp: payload?.timestamp || new Date().toISOString(),
  };
}

export function useRealtimeUpdates({
  onConsumerRefresh,
  onFarmerRefresh,
  onOrderStatusUpdated,
  token,
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);

  const pushLiveEvent = useEffectEvent((payload, fallbackTitle) => {
    const nextEvent = normalizeLiveEvent(payload, fallbackTitle);
    setLiveEvents((current) => [nextEvent, ...current].slice(0, 5));
  });

  const handleConsumerRefresh = useEffectEvent((payload) => {
    pushLiveEvent(payload, "Consumer dashboard refreshed");
    onConsumerRefresh?.(payload);
  });

  const handleFarmerRefresh = useEffectEvent((payload) => {
    pushLiveEvent(payload, "Farmer dashboard refreshed");
    onFarmerRefresh?.(payload);
  });

  const handleOrderStatusUpdated = useEffectEvent((payload) => {
    pushLiveEvent(payload, "Order status updated");
    onOrderStatusUpdated?.(payload);
  });

  useEffect(() => {
    if (!token) {
      setIsConnected(false);
      setLiveEvents([]);
      return undefined;
    }

    const socket = connectRealtime(token);

    if (!socket) {
      return undefined;
    }

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onConnectedEvent = (payload) => {
      setIsConnected(true);
      pushLiveEvent(payload, "Realtime connected");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("realtime:connected", onConnectedEvent);
    socket.on("dashboard:consumer:refresh", handleConsumerRefresh);
    socket.on("dashboard:farmer:refresh", handleFarmerRefresh);
    socket.on("order:status-updated", handleOrderStatusUpdated);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("realtime:connected", onConnectedEvent);
      socket.off("dashboard:consumer:refresh", handleConsumerRefresh);
      socket.off("dashboard:farmer:refresh", handleFarmerRefresh);
      socket.off("order:status-updated", handleOrderStatusUpdated);
    };
  }, [handleConsumerRefresh, handleFarmerRefresh, handleOrderStatusUpdated, pushLiveEvent, token]);

  return { isConnected, liveEvents };
}

