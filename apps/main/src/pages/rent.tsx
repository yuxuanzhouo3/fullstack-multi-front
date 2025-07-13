import { useEffect } from "react";

export default function RentRedirect() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = "https://rent.mornhub.net";
    }
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Redirecting to Rent...</h1>
      <p>If you are not redirected, <a href="https://rent.mornhub.net">click here</a>.</p>
    </div>
  );
} 