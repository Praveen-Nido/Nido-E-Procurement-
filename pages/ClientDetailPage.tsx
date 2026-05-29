import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import jsPDF from "jspdf";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Users,
  Download,
  Building2,
  DollarSign,
  ShoppingCart,
  ChevronRight,
  Clock,
  FileText,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/* ------------------ MOCK DATA FOR CHARTS ------------------ */
const spendingData = [
  { month: "Jan", spend: 15000 },
  { month: "Feb", spend: 22000 },
  { month: "Mar", spend: 18000 },
  { month: "Apr", spend: 25000 },
  { month: "May", spend: 30000 },
  { month: "Jun", spend: 28000 },
  { month: "Jul", spend: 35000 },
  { month: "Aug", spend: 40000 },
  { month: "Sep", spend: 32000 },
  { month: "Oct", spend: 45000 },
  { month: "Nov", spend: 38000 },
  { month: "Dec", spend: 42000 },
];

const categoryData = [
  { name: "Hardware", value: 45, amount: 200250, color: "#3B82F6" },
  { name: "Software", value: 30, amount: 30300, color: "#10B981" },
  { name: "Service", value: 15, amount: 15300, color: "#F59E0B" },
  { name: "Other", value: 10, amount: 10500, color: "#8B5CF6" },
];

