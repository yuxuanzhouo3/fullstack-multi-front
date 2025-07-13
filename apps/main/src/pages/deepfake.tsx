import { useEffect } from "react";
import { useRouter } from "next/router";

export default function DeepfakeRedirect() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = "https://deepfake.mornhub.net";
    }
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Redirecting to Deepfake Detector...</h1>
      <p>If you are not redirected, <a href="https://deepfake.mornhub.net">click here</a>.</p>
    </div>
  );
} 