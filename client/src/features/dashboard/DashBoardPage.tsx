import { useEffect, useState } from "react";
import { fetchServices, createService } from "../../lib/services.api";
import { useAuth } from "../../hooks/AuthContext";
import type { Service } from "../../types/service";

export default function DashboardPage() {
  const { user } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [creating, setCreating] = useState(false);

  async function loadServices() {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch {
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const newService = await createService({ name, url });
      setServices((prev) => [newService, ...prev]);
      setName("");
      setUrl("");
    } catch (err: any) {
      setError(err.message || "Failed to create service");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Dashboard</h2>

      {/* ADMIN-ONLY CREATE FORM */}
      {user?.role === "admin" && (
        <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
          <h3>Create Service</h3>

          <input
            placeholder="Service name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            placeholder="Service URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <button type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create Service"}
          </button>
        </form>
      )}

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* SERVICES LIST */}
      {loading ? (
        <p>Loading services...</p>
      ) : services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <ul>
          {services.map((service) => (
            <li key={service._id}>
              <strong>{service.name}</strong> — {service.url}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
