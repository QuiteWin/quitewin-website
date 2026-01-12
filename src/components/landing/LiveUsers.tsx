import { motion } from "framer-motion";
import { Users, Zap, Eye } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const CHANNEL_NAME = "quitewin-presence";
const USER_KEY = "quitewin-user-id";
const PRESENCE_KEY = "quitewin-presence-data";

const generateUserId = () => Math.random().toString(36).substring(2, 15);

const LiveUsers = () => {
  const [liveUsers, setLiveUsers] = useState(1247);
  const [queriesServed, setQueriesServed] = useState(1200000);

  // Simulate real-time fluctuation for presence illusion
  useEffect(() => {
    // Initialize or get user ID
    let userId = sessionStorage.getItem(USER_KEY);
    if (!userId) {
      userId = generateUserId();
      sessionStorage.setItem(USER_KEY, userId);
    }

    // BroadcastChannel for cross-tab communication
    const channel = new BroadcastChannel(CHANNEL_NAME);
    
    // Register presence
    const registerPresence = () => {
      const presenceData = JSON.parse(localStorage.getItem(PRESENCE_KEY) || "{}");
      presenceData[userId!] = Date.now();
      localStorage.setItem(PRESENCE_KEY, JSON.stringify(presenceData));
      channel.postMessage({ type: "presence", userId });
    };

    // Clean stale users (older than 30 seconds)
    const cleanStaleUsers = () => {
      const presenceData = JSON.parse(localStorage.getItem(PRESENCE_KEY) || "{}");
      const now = Date.now();
      const activeUsers: Record<string, number> = {};
      
      Object.entries(presenceData).forEach(([id, timestamp]) => {
        if (now - (timestamp as number) < 30000) {
          activeUsers[id] = timestamp as number;
        }
      });
      
      localStorage.setItem(PRESENCE_KEY, JSON.stringify(activeUsers));
      return Object.keys(activeUsers).length;
    };

    // Update user count with base + active tabs + random fluctuation
    const updateCount = () => {
      const activeTabUsers = cleanStaleUsers();
      const baseUsers = 1200 + Math.floor(Math.random() * 100);
      const fluctuation = Math.floor(Math.random() * 50) - 25;
      setLiveUsers(baseUsers + activeTabUsers + fluctuation);
    };

    // Initial registration
    registerPresence();
    updateCount();

    // Heartbeat
    const heartbeat = setInterval(() => {
      registerPresence();
      updateCount();
    }, 5000);

    // Listen for other tabs
    channel.onmessage = () => {
      updateCount();
    };

    // Cleanup on unload
    const handleUnload = () => {
      const presenceData = JSON.parse(localStorage.getItem(PRESENCE_KEY) || "{}");
      delete presenceData[userId!];
      localStorage.setItem(PRESENCE_KEY, JSON.stringify(presenceData));
      channel.postMessage({ type: "leave", userId });
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(heartbeat);
      handleUnload();
      channel.close();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  // Queries counter - continuously incrementing
  useEffect(() => {
    const interval = setInterval(() => {
      setQueriesServed(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="glass-card p-4 md:p-6 lg:p-8 rounded-2xl min-w-[280px] md:min-w-[320px]"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      style={{
        boxShadow: "0 0 60px hsl(263 70% 66% / 0.15), inset 0 0 60px hsl(263 70% 66% / 0.05)",
      }}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, hsl(263 70% 66% / 0.3) 50%, transparent 100%)",
          }}
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <motion.div
            className="w-2 h-2 rounded-full bg-neon-green"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="font-mono text-sm text-neon-green">LIVE HUD STATUS</span>
        </div>

        <div className="space-y-6">
          {/* Live Users */}
          <motion.div
            className="flex items-center gap-4"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center relative">
              <Users className="w-6 h-6 text-neon-green" />
              <motion.div
                className="absolute inset-0 rounded-xl bg-neon-green/20"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Users Online</p>
              <motion.p
                className="text-2xl font-bold font-mono text-foreground"
                key={liveUsers}
                initial={{ y: 5, opacity: 0.5 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {liveUsers.toLocaleString()}
              </motion.p>
            </div>
          </motion.div>

          {/* Queries Served */}
          <motion.div
            className="flex items-center gap-4"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-neon-purple" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Queries Served</p>
              <motion.p
                className="text-2xl font-bold font-mono text-foreground"
                key={Math.floor(queriesServed / 100)}
                initial={{ scale: 1.02 }}
                animate={{ scale: 1 }}
              >
                {queriesServed.toLocaleString()}+
              </motion.p>
            </div>
          </motion.div>

          {/* Visibility Mode */}
          <motion.div
            className="flex items-center gap-4"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-12 h-12 rounded-xl bg-neon-pink/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-neon-pink" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Visibility Mode</p>
              <p className="text-lg font-bold font-mono text-neon-green flex items-center gap-2">
                PRIVATE
                <motion.span
                  className="w-2 h-2 rounded-full bg-neon-green"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveUsers;
