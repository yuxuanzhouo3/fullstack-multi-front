import { useEffect } from "react";

export default function AcceleratorRedirect() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = "https://accelerator.mornhub.net";
    }
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Redirecting to Accelerator...</h1>
      <p>If you are not redirected, <a href="https://accelerator.mornhub.net">click here</a>.</p>
    </div>
  );
} 