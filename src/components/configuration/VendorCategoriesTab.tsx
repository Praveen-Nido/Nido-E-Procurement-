import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Search, Settings } from 'lucide-react';

export default function VendorCategoriesTab() {
  const { vendorCategories, addVendorCategory, updateVendorCategory } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterWorkflow, setFilterWorkflow] = useState('all');
  const [filterSLA, setFilterSLA] = useState('all');
  const [form, setForm] = useState<{ name: string; description: string; approvalWorkflow: string; defaultSLATemplate: string; activeVendors: number; assignmentMode: 'Auto' | 'Manual'; status: 'Active' | 'Inactive' }>({ name: '', description: '', approvalWorkflow: '', defaultSLATemplate: '', activeVendors: 0, assignmentMode: 'Auto', status: 'Active' });

  const filtered = vendorCategories.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterWorkflow !== 'all' && c.approvalWorkflow !== filterWorkflow) return false;
    if (filterSLA !== 'all' && c.defaultSLATemplate !== filterSLA) return false;
    return true;
  });

  const workflows = [...new Set(vendorCategories.map(c => c.approvalWorkflow))];
  const slas = [...new Set(vendorCategories.map(c => c.defaultSLATemplate))];

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', description: '', approvalWorkflow: '', defaultSLATemplate: '', activeVendors: 0, assignmentMode: 'Auto', status: 'Active' });
    setDialogOpen(true);
  };

  const openEdit = (id: string) => {
    const c = vendorCategories.find(c => c.id === id);
    if (!c) return;
    setEditingId(id);
    setForm(c);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast({ title: 'Error', description: 'Name required', variant: 'destructive' }); return; }
    if (editingId) {
      updateVendorCategory(editingId, form);
      toast({ title: 'Updated', description: `Category "${form.name}" updated` });
    } else {
      addVendorCategory(form);
      toast({ title: 'Created', description: `Category "${form.name}" created` });
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Vendor Categories</h2>
        <Button onClick={openCreate} className="gap-1.5"><Plus size={14} /> Add Vendor Category</Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Select value={filterWorkflow} onValueChange={setFilterWorkflow}>
          <SelectTrigger className="w-44 h-8 text-xs"><SelectValue placeholder="All Vendors" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vendors</SelectItem>
            {workflows.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterSLA} onValueChange={setFilterSLA}>
          <SelectTrigger className="w-44 h-8 text-xs"><SelectValue placeholder="Default SLA Template" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All SLA Templates</SelectItem>
            {slas.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <Input className="pl-8 h-8 w-40 text-xs" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Approval Workflow</TableHead>
                <TableHead>Default SLA Template</TableHead>
                <TableHead>Active Vendors</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(cat => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cat.description}</TableCell>
                  <TableCell className="text-sm">{cat.approvalWorkflow}</TableCell>
                  <TableCell className="text-sm">{cat.defaultSLATemplate}</TableCell>
                  <TableCell>
                    <span className="font-medium">{cat.activeVendors}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{cat.assignmentMode}</span>
                  </TableCell>
                  <TableCell><Badge className="bg-success text-success-foreground border-none">{cat.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(cat.id)}><Pencil size={14} /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-muted-foreground mt-3">1 – {filtered.length} of {filtered.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Category Settings</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Manage Approval Paths', 'Role Hierarchy & Permissions', 'Auto Assignment Logic', 'Update Vendor Products', 'Category Settings', 'Update Vendor Products'].map(title => (
              <div key={title} className="p-3 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <Settings size={16} className="text-primary" />
                  <p className="text-sm font-medium">{title}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? 'Edit' : 'Add'} Vendor Category</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Category Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
            <div><Label>Approval Workflow</Label><Input value={form.approvalWorkflow} onChange={e => setForm(p => ({ ...p, approvalWorkflow: e.target.value }))} /></div>
            <div><Label>Default SLA Template</Label><Input value={form.defaultSLATemplate} onChange={e => setForm(p => ({ ...p, defaultSLATemplate: e.target.value }))} /></div>
            <div>
              <Label>Assignment Mode</Label>
              <Select value={form.assignmentMode} onValueChange={v => setForm(p => ({ ...p, assignmentMode: v as 'Auto' | 'Manual' }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Auto">Auto</SelectItem><SelectItem value="Manual">Manual</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
