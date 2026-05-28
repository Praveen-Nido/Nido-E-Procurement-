import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageMeta } from "@/contexts/PageMetaContext";

import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Settings,
  Users,
  Workflow,
  ClipboardList,
  Bell,
  BookOpen,
  Plug,
  Server,
  Zap,
  DollarSign,
} from "lucide-react";

interface ConfigCard {
  label: string;
  icon: React.ElementType;
  path?: string;
  description: string;
  type?: "standard" | "integration-switcher";
}

const CONFIG_CARDS: ConfigCard[] = [
  {
    label: "General Settings",
    icon: Settings,
    path: "/configuration/general-settings",
    description: "Organization, localization & defaults",
  },
  {
    label: "Nido-Users",
    icon: Users,
    path: "/configuration/nido-users",
    description: "Manage roles and user assignments",
  },
  {
    label: "Approval Workflows",
    icon: Workflow,
    path: "/configuration/workflows",
    description: "Define multi-level approval chains",
  },
  {
    label: "Order Statuses",
    icon: ClipboardList,
    path: "/configuration/order-statuses",
    description: "Customize order lifecycle stages",
  },
  {
    label: "Notifications",
    icon: Bell,
    path: "/configuration/notifications",
    description: "Email, SMS & in-app alert rules",
  },
  {
    label: "Master Catalogue",
    icon: BookOpen,
    path: "/configuration/master-catalogue",
    description: "Manage and register the global product/service catalogue",
  },
  {
    label: "Integrations",
    icon: Plug,
    description: "Connect external systems and APIs",
    type: "integration-switcher",
  },
  {
    label: "System Logs",
    icon: Server,
    path: "/reports/audit",
    description: "Activity & system event logs",
  },
  {
    label: "Auto Assignment",
    icon: Zap,
    path: "/configuration/workflows",
    description: "Smart analyst auto-routing rules",
  },
  {
    label: "Price Engine",
    icon: DollarSign,
    path: "/configuration/price-engine",
    description: "Configure pricing rules and calculations",
  },
];

export default function ConfigurationHubPage() {
  const { setMeta } = usePageMeta();
  useEffect(() => { setMeta({ title: "Configuration" }); }, []);

  const navigate = useNavigate();

  return (
    <div>
            <div className="p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-display font-bold">Configuration</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONFIG_CARDS.map((card) => {
            const Icon = card.icon;
            if (card.type === "integration-switcher") {
              return (
                <Popover key={card.label}>
                  <PopoverTrigger asChild>
                    <Card className="group cursor-pointer hover:shadow-md hover:border-primary/40 transition-all duration-200 p-5 flex flex-col items-center text-center gap-3">
                      <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-sm">
                          Integrations
                        </span>
                        <span className="text-muted-foreground text-xs">›</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Manage connectors and API integrations
                      </p>
                    </Card>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-56 p-2">
                    <button
                      type="button"
                      className="w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-muted"
                      onClick={() => navigate("/integrations")}
                    >
                      Integrations
                    </button>
                  </PopoverContent>
                </Popover>
              );
            }

            return (
              <Card
                key={card.label}
                className="group cursor-pointer hover:shadow-md hover:border-primary/40 transition-all duration-200 p-5 flex flex-col items-center text-center gap-3"
                onClick={() => card.path && navigate(card.path)}
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm">{card.label}</span>
                  <span className="text-muted-foreground text-xs">›</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
