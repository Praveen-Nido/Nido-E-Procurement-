import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Save, ChevronRight, ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const workflows = [
  { name: 'Order Workflow', rules: [
    { condition: 'Order Category is set to High Priority', actions: ['Set Status to Assigned', 'Add: Analyst → Matthew Royce', 'Notify: Email', 'Escalate to L2 Supervisor'] }
  ]},
  { name: 'Repair Ticket Workflow', ruleCount: 4 },
  { name: 'AMC Service Workflow', ruleCount: 3, note: 'SLAs applied to AMC requests' },
  { name: 'Return Request Workflow', ruleCount: 2 },
  { name: 'Recycle Request Workflow', ruleCount: 2 },
];

export default function WorkflowAutomationTab() {
  const [enabled, setEnabled] = useState(true);
  const [expandedWorkflow, setExpandedWorkflow] = useState('Order Workflow');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Workflow Automation</h2>
        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button className="gap-1.5" onClick={() => toast({ title: 'Saved' })}><Save size={14} /> Save</Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4 space-y-4">
          <div className="flex items-center gap-3">
            <Switch checked={enabled} onCheckedChange={setEnabled} />
            <Label className="font-medium">Enable Workflow Automation</Label>
          </div>
          <p className="text-sm text-muted-foreground">Automatically process and route incoming orders and service tickets based on defined conditions.</p>
          <Button variant="default" className="gap-1.5"><Plus size={14} /> Add Rule</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Workflow Status Rules</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {workflows.map(wf => (
            <Collapsible key={wf.name} open={expandedWorkflow === wf.name} onOpenChange={open => setExpandedWorkflow(open ? wf.name : '')}>
              <div className="border border-border rounded-lg">
                <CollapsibleTrigger className="w-full flex items-center justify-between p-3 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-2">
                    {expandedWorkflow === wf.name ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <Plus size={14} className="text-primary" />
                    <span className="font-medium text-sm">{wf.name}</span>
                    {wf.ruleCount && <span className="text-xs text-muted-foreground">- {wf.ruleCount} Rules</span>}
                    {wf.note && <span className="text-xs text-muted-foreground italic">{wf.note}</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-xs text-destructive">Delete</Button>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {wf.rules?.map((rule, idx) => (
                    <div key={idx} className="p-4 border-t border-border space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="text-xs">Rule {idx + 1}</Badge>
                        <span>If</span>
                        <Badge variant="secondary" className="text-xs">Order Category</Badge>
                        <span>is set to</span>
                        <Badge variant="outline" className="text-xs">High Priority</Badge>
                      </div>
                      {rule.actions.map((action, aIdx) => (
                        <div key={aIdx} className="flex items-center justify-between ml-6 p-2 bg-accent/30 rounded text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-medium">{aIdx === 0 ? 'Then' : ''}</span>
                            <span>{action}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="text-xs h-6">Edit</Button>
                            <Button variant="ghost" size="sm" className="text-xs h-6 text-destructive">Delete</Button>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="ml-6 text-xs"><Plus size={12} className="mr-1" /> Add Action</Button>
                    </div>
                  ))}
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Escalation & Alerts</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Additional escalation rules for critical priorities.</p>
          <Button variant="outline" className="mt-2 gap-1.5"><Plus size={14} /> Add Escalation Rule</Button>
        </CardContent>
      </Card>
    </div>
  );
}
