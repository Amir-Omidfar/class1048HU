import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        router.push("/login"); // if token invalid → redirect
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, API_URL]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>Dashboard</h1>
      {user ? (
        <>
          <p>Welcome, <strong>{user.username}</strong> 🎉</p>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            style={{ marginTop: "1rem" }}
          >
            Logout
          </button>
        </>
      ) : (
        <p>Not logged in.</p>
      )}
    </div>
  );
}
