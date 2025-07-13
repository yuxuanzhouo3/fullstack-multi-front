import { useEffect } from "react";

export default function SocialRedirect() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = "https://social.mornhub.net";
    }
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Redirecting to Social Platform...</h1>
      <p>If you are not redirected, <a href="https://social.mornhub.net">click here</a>.</p>
    </div>
  );
} 