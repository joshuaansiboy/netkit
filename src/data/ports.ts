export const PORT_CATEGORIES = [
  "All",
  "Web",
  "Email",
  "File Transfer",
  "Remote Access",
  "Database",
  "Infrastructure",
  "Other",
] as const;

export type PortCategory = Exclude<(typeof PORT_CATEGORIES)[number], "All">;
export type Transport = "TCP" | "UDP";

export interface PortEntry {
  port: number;
  service: string;
  transports: Transport[];
  category: PortCategory;
  description: string;
  commonUse: string;
  keywords?: string;
}

// A curated learning reference. Protocols describe common service use, not a
// guarantee that a service is listening on a particular device or port.
export const PORTS: PortEntry[] = [
  { port: 20, service: "FTP Data", transports: ["TCP"], category: "File Transfer", description: "Data channel for classic active-mode File Transfer Protocol.", commonUse: "Legacy file transfer data", keywords: "file transfer active" },
  { port: 21, service: "FTP Control", transports: ["TCP"], category: "File Transfer", description: "Command channel for File Transfer Protocol.", commonUse: "Legacy file transfer commands", keywords: "file transfer" },
  { port: 22, service: "SSH", transports: ["TCP"], category: "Remote Access", description: "Encrypted remote shell and secure tunneling.", commonUse: "Remote administration and SFTP", keywords: "secure shell sftp" },
  { port: 23, service: "Telnet", transports: ["TCP"], category: "Remote Access", description: "Legacy remote terminal protocol without encryption.", commonUse: "Legacy device administration", keywords: "remote terminal" },
  { port: 25, service: "SMTP", transports: ["TCP"], category: "Email", description: "Simple Mail Transfer Protocol between mail servers.", commonUse: "Server-to-server email delivery", keywords: "mail" },
  { port: 53, service: "DNS", transports: ["TCP", "UDP"], category: "Infrastructure", description: "Domain Name System queries and responses.", commonUse: "Name resolution; TCP also supports larger responses and zone transfers", keywords: "domain names" },
  { port: 67, service: "DHCP Server", transports: ["UDP"], category: "Infrastructure", description: "Server side of Dynamic Host Configuration Protocol.", commonUse: "Assigning network settings to clients", keywords: "address allocation bootps" },
  { port: 68, service: "DHCP Client", transports: ["UDP"], category: "Infrastructure", description: "Client side of Dynamic Host Configuration Protocol.", commonUse: "Receiving network settings", keywords: "address allocation bootpc" },
  { port: 69, service: "TFTP", transports: ["UDP"], category: "File Transfer", description: "Simple file transfer protocol with no built-in authentication.", commonUse: "Network boot and device configuration", keywords: "trivial file transfer" },
  { port: 80, service: "HTTP", transports: ["TCP"], category: "Web", description: "Hypertext Transfer Protocol for web traffic without TLS.", commonUse: "Websites and HTTP APIs", keywords: "web" },
  { port: 110, service: "POP3", transports: ["TCP"], category: "Email", description: "Post Office Protocol version 3 for retrieving email.", commonUse: "Legacy mailbox access", keywords: "mail" },
  { port: 123, service: "NTP", transports: ["UDP"], category: "Infrastructure", description: "Network Time Protocol for clock synchronization.", commonUse: "Keeping device clocks aligned", keywords: "time sync" },
  { port: 137, service: "NetBIOS Name Service", transports: ["TCP", "UDP"], category: "Infrastructure", description: "NetBIOS name registration and lookup.", commonUse: "Legacy Windows name services", keywords: "windows netbios ns" },
  { port: 138, service: "NetBIOS Datagram", transports: ["UDP"], category: "Infrastructure", description: "Connectionless NetBIOS datagram service.", commonUse: "Legacy Windows networking", keywords: "windows netbios dgm" },
  { port: 139, service: "NetBIOS Session", transports: ["TCP"], category: "Infrastructure", description: "Session service for NetBIOS over TCP/IP.", commonUse: "Legacy Windows file sharing", keywords: "windows netbios ssn" },
  { port: 143, service: "IMAP", transports: ["TCP"], category: "Email", description: "Internet Message Access Protocol for reading mail.", commonUse: "Mailbox access", keywords: "mail" },
  { port: 161, service: "SNMP", transports: ["UDP"], category: "Infrastructure", description: "Simple Network Management Protocol requests.", commonUse: "Monitoring network devices", keywords: "management monitoring" },
  { port: 162, service: "SNMP Trap", transports: ["UDP"], category: "Infrastructure", description: "Notifications sent by SNMP-enabled devices.", commonUse: "Network device alerts", keywords: "management monitoring" },
  { port: 389, service: "LDAP", transports: ["TCP", "UDP"], category: "Infrastructure", description: "Lightweight Directory Access Protocol.", commonUse: "Directory lookups and authentication infrastructure", keywords: "directory" },
  { port: 443, service: "HTTPS", transports: ["TCP", "UDP"], category: "Web", description: "Encrypted web traffic; HTTP/3 commonly uses QUIC over UDP.", commonUse: "Secure websites and APIs", keywords: "web tls ssl quic http3" },
  { port: 445, service: "SMB", transports: ["TCP"], category: "File Transfer", description: "Server Message Block over direct-hosted TCP.", commonUse: "Windows file and printer sharing", keywords: "microsoft ds windows" },
  { port: 465, service: "SMTPS", transports: ["TCP"], category: "Email", description: "Mail submission with implicit TLS.", commonUse: "Secure email submission", keywords: "submissions mail" },
  { port: 514, service: "Syslog", transports: ["UDP"], category: "Infrastructure", description: "Traditional syslog datagrams over UDP.", commonUse: "Centralized logging", keywords: "logs" },
  { port: 587, service: "SMTP Submission", transports: ["TCP"], category: "Email", description: "Mail submission from clients to a mail server.", commonUse: "Sending email from mail apps", keywords: "mail starttls" },
  { port: 636, service: "LDAPS", transports: ["TCP"], category: "Infrastructure", description: "LDAP with implicit TLS.", commonUse: "Encrypted directory access", keywords: "directory tls ssl" },
  { port: 993, service: "IMAPS", transports: ["TCP"], category: "Email", description: "IMAP with implicit TLS.", commonUse: "Secure mailbox access", keywords: "mail" },
  { port: 995, service: "POP3S", transports: ["TCP"], category: "Email", description: "POP3 with implicit TLS.", commonUse: "Secure POP3 mailbox access", keywords: "mail" },
  { port: 1433, service: "Microsoft SQL Server", transports: ["TCP"], category: "Database", description: "Default SQL Server database connection port.", commonUse: "SQL Server client connections", keywords: "mssql database" },
  { port: 1521, service: "Oracle Database", transports: ["TCP"], category: "Database", description: "Common Oracle database listener port.", commonUse: "Oracle database connections", keywords: "sql listener" },
  { port: 1883, service: "MQTT", transports: ["TCP"], category: "Other", description: "Lightweight publish-and-subscribe messaging protocol, commonly used over TCP.", commonUse: "IoT device messaging", keywords: "message broker telemetry iot" },
  { port: 2049, service: "NFS", transports: ["TCP", "UDP"], category: "File Transfer", description: "Network File System service.", commonUse: "Sharing files across Unix-like systems", keywords: "network file system" },
  { port: 3306, service: "MySQL", transports: ["TCP"], category: "Database", description: "Default MySQL database connection port.", commonUse: "MySQL client connections", keywords: "mariadb sql" },
  { port: 3389, service: "RDP", transports: ["TCP", "UDP"], category: "Remote Access", description: "Remote Desktop Protocol traffic.", commonUse: "Windows remote desktop sessions", keywords: "remote desktop" },
  { port: 5060, service: "SIP", transports: ["TCP", "UDP"], category: "Other", description: "Session Initiation Protocol signaling for starting and managing real-time sessions.", commonUse: "Voice and video call signaling", keywords: "voip telephony" },
  { port: 5432, service: "PostgreSQL", transports: ["TCP"], category: "Database", description: "Default PostgreSQL database connection port.", commonUse: "PostgreSQL client connections", keywords: "postgres sql" },
  { port: 5900, service: "VNC", transports: ["TCP"], category: "Remote Access", description: "Virtual Network Computing remote desktop protocol.", commonUse: "Screen sharing and remote control", keywords: "remote desktop rfb" },
  { port: 6379, service: "Redis", transports: ["TCP"], category: "Database", description: "Common Redis server port.", commonUse: "Redis data store connections", keywords: "cache key value" },
  { port: 8080, service: "HTTP Alternate", transports: ["TCP"], category: "Web", description: "Common alternative port for HTTP web services.", commonUse: "Development servers, proxies, and web apps", keywords: "web proxy" },
  { port: 8443, service: "HTTPS Alternate", transports: ["TCP"], category: "Web", description: "Common alternative port for HTTPS web services.", commonUse: "Secure web apps and admin consoles", keywords: "web tls ssl" },
];

export function filterPorts(query: string, category: (typeof PORT_CATEGORIES)[number]): PortEntry[] {
  const term = query.trim().toLowerCase();
  return PORTS.filter((entry) => {
    if (category !== "All" && entry.category !== category) return false;
    if (!term) return true;
    if (/^\d+$/.test(term)) return entry.port === Number(term);
    return [entry.service, entry.description, entry.commonUse, entry.keywords ?? ""]
      .some((value) => value.toLowerCase().includes(term));
  });
}
