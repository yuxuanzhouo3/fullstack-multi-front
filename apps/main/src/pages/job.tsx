import { useEffect } from "react";

export default function JobRedirect() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = "https://job.mornhub.net";
    }
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Redirecting to Job Platform...</h1>
      <p>If you are not redirected, <a href="https://job.mornhub.net">click here</a>.</p>
    </div>
  );
} 