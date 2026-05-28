"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

import { Search, Plus, Pencil, Trash2 } from "lucide-react";

export default function ClientsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [editingClient, setEditingClient] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    status: "active",
  });

  /* ---------------- FETCH CLIENTS ---------------- */
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast({ title: "Failed to load clients" });
    } else {
      setClients(data || []);
    }

    setLoading(false);
  };

  /* ---------------- FILTER ---------------- */
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch =
        c.company_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.contact_person?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All"
          ? true
          : c.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("clients").delete().eq("id", id);

    if (error) {
      toast({ title: "Delete failed" });
      return;
    }

    setClients((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Client deleted" });
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (client: any) => {
    setEditingClient(client);
    setEditForm({
      company_name: client.company_name || "",
      contact_person: client.contact_person || "",
      email: client.email || "",
      phone: client.phone || "",
      status: client.status || "active",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingClient) return;

    const { error } = await supabase
      .from("clients")
      .update(editForm)
      .eq("id", editingClient.id);

    if (error) {
      toast({ title: "Update failed" });
      return;
    }

    toast({ title: "Updated successfully" });
    setEditingClient(null);
    fetchClients();
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return <div className="p-6">Loading clients...</div>;
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Clients</h1>

        <button
          onClick={() => navigate("/clients/add")}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4" />
          <input
            className="w-full border pl-10 pr-4 py-2 rounded-lg"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border px-3 py-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-6 bg-gray-100 p-3 text-sm font-semibold">
          <div>ID</div>
          <div>Name</div>
          <div>Contact</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Status</div>
        </div>

        {filteredClients.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No clients found
          </div>
        ) : (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="grid grid-cols-6 p-3 border-t items-center"
            >
              <Link
                to={`/clients/${client.id}`}
                className="text-blue-700 font-medium"
              >
                {client.client_code || client.id.slice(0, 6)}
              </Link>

              <div>{client.company_name}</div>
              <div>{client.contact_person}</div>
              <div>{client.email}</div>
              <div>{client.phone}</div>

              <div className="flex justify-between items-center">
                <span>{client.status}</span>

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(client)}>
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button onClick={() => handleDelete(client.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EDIT MODAL */}
      {editingClient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-3">
            <h2 className="font-bold text-lg">Edit Client</h2>

            <input
              className="w-full border p-2 rounded"
              placeholder="Company Name"
              value={editForm.company_name}
              onChange={(e) =>
                setEditForm({ ...editForm, company_name: e.target.value })
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Contact Person"
              value={editForm.contact_person}
              onChange={(e) =>
                setEditForm({ ...editForm, contact_person: e.target.value })
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Phone"
              value={editForm.phone}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
            />

            <select
              className="w-full border p-2 rounded"
              value={editForm.status}
              onChange={(e) =>
                setEditForm({ ...editForm, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditingClient(null)}>
                Cancel
              </button>

              <button
                onClick={handleSaveEdit}
                className="bg-blue-900 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
