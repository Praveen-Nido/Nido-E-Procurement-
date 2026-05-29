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
  EyeOff,
  Eye,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CHART_COLORS = ["#4A6CF7", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function VendorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showProfile, setShowProfile] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("[v0] Error fetching vendor:", error);
        toast.error("Failed to load vendor details");
      } else {
        setVendor(data);
      }
      setLoading(false);
    };

    fetchVendor();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A6CF7]" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Vendor not found.</p>
        <Button onClick={() => navigate("/vendors")} className="mt-4">
          Back to Vendors
        </Button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return "VN";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate contract days
  const today = new Date();
  const contractEnd = vendor.contract_end ? new Date(vendor.contract_end) : new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
  const contractStart = vendor.contract_start ? new Date(vendor.contract_start) : new Date(vendor.created_at || today);
  const totalDays = Math.max(1, Math.ceil((contractEnd.getTime() - contractStart.getTime()) / (1000 * 60 * 60 * 24)));
  const daysLeft = Math.max(0, Math.ceil((contractEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const contractProgress = Math.min(100, Math.max(0, ((totalDays - daysLeft) / totalDays) * 100));

  const formatContractDates = () => {
    const start = new Date(vendor.contract_start || vendor.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, "-");
    const end = contractEnd.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, "-");
    return `${start} - ${end}`;
  };

  // Mock data for charts
  const totalSpend = 101000;
  const totalOrders = 2;
  const totalUsers = 2;

  const monthlySpendData = [
    { month: "Jan", spend: 0 },
    { month: "Feb", spend: 0 },
    { month: "Mar", spend: 0 },
    { month: "Apr", spend: 0 },
    { month: "May", spend: 0 },
    { month: "Jun", spend: 81 },
  ];

  const spendCategories = [
    { name: "Hardware", value: 57, amount: 200250, color: "#4A6CF7" },
    { name: "Software", value: 0, amount: 30300, color: "#10B981" },
    { name: "Service", value: 0, amount: 15300, color: "#F59E0B" },
    { name: "Other", value: 43, amount: 10500, color: "#8B5CF6" },
  ];

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
    doc.text(getInitials(vendor.company_name), pageWidth / 2, 25, { align: "center" });
    
    // Company Name
    doc.setTextColor(26, 29, 38);
    doc.setFontSize(20);
    doc.text(vendor.company_name || "Unknown Vendor", pageWidth / 2, 55, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`${vendor.status || "Active"} Vendor • Since ${vendor.created_at ? new Date(vendor.created_at).getFullYear() : "2024"}`, pageWidth / 2, 65, { align: "center" });
    
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
    
    doc.text(`Email: ${vendor.email || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Phone: ${vendor.phone || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Address: ${[vendor.address, vendor.city, vendor.state, vendor.country].filter(Boolean).join(", ") || "N/A"}`, 20, yPos);
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
    
    doc.text(`Vendor ID: ${vendor.vendor_code || vendor.id?.slice(0, 8) || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Category: ${vendor.category || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`GST: ${vendor.gst || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`PAN: ${vendor.pan || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Payment Terms: ${vendor.payment_terms || "N/A"}`, 20, yPos);
    yPos += lineHeight;
    doc.text(`Rating: ${vendor.rating || 0}/5`, 20, yPos);
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
    doc.text(`Status: ${vendor.status || "Active"}`, 20, yPos);
    
    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, pageWidth / 2, 280, { align: "center" });
    doc.text("Nido-Tech Procurement Platform", pageWidth / 2, 287, { align: "center" });
    
    // Save the PDF
    doc.save(`${vendor.company_name?.replace(/\s+/g, "_") || "vendor"}_profile.pdf`);
    toast.success("Profile downloaded successfully");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/vendors")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <p className="text-xs text-[#5C6370]">Vendors / {vendor.company_name}</p>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-[#1A1D26]">{vendor.company_name}</h1>
                <Badge className={
                  vendor.status === "active" 
                    ? "bg-emerald-500 text-white" 
                    : "bg-amber-500 text-white"
                }>
                  {vendor.status || "active"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProfile(!showProfile)}
              className="gap-2"
            >
              {showProfile ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showProfile ? "Hide Profile" : "Show Profile"}
            </Button>
            <Button
              size="sm"
              className="bg-[#4A6CF7] hover:bg-[#3B5DE8] gap-2"
              onClick={() => window.location.href = `mailto:${vendor.email}`}
            >
              <Mail className="h-4 w-4" />
              Quick Mail
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.location.href = `tel:${vendor.phone}`}
            >
              <Phone className="h-4 w-4" />
              Call
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT SIDEBAR - VENDOR CARD */}
          {showProfile && (
            <div className="col-span-3">
              <Card className="bg-white border-[#E8ECF1] overflow-hidden shadow-sm relative">
                {/* Blue wave background */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-[#4A6CF7] to-[#3B5DE8] overflow-hidden">
                  <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 400 50" preserveAspectRatio="none">
                    <path d="M0,50 C100,20 200,40 400,10 L400,50 Z" fill="white" />
                  </svg>
                </div>

                <CardContent className="pt-12 p-6 relative">
                  {/* Logo */}
                  <div className="flex justify-center mb-2">
                    <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
                      <span className="text-lg font-bold text-[#4A6CF7]">{getInitials(vendor.company_name)}</span>
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="text-center mb-4">
                    <h2 className="text-base font-semibold text-[#1A1D26]">{vendor.company_name}</h2>
                    <p className="text-xs text-[#5C6370]">{vendor.vendor_code || vendor.id?.slice(0, 8)}</p>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#5C6370]" />
                      <span className="text-[#1A1D26]">{vendor.company_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#5C6370]" />
                      <span className="text-[#4A6CF7]">{vendor.email || "No email"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#5C6370]" />
                      <span className="text-[#1A1D26]">{vendor.phone || "No phone"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#5C6370]" />
                      <span className="text-[#1A1D26]">
                        {[vendor.address, vendor.city, vendor.state].filter(Boolean).join(", ") || "No address"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#5C6370]" />
                      <span className="text-[#4A6CF7]">{formatContractDates()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-4">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-[#4A6CF7] hover:bg-[#3B5DE8]"
                      onClick={() => window.location.href = `mailto:${vendor.email}`}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-[#E8ECF1] text-[#1A1D26] hover:bg-gray-50"
                      onClick={() => window.location.href = `tel:${vendor.phone}`}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                  </div>

                  {/* Contract Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
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

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-t border-[#E8ECF1]">
                    <div>
                      <p className="text-xs text-[#5C6370]">Total Orders:</p>
                      <p className="text-sm font-semibold text-[#1A1D26]">{totalOrders}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#5C6370]">Spend</p>
                      <p className="text-sm font-semibold text-[#1A1D26]">${totalSpend.toLocaleString()}</p>
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
          )}

          {/* MAIN CONTENT */}
          <div className={showProfile ? "col-span-9" : "col-span-12"}>
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-white border border-[#E8ECF1] p-1">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="orders">Order Details</TabsTrigger>
                <TabsTrigger value="services">Service History</TabsTrigger>
                <TabsTrigger value="catalog">Catalog Items</TabsTrigger>
                <TabsTrigger value="config">Configuration</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-white border-[#E8ECF1]">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#EEF2FF] rounded-lg">
                          <Users className="h-5 w-5 text-[#4A6CF7]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#5C6370]">Total Users</p>
                          <p className="text-2xl font-bold text-[#1A1D26]">{totalUsers}</p>
                          <p className="text-xs text-[#4A6CF7]">{totalUsers} active users</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-[#E8ECF1]">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          <DollarSign className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-[#5C6370]">Total Spends</p>
                          <p className="text-2xl font-bold text-[#1A1D26]">${totalSpend.toLocaleString()}</p>
                          <p className="text-xs text-[#5C6370]">Year to date</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-[#E8ECF1]">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg">
                          <ShoppingCart className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-[#5C6370]">Open Orders</p>
                          <p className="text-2xl font-bold text-[#1A1D26]">{totalOrders}</p>
                          <p className="text-xs text-[#5C6370]">${totalSpend.toLocaleString()} value</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Company Details, Spending Overview, Top Spend Categories */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Company Details */}
                  <Card className="bg-white border-[#E8ECF1]">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-[#1A1D26] mb-4">Company Details</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-[#5C6370]" />
                          <span className="text-[#1A1D26]">{vendor.company_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#5C6370]" />
                          <span className="text-[#1A1D26]">
                            {[vendor.address, vendor.city, vendor.state].filter(Boolean).join(", ") || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-[#5C6370]" />
                          <span className="text-[#4A6CF7]">{vendor.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[#5C6370]" />
                          <span className="text-[#1A1D26]">{vendor.phone || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#5C6370]" />
                          <span className="text-[#1A1D26]">{formatContractDates()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Spending Overview */}
                  <Card className="bg-white border-[#E8ECF1]">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-[#1A1D26] mb-2">Spending Overview</h3>
                      <p className="text-2xl font-bold text-[#1A1D26]">${totalSpend.toLocaleString()}</p>
                      <p className="text-xs text-[#5C6370] mb-4">Total Spend</p>
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={monthlySpendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF1" />
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#5C6370" />
                            <YAxis tick={{ fontSize: 10 }} stroke="#5C6370" />
                            <Bar dataKey="spend" fill="#4A6CF7" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Spend Categories */}
                  <Card className="bg-white border-[#E8ECF1]">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-[#1A1D26] mb-4">Top Spend Categories</h3>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={spendCategories}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={25}
                                outerRadius={40}
                                paddingAngle={2}
                              >
                                {spendCategories.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-2">
                          {spendCategories.map((cat) => (
                            <div key={cat.name} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                <span className="text-[#5C6370]">{cat.name}</span>
                              </div>
                              <span className="text-[#1A1D26] font-medium">{cat.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bottom Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-white border-[#E8ECF1]">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-[#1A1D26] mb-3">User Summary</h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-[#5C6370]">Total Users: <span className="text-[#1A1D26] font-medium">{totalUsers}</span></p>
                        <p className="text-[#5C6370]">Active: <span className="text-[#4A6CF7] font-medium">{totalUsers}</span></p>
                        <p className="text-[#5C6370]">Inactive: <span className="text-red-500 font-medium">0</span></p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-[#E8ECF1]">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-[#1A1D26] mb-3">Recent Orders</h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-[#5C6370]">Open Orders: <span className="text-[#1A1D26] font-medium">{totalOrders}</span></p>
                        <p className="text-[#5C6370]">Total Value: <span className="text-[#1A1D26] font-medium">${totalSpend.toLocaleString()}</span></p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-[#E8ECF1]">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-[#1A1D26] mb-3">Active Services</h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-[#5C6370]">Contract Products: <span className="text-[#1A1D26] font-medium">0</span></p>
                        <p className="text-[#5C6370]">Until Renewal: <span className="text-[#4A6CF7] font-medium">{daysLeft} days</span></p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="roles">
                <Card className="bg-white border-[#E8ECF1]">
                  <CardContent className="p-6">
                    <p className="text-[#5C6370]">Roles management coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <Card className="bg-white border-[#E8ECF1]">
                  <CardContent className="p-6">
                    <p className="text-[#5C6370]">Users management coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card className="bg-white border-[#E8ECF1]">
                  <CardContent className="p-6">
                    <p className="text-[#5C6370]">Order details coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services">
                <Card className="bg-white border-[#E8ECF1]">
                  <CardContent className="p-6">
                    <p className="text-[#5C6370]">Service history coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="catalog">
                <Card className="bg-white border-[#E8ECF1]">
                  <CardContent className="p-6">
                    <p className="text-[#5C6370]">Catalog items coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="config">
                <Card className="bg-white border-[#E8ECF1]">
                  <CardContent className="p-6">
                    <p className="text-[#5C6370]">Configuration coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
