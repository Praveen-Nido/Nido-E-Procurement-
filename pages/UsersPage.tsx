import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import CredentialsModal from "@/components/shared/CredentialsModal";
import { Plus, Pencil, Trash2, Search, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { isValidEmail, normalizeEmail } from "@/lib/validation";
import { usePageMeta } from "@/contexts/PageMetaContext";

export default function UsersPage() {
  const { setMeta } = usePageMeta();
  useEffect(() => { setMeta({ title: "Users" }); }, []);

  const {
    users,
    createUser,
    updateUser,
    deleteUser,
    isOwner,
    credentials,
    setCredentials,
  } = useEnhancedAuth();

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [form, setForm] = useState<{
    fullName: string;
    email: string;
    roleTemplate: "employee" | "vendor_user";
    organization: string;
    jobTitle: string;
    department: string;
    status: "Active" | "Inactive" | "Suspended";
  }>({
    fullName: "",
    email: "",
    roleTemplate: "employee",
    organization: "",
    jobTitle: "",
    department: "",
    status: "Active",
  });

  const filtered = users.filter(
    (u) =>
      String(u.fullName ?? "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(u.email ?? "")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  /* ---------------- EXPORT CSV ---------------- */
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast({ title: "No data to export" });
      return;
    }

    const columns = [
      "id",
      "fullName",
      "email",
      "jobTitle",
      "department",
      "organization",
      "status",
      "roleTemplate",
    ];

    const header = columns.join(",");
    const rows = filtered.map((user) => {
      return columns
        .map((col) => {
          const value = user[col as keyof typeof user] ?? "";
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(",");
    });

    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "CSV exported successfully" });
  };

  const handleCreate = async () => {
    if (!form.fullName || !form.email) {
      toast({ title: "Error", description: "Name & Email required" });
      return;
    }

    if (!isValidEmail(form.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    const result = await createUser({
      ...form,
      username: form.email.split("@")[0],
      phone: "",
      email: normalizeEmail(form.email),
      userType: "Vendor User",
      requiresPasswordReset: true,
      createdBy: "owner",
      twoFactorEnabled: false,
    });

    if (result.success && result.credentials) {
      setCredentials(result.credentials);
      toast({
        title: "User created",
        description: `Credentials generated for ${result.credentials.email}`,
      });
    } else if (!result.success) {
      toast({
        title: "Create failed",
        description: "Please check the entered details and try again.",
        variant: "destructive",
      });
      return;
    }

    setShowCreate(false);
    resetForm();
  };

  const handleEdit = (u: any) => {
    setEditId(u.id);
    setForm({
      ...u,
      jobTitle: u.jobTitle || "",
      department: u.department || "",
    });
    setShowEdit(true);
  };

  const handleSaveEdit = () => {
    if (!editId) return;

    updateUser(editId, form);

    toast({ title: "User Updated" });
    setShowEdit(false);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      roleTemplate: "employee",
      organization: "",
      jobTitle: "",
      department: "",
      status: "Active",
    } as const);
  };

  return (
    <div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between gap-4">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>

            {isOwner && (
              <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus /> Add User
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                  </DialogHeader>

                  <FormFields form={form} setForm={setForm} />

                  <Button onClick={() => void handleCreate()}>Create</Button>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.fullName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.jobTitle || "-"}</TableCell>
                    <TableCell>{u.department || "-"}</TableCell>

                    <TableCell>
                      <Badge>{u.status}</Badge>
                    </TableCell>

                    <TableCell className="flex gap-2">
                      {isOwner && (
                        <>
                          <Button size="icon" onClick={() => handleEdit(u)}>
                            <Pencil />
                          </Button>
                          <Button
                            size="icon"
                            onClick={() => setDeleteTargetId(u.id)}
                          >
                            <Trash2 />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        open={!!deleteTargetId}
        title="Delete User"
        description="Delete this user account? This action cannot be undone."
        confirmLabel="Delete"
        tone="destructive"
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null);
        }}
        onConfirm={() => {
          if (!deleteTargetId) return;
          void deleteUser(deleteTargetId);
          setDeleteTargetId(null);
        }}
      />

      <CredentialsModal
        open={!!credentials}
        onClose={() => setCredentials(null)}
        credentials={credentials}
        userType="VENDOR_USER"
      />
    </div>
  );
}

function FormFields({ form, setForm }: any) {
  return (
    <div className="space-y-3">
      <Input
        placeholder="Name"
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
      />

      <Input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <Input
        placeholder="Job Title"
        value={form.jobTitle}
        onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
      />

      <Input
        placeholder="Department"
        value={form.department}
        onChange={(e) => setForm({ ...form, department: e.target.value })}
      />

      <Select
        value={form.status}
        onValueChange={(v) => setForm({ ...form, status: v })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
          <SelectItem value="Suspended">Suspended</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