/* ------------------ MAIN COMPONENT ------------------ */
export default function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  /* ------------------ FETCH CLIENT ------------------ */
  useEffect(() => {
    if (id) fetchClient();
  }, [id]);

  const fetchClient = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Failed to load client");
    } else {
      setClient(data);
    }

    setLoading(false);
  };

  /* ------------------ HELPERS ------------------ */
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 3);
  };

  const calculateDaysLeft = () => {
    if (!client?.contract_end) return 0;
    const end = new Date(client.contract_end);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const calculateContractProgress = () => {
    if (!client?.contract_start || !client?.contract_end) return 0;
    const start = new Date(client.contract_start);
    const end = new Date(client.contract_end);
    const now = new Date();
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatContractDates = () => {
    if (!client?.contract_start || !client?.contract_end) return "N/A";
    const start = new Date(client.contract_start).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, "-");
    const end = new Date(client.contract_end).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, "-");
    return `${start} - ${end}`;
  };

  /* ------------------ PDF DOWNLOAD ------------------ */
  const downloadProfilePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(74, 108, 247);
    doc.rect(0, 0, pageWidth, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(getInitials(client.company_name), pageWidth / 2, 25, { align: "center" });
    
    // Company Name
    doc.setTextColor(26, 29, 38);
    doc.setFontSize(20);
    doc.text(client.company_name || "Unknown Company", pageWidth / 2, 55, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`${client.pricing_tier || "Standard"} Client • Since ${client.created_at ? new Date(client.created_at).getFullYear() : "2024"}`, pageWidth / 2, 65, { align: "center" });
    
    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 75, pageWidth - 20, 75);
    
    // Contact Details Section
    doc.setFontSize(14);
    doc.setTextColor(26, 29, 38);
    doc.setFont("helvetica", "bold");
    doc.text("Contact Information", 20, 90);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    
    let yPos = 102;
    const lineHeight = 10;
    
    doc.text(`Email: ${client.email || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Phone: ${client.phone || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Address: ${[client.address, client.city, client.state, client.country].filter(Boolean).join(", ") || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Contract Period: ${formatContractDates()}`, 20, yPos);
    yPos += lineHeight * 2;
    
    // Business Details Section
    doc.setFontSize(14);
    doc.setTextColor(26, 29, 38);
    doc.setFont("helvetica", "bold");
    doc.text("Business Details", 20, yPos);
    yPos += 12;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    
    doc.text(`Client ID: ${client.client_code || client.id?.slice(0, 8) || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Industry: ${client.industry_type || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Business Type: ${client.business_type || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`GST: ${client.gst || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`PAN: ${client.pan || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Payment Terms: ${client.payment_terms || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Contract Type: ${client.contract_type || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Pricing Tier: ${client.pricing_tier || "N/A"}`, 20, yPos);
    yPos += lineHeight * 2;
    
    // Contract Status
    doc.setFontSize(14);
    doc.setTextColor(26, 29, 38);
    doc.setFont("helvetica", "bold");
    doc.text("Contract Status", 20, yPos);
    yPos += 12;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    
    doc.text(`Days Remaining: ${daysLeft} days`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Status: ${client.status || "Active"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Total Orders: ${client.total_orders || 0}`, 20, yPos);
    
    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, pageWidth / 2, 280, { align: "center" });
    doc.text("Nido-Tech Procurement Platform", pageWidth / 2, 287, { align: "center" });
    
    // Save the PDF
    doc.save(`${client.company_name?.replace(/\s+/g, "_") || "client"}_profile.pdf`);
    toast.success("Profile downloaded successfully");
  };

  /* ------------------ STATES ------------------ */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Client not found</p>
        <Button variant="outline" onClick={() => navigate("/clients")} className="mt-4">
          Back to Clients
        </Button>
      </div>
    );
  }

  const daysLeft = calculateDaysLeft();
  const contractProgress = calculateContractProgress();

  /* ------------------ UI ------------------ */
  return (
    <div className="p-6 bg-[#FAFBFC] min-h-screen">
      {/* BREADCRUMB & HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <button onClick={() => navigate("/clients")} className="hover:text-primary flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Clients
            </button>
            <span>/</span>
            <span>{client.company_name}</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#1A1D26]">{client.company_name}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-[#4A6CF7] hover:bg-[#3B5DE8] text-white">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button variant="outline" className="border-[#E8ECF1]">
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT SIDEBAR - CLIENT CARD */}
        <div className="col-span-3">
          <Card className="bg-white border-[#E8ECF1] overflow-hidden shadow-sm">
            <CardContent className="p-6">
              {/* Logo with blue gradient ring */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4A6CF7] to-[#3B5DE8] p-[3px]">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#4A6CF7]">{getInitials(client.company_name)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Name */}
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold text-[#1A1D26]">{client.company_name}</h2>
                <p className="text-sm text-[#5C6370]">
                  {client.pricing_tier || "Premium"} Client • Since {client.created_at ? new Date(client.created_at).getFullYear() : "2024"}
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-[#5C6370]" />
                  <span className="text-[#1A1D26]">{client.email || "No email"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-[#5C6370]" />
                  <span className="text-[#1A1D26]">{client.phone || "No phone"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-[#5C6370]" />
                  <span className="text-[#1A1D26]">
                    {[client.address, client.city, client.state].filter(Boolean).join(", ") || "No address"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-[#5C6370]" />
                  <span className="text-[#1A1D26]">{formatContractDates()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-6">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-[#4A6CF7] text-[#4A6CF7] hover:bg-[#4A6CF7]/5"
                  onClick={() => window.location.href = `mailto:${client.email}`}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-[#E8ECF1] text-[#1A1D26] hover:bg-gray-50"
                  onClick={() => window.location.href = `tel:${client.phone}`}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>

              {/* Contract Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#5C6370]">Contract Progress</span>
                  <span className="text-[#4A6CF7] font-medium">{daysLeft} days left</span>
                </div>
                <div className="w-full bg-[#E8ECF1] rounded-full h-2">
                  <div
                    className="bg-[#4A6CF7] h-2 rounded-full transition-all"
                    style={{ width: `${100 - contractProgress}%` }}
                  />
                </div>
              </div>

              {/* Client Info Footer */}
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-[#E8ECF1]">
                <div>
                  <p className="text-xs text-[#5C6370]">Client Since</p>
                  <p className="text-sm font-medium text-[#1A1D26]">
                    {client.created_at ? new Date(client.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#5C6370]">Client ID</p>
                  <p className="text-sm font-medium text-[#1A1D26]">{client.client_code || client.id?.slice(0, 8)}</p>
                </div>
              </div>

              {/* Download Button */}
              <Button 
                variant="outline" 
                className="w-full border-[#E8ECF1] text-[#5C6370] hover:bg-gray-50 mt-2"
                onClick={downloadProfilePDF}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* MAIN CONTENT */}
        <div className="col-span-9 space-y-6">
          {/* STATS ROW */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-[#E8ECF1]">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="h-5 w-5 text-[#4A6CF7]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-[#1A1D26]">24</p>
                    <p className="text-xs text-muted-foreground">12 Active</p>
                    <p className="text-xs text-muted-foreground">3 Pending invites</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E8ECF1]">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spends</p>
                    <p className="text-2xl font-bold text-[#1A1D26]">$101,000</p>
                    <p className="text-xs text-muted-foreground">Year to date</p>
                    <p className="text-xs text-muted-foreground">Last Payment: $25,000</p>
                    <p className="text-xs text-muted-foreground">Jan 11, 2026</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E8ECF1]">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Open Orders</p>
                    <p className="text-2xl font-bold text-[#1A1D26]">3</p>
                    <p className="text-xs text-muted-foreground">$32,500 value</p>
                    <p className="text-xs text-muted-foreground">Contracts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* TABS */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-b border-[#E8ECF1] w-full justify-start rounded-none p-0 h-auto">
              {["Overview", "Users", "Orders", "Services", "Catalog", "Activity", "Notes"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab.toLowerCase()}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4A6CF7] data-[state=active]:text-[#4A6CF7] data-[state=active]:bg-transparent px-4 py-3"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-3 gap-6">
                {/* Company Details */}
                <Card className="border-[#E8ECF1]">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-[#1A1D26] mb-4">Company Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-[#4A6CF7]" />
                        <span className="text-sm">{client.company_name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-[#4A6CF7]" />
                        <span className="text-sm">{client.industry_type || "Technology"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-[#4A6CF7]" />
                        <span className="text-sm">51-200 employees</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-[#4A6CF7]" />
                        <div>
                          <p className="text-xs text-muted-foreground">Website</p>
                          <p className="text-sm text-[#4A6CF7]">www.{client.company_name?.toLowerCase().replace(/\s+/g, "")}.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-[#4A6CF7]" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm">{client.phone || "+1-555-1000"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-[#4A6CF7]" />
                        <div>
                          <p className="text-xs text-muted-foreground">Billing Email</p>
                          <p className="text-sm text-[#4A6CF7]">{client.email || "billing@company.com"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Spending Overview */}
                <Card className="border-[#E8ECF1]">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-[#1A1D26]">Spending Overview</h3>
                      <Badge variant="outline" className="text-xs">This Year</Badge>
                    </div>
                    <p className="text-2xl font-bold text-[#1A1D26] mb-1">$101,000</p>
                    <p className="text-xs text-muted-foreground mb-4">Total Spend</p>
                    <p className="text-xs text-green-600 mb-4">+12.5% vs last year</p>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={spendingData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF1" />
                          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v / 1000}K`} />
                          <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Spend"]} />
                          <Bar dataKey="spend" fill="#4A6CF7" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Spend Categories */}
                <Card className="border-[#E8ECF1]">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-[#1A1D26] mb-4">Top Spend Categories</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={50}
                              dataKey="value"
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex-1 space-y-2">
                        {categoryData.map((cat) => (
                          <div key={cat.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                              <span>{cat.name}</span>
                              <span className="text-muted-foreground">{cat.value}%</span>
                            </div>
                            <span className="font-medium">${cat.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* BOTTOM ROW - SUMMARY CARDS */}
              <div className="grid grid-cols-3 gap-6 mt-6">
                {/* User Summary */}
                <Card className="border-[#E8ECF1]">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-[#4A6CF7]" />
                        <h3 className="font-semibold text-[#1A1D26]">User Summary</h3>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                          <Users className="h-6 w-6 text-[#4A6CF7]" />
                        </div>
                        <p className="text-2xl font-bold text-[#1A1D26]">24</p>
                        <p className="text-xs text-muted-foreground">Total Users</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">12</p>
                        <p className="text-xs text-muted-foreground">Active</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-500">4</p>
                        <p className="text-xs text-muted-foreground">Inactive</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="border-[#E8ECF1]">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-[#4A6CF7]" />
                        <h3 className="font-semibold text-[#1A1D26]">Recent Orders</h3>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                          <ShoppingCart className="h-6 w-6 text-[#4A6CF7]" />
                        </div>
                        <p className="text-2xl font-bold text-[#1A1D26]">3</p>
                        <p className="text-xs text-muted-foreground">Open Orders</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#1A1D26]">$32,500</p>
                        <p className="text-xs text-muted-foreground">Total Value</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Services */}
                <Card className="border-[#E8ECF1]">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-[#4A6CF7]" />
                        <h3 className="font-semibold text-[#1A1D26]">Active Services</h3>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                          <FileText className="h-6 w-6 text-[#4A6CF7]" />
                        </div>
                        <p className="text-2xl font-bold text-[#1A1D26]">2</p>
                        <p className="text-xs text-muted-foreground">Active Contracts</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#4A6CF7]">{daysLeft} days</p>
                        <p className="text-xs text-muted-foreground">Until Renewal</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <Card className="border-[#E8ECF1]">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">User Management</h3>
                  <p className="text-muted-foreground">User list and management features coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <Card className="border-[#E8ECF1]">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Orders History</h3>
                  <p className="text-muted-foreground">Order history and tracking coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <Card className="border-[#E8ECF1]">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Active Services</h3>
                  <p className="text-muted-foreground">Service contracts and SLAs coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="catalog" className="mt-6">
              <Card className="border-[#E8ECF1]">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Product Catalog</h3>
                  <p className="text-muted-foreground">Client-specific catalog coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card className="border-[#E8ECF1]">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Activity Log</h3>
                  <p className="text-muted-foreground">Activity timeline coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <Card className="border-[#E8ECF1]">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Notes</h3>
                  <p className="text-muted-foreground">{client.notes || "No notes available."}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
