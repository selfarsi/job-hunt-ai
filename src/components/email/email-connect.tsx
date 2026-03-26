"use client";

import { useState } from "react";
import { Card, Button, Input, Select } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { Mail, CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailConnectProps {
  isConnected: boolean;
  emailAddress?: string;
  onConnect: (config: { provider: string; host: string; port: number; username: string; password: string }) => Promise<void>;
  onDisconnect: () => void;
  onScan: () => Promise<void>;
  lastScan?: Date;
}

export function EmailConnect({
  isConnected,
  emailAddress,
  onConnect,
  onDisconnect,
  onScan,
  lastScan,
}: EmailConnectProps) {
  const [provider, setProvider] = useState<"gmail" | "imap">("imap");
  const [host, setHost] = useState("imap.gmail.com");
  const [port, setPort] = useState(993);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const { addToast } = useToast();

  const handleConnect = async () => {
    if (!username || !password) {
      addToast({ type: "error", title: "Missing fields", message: "Please fill in all fields" });
      return;
    }
    setIsConnecting(true);
    try {
      await onConnect({ provider, host, port, username, password });
      addToast({ type: "success", title: "Connected", message: "Email account connected successfully" });
    } catch (error) {
      addToast({ type: "error", title: "Connection failed", message: "Please check your credentials" });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    try {
      await onScan();
      addToast({ type: "success", title: "Scan complete", message: "Email inbox scanned for application updates" });
    } catch (error) {
      addToast({ type: "error", title: "Scan failed", message: "Failed to scan emails" });
    } finally {
      setIsScanning(false);
    }
  };

  if (isConnected) {
    return (
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent-emerald/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-accent-emerald" />
            </div>
            <div>
              <p className="font-medium text-text-primary">Email Connected</p>
              <p className="text-sm text-text-secondary">{emailAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleScan}
              disabled={isScanning}
            >
              {isScanning ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Scan Now
            </Button>
            <Button variant="ghost" size="sm" onClick={onDisconnect}>
              <XCircle className="h-4 w-4 mr-1" />
              Disconnect
            </Button>
          </div>
        </div>
        {lastScan && (
          <p className="text-xs text-text-muted mt-3">
            Last scanned: {new Date(lastScan).toLocaleString()}
          </p>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-5 w-5 text-accent-cyan" />
        <h3 className="font-semibold text-text-primary">Connect Email</h3>
      </div>

      <p className="text-sm text-text-secondary mb-4">
        Connect your email to automatically track application status updates.
      </p>

      <div className="space-y-4">
        <Select
          label="Email Provider"
          value={provider}
          onChange={(e) => {
            setProvider(e.target.value as typeof provider);
            if (e.target.value === "imap") {
              setHost("imap.gmail.com");
              setPort(993);
            }
          }}
          options={[
            { value: "imap", label: "IMAP (Gmail, Outlook, etc.)" },
          ]}
        />

        {provider === "imap" && (
          <>
            <Input
              label="IMAP Host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="imap.gmail.com"
            />
            <Input
              label="Port"
              type="number"
              value={port.toString()}
              onChange={(e) => setPort(parseInt(e.target.value))}
              placeholder="993"
            />
          </>
        )}

        <Input
          label="Email Address"
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="your@email.com"
        />

        <Input
          label="App Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your app-specific password"
        />

        <p className="text-xs text-text-muted">
          For Gmail, you need to generate an app password at{" "}
          <a
            href="https://myaccount.google.com/apppasswords"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-cyan hover:underline"
          >
            Google Account Security
          </a>
        </p>

        <Button
          variant="primary"
          className="w-full"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            "Connect Email"
          )}
        </Button>
      </div>
    </Card>
  );
}
