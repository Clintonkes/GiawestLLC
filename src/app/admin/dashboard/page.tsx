"use client";

import { useState, useEffect } from "react";
import { 
  Truck, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ExternalLink,
  Globe,
  Zap,
  Mail,
  ShieldCheck,
  MessageSquare, 
  LayoutDashboard, 
  ChevronRight, 
  MapPin, 
  Trash2,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  // Data states
  const [orders, setOrders] = useState<any[]>([]);
  const [trucks, setTrucks] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  
  // Modal states
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  const [isAddTruckOpen, setIsAddTruckOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedTruck, setSelectedTruck] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [truckToDelete, setTruckToDelete] = useState<any>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    const token = localStorage.getItem("admin_token");
    try {
      const results = await api.searchOrders(token!, query);
      setSearchResults(results);
      if (activeTab !== "Shipments") setActiveTab("Shipments");
    } catch (err) {
      showToast("Search failed", "error");
    }
  };

  const showToast = (message: string, type: 'success'|'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDeleteTruck = async (truckId: number) => {
    const token = localStorage.getItem("admin_token");
    setIsSubmitting(true);
    try {
      await api.deleteTruck(token!, truckId);
      showToast("Unit removed from fleet", "success");
      await refreshData();
      setIsDeleteConfirmOpen(false);
      setIsAddTruckOpen(false);
      setTruckToDelete(null);
    } catch (err) {
      showToast("Failed to remove unit", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshData = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    try {
      const [statsData, ordersData, trucksData, customersData, messagesData] = await Promise.all([
        api.getDashboardStats(token),
        api.getAdminOrders(token),
        api.getAdminTrucks(token),
        api.getAdminCustomers(token),
        api.getAdminMessages(token)
      ]);
      setStats(statsData);
      setOrders(ordersData);
      setTrucks(trucksData);
      setCustomers(customersData);
      setMessages(messagesData);
    } catch (err) {
      console.error("Refresh error:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const adminUser = localStorage.getItem("admin_user");

    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    setUser(JSON.parse(adminUser || "{}"));

    const fetchData = async () => {
      try {
        const [statsData, ordersData, trucksData, customersData, messagesData] = await Promise.all([
          api.getDashboardStats(token),
          api.getAdminOrders(token),
          api.getAdminTrucks(token),
          api.getAdminCustomers(token),
          api.getAdminMessages(token)
        ]);
        
        setStats(statsData);
        setOrders(ordersData);
        setTrucks(trucksData);
        setCustomers(customersData);
        setMessages(messagesData);
      } catch (err) {
        console.error("Fetch error:", err);
        localStorage.removeItem("admin_token");
        window.location.href = "/admin/login";
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  };

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-primary text-white p-8 flex flex-col shrink-0">
        <div className="flex items-center space-x-3 mb-12">
          <div className="relative p-2 bg-gradient-to-br from-accent to-blue-600 rounded-lg">
            <Globe className="h-6 w-6 text-white" />
            <Zap className="h-2 w-2 text-white absolute -top-0.5 -right-0.5 fill-white" />
          </div>
          <span className="text-xl font-heading font-black">Florida Prod Market Admin</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { icon: BarChart3, label: "Dashboard" },
            { icon: Package, label: "Shipments" },
            { icon: Truck, label: "Fleet Management" },
            { icon: Users, label: "Customers" },
            { icon: Mail, label: "Messages" },
            { icon: Settings, label: "System Config" },
          ].map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.label ? "bg-accent text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={() => setIsLogoutConfirmOpen(true)}
          className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors mt-auto"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-bold">Logout System</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-heading font-black text-primary">System Overview</h1>
            <p className="text-slate-500 font-medium">Welcome back, {user?.full_name || "Admin"}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search orders (ID, Name, Email)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                className="bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
              />
            </div>
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-black">
              {user?.username?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        {activeTab === "Dashboard" ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { label: "Total Orders", val: stats?.orders?.total || 0, icon: Package, color: "blue" },
                { label: "In Transit", val: stats?.orders?.in_progress || 0, icon: Truck, color: "indigo" },
                { label: "Unread Messages", val: stats?.messages?.unread || 0, icon: Bell, color: "orange" },
                { label: "Security Alerts", val: stats?.security?.failed_logins_today || 0, icon: ShieldCheck, color: "red" },
              ].map((stat) => (
                <motion.div 
                  key={stat.label}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-slate-50 rounded-2xl`}>
                      <stat.icon className={`h-6 w-6 text-primary`} />
                    </div>
                    <div className="text-sm font-bold text-green-500 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>12%</span>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-primary mb-1">{stat.val}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-heading font-black text-primary">Live Operations</h3>
                    <button onClick={() => setActiveTab("Shipments")} className="text-sm font-bold text-accent flex items-center hover:underline">
                      <span>View All</span>
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                  <div className="p-8 space-y-6">
                    {orders.length === 0 ? (
                      <div className="p-10 text-center text-slate-400 font-bold">No active operations found</div>
                    ) : orders.slice(0, 5).map((order) => (
                      <div key={order.order_number} className="flex items-center justify-between group">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-accent/5 group-hover:text-accent transition-all">
                            {order.order_number.slice(-2)}
                          </div>
                          <div>
                            <div className="font-bold text-primary">{order.order_number}</div>
                            <div className="text-xs text-slate-400 font-medium truncate max-w-[150px]">
                              {order.customer_name} • {order.delivery_location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold capitalize ${
                            order.status === "completed" ? "text-green-500" : 
                            order.status === "pending" ? "text-orange-500" : "text-accent"
                          }`}>
                            {order.status}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium flex items-center justify-end">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-accent p-8 rounded-[2rem] text-white shadow-xl shadow-accent/20">
                  <h3 className="text-xl font-heading font-black mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button onClick={() => setActiveTab("Fleet Management")} className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center justify-between transition-all group text-left">
                      <span className="font-bold">Fleet Status</span>
                      <ArrowUpRight className="h-5 w-5 text-white/50 group-hover:text-white transition-all" />
                    </button>
                    <button onClick={() => setActiveTab("Messages")} className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center justify-between transition-all group text-left">
                      <span className="font-bold">Contact Inquiries</span>
                      <ArrowUpRight className="h-5 w-5 text-white/50 group-hover:text-white transition-all" />
                    </button>
                    <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center justify-between transition-all group text-left">
                      <span className="font-bold">System Status: OK</span>
                      <ShieldCheck className="h-5 w-5 text-white/50 group-hover:text-white transition-all" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === "Shipments" ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-heading font-black text-primary">Logistics Registry</h3>
                {searchResults && (
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-sm text-accent font-bold italic">Showing {searchResults.length} search results for "{searchQuery}"</p>
                    <button onClick={() => { setSearchResults(null); setSearchQuery(""); }} className="text-[10px] font-black uppercase text-slate-300 hover:text-red-500 transition-colors underline">Clear Search</button>
                  </div>
                )}
              </div>
              <div className="text-sm text-slate-400 font-bold">{searchResults ? searchResults.length : orders.length} Total Shipments</div>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[500px] custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <th className="px-8 py-4">ID</th>
                    <th className="px-8 py-4">Customer</th>
                    <th className="px-8 py-4">Destination</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(searchResults || orders).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6 font-bold text-primary">{order.order_number}</td>
                      <td className="px-8 py-6 text-slate-600 font-medium">{order.customer_name}</td>
                      <td className="px-8 py-6 text-slate-600 font-medium">{order.delivery_location}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          order.status === "completed" ? "bg-green-100 text-green-600" : 
                          order.status === "pending" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-slate-400 text-sm font-medium">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end space-x-4">
                          <button 
                            onClick={() => { setViewingOrder(order); setIsDetailsOpen(true); }}
                            className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
                          >
                            Details
                          </button>
                          <button 
                            onClick={() => { setSelectedOrder(order); setIsEditOrderOpen(true); }}
                            className="text-xs font-black text-accent uppercase tracking-widest hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === "Fleet Management" ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-heading font-black text-primary">Fleet Status</h3>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-slate-400 font-bold">{trucks.length} Units</div>
                <button 
                  onClick={() => { setSelectedTruck(null); setIsAddTruckOpen(true); }}
                  className="bg-accent text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent/90 transition-all flex items-center"
                >
                  <TrendingUp className="h-3 w-3 mr-2" />
                  Add Unit
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
              {trucks.map((truck) => (
                <div key={truck.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-accent/20 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-accent group-hover:text-white transition-all">
                      <Truck className="h-6 w-6" />
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      truck.status === "available" ? "bg-green-500 text-white" : "bg-orange-500 text-white"
                    }`}>
                      {truck.status}
                    </span>
                    <button 
                      onClick={() => { setSelectedTruck(truck); setPreviewUrl(truck.image_url); setIsAddTruckOpen(true); }}
                      className="ml-2 text-[10px] font-black text-accent uppercase tracking-widest hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <h4 className="font-bold text-primary mb-1">{truck.truck_number}</h4>
                  <p className="text-xs text-slate-500 font-medium mb-4">{truck.truck_type}</p>
                  <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Last active: {new Date(truck.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === "Customers" ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-heading font-black text-primary">Customer Database</h3>
              <div className="text-sm text-slate-400 font-bold">{customers.length} Accounts</div>
            </div>
            <div className="p-8 space-y-4">
              {customers.map((customer) => (
                <div key={customer.email} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-black">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-primary">{customer.name}</div>
                      <div className="text-xs text-slate-500 font-medium">{customer.email} • {customer.phone}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">{customer.order_count} Orders</div>
                    <div className="text-[10px] text-slate-400 font-medium">Last order: {new Date(customer.last_order_date).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === "Messages" ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-heading font-black text-primary">Inbox</h3>
              <div className="text-sm text-slate-400 font-bold">{messages.length} Unread</div>
            </div>
            <div className="p-8 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group relative">
                  {!msg.is_read && <span className="absolute top-6 right-6 w-2 h-2 bg-accent rounded-full" />}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <span className="text-xs font-black text-primary uppercase tracking-widest">{msg.subject}</span>
                    <span className="text-[10px] font-bold text-slate-400 ml-auto">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-primary mb-1">{msg.name}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{msg.message}</p>
                  <div className="flex items-center space-x-4">
                    <button className="text-[10px] font-black text-accent uppercase tracking-tighter hover:underline">Mark as Read</button>
                    <button className="text-[10px] font-black text-red-500 uppercase tracking-tighter hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-20 text-center">
            <Settings className="h-20 w-20 text-slate-200 mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl font-black text-primary mb-2">System Configuration</h3>
            <p className="text-slate-500 font-medium">This module is restricted to super-administrators.</p>
          </div>
        )}
      </main>

      {/* Edit Order Modal */}
      {isEditOrderOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-heading font-black text-primary">Edit Shipment</h3>
                <p className="text-sm text-slate-500 font-medium">Order: {selectedOrder.order_number}</p>
              </div>
              <button onClick={() => setIsEditOrderOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                <Settings className="h-6 w-6 text-slate-400" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              const token = localStorage.getItem("admin_token");
              const formData = new FormData(e.currentTarget);
              try {
                await api.updateOrderStatus(
                  token!, 
                  selectedOrder.id, 
                  formData.get("status") as string, 
                  formData.get("truck_id") ? Number(formData.get("truck_id")) : undefined
                );
                await refreshData();
                setIsEditOrderOpen(false);
                showToast("Order status updated 📦", "success");
              } catch (err) {
                showToast("Failed to update status", "error");
              } finally {
                setIsSubmitting(false);
              }
            }} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Update Status</label>
                <select name="status" defaultValue={selectedOrder.status} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-primary focus:ring-2 focus:ring-accent/20 outline-none appearance-none">
                  <option value="pending">Pending Review</option>
                  <option value="assigned">Assigned to Truck</option>
                  <option value="in_progress">En-Route / In Transit</option>
                  <option value="completed">Completed / Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Assign Vehicle (Optional)</label>
                <select name="truck_id" defaultValue={selectedOrder.assigned_truck_id || ""} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-primary focus:ring-2 focus:ring-accent/20 outline-none appearance-none">
                  <option value="">No truck assigned</option>
                  {trucks.filter(t => t.status === "available" || t.id === selectedOrder.assigned_truck_id).map(truck => (
                    <option key={truck.id} value={truck.id}>{truck.truck_number} - {truck.truck_type}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex space-x-4">
                <button type="button" onClick={() => setIsEditOrderOpen(false)} className="flex-1 px-8 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-accent text-white px-8 py-4 rounded-2xl font-black hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Update Order"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Truck Modal */}
      {isAddTruckOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-2xl font-heading font-black text-primary">{selectedTruck ? "Edit Fleet Unit" : "Expand Fleet"}</h3>
              <button onClick={() => setIsAddTruckOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                <Settings className="h-6 w-6 text-slate-400" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              const token = localStorage.getItem("admin_token");
              const formData = new FormData(e.currentTarget);
              const file = (formData.get("image") as File);
              
              try {
                let image_url = "";
                if (file && file.size > 0) {
                  const uploadRes = await api.uploadImage(token!, file);
                  image_url = uploadRes.url;
                }

                if (selectedTruck) {
                  await api.updateTruck(selectedTruck.id, {
                    truck_number: formData.get("truck_number"),
                    truck_type: formData.get("truck_type"),
                    capacity: formData.get("capacity"),
                    driver_name: formData.get("driver_name"),
                    driver_phone: formData.get("driver_phone"),
                    ...(image_url && { image_url })
                  }, token!);
                  showToast("Unit details updated successfully", "success");
                } else {
                  await api.addTruck(token!, {
                    truck_number: formData.get("truck_number"),
                    truck_type: formData.get("truck_type"),
                    capacity: formData.get("capacity"),
                    driver_name: formData.get("driver_name"),
                    driver_phone: formData.get("driver_phone"),
                    image_url: image_url || undefined
                  });
                  showToast("New unit deployed to fleet 🚛", "success");
                }
                
                await refreshData();
                setIsAddTruckOpen(false);
                setPreviewUrl(null);

              } catch (err) {
                showToast("Failed to add truck", "error");
              } finally {
                setIsSubmitting(false);
              }
            }} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Truck ID</label>
                  <input name="truck_number" required placeholder="GIA-001" defaultValue={selectedTruck?.truck_number ?? ""} className="w-full bg-slate-50 border-none rounded-xl p-3 font-bold text-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Vehicle Type</label>
                  <select name="truck_type" defaultValue={selectedTruck?.truck_type ?? "Semi-Trailer"} className="w-full bg-slate-50 border-none rounded-xl p-3 font-bold text-primary outline-none">
                    <option value="Semi-Trailer">Semi-Trailer</option>
                    <option value="Box Truck">Box Truck</option>
                    <option value="Flatbed">Flatbed</option>
                    <option value="Reefer">Reefer (Cold)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Capacity</label>
                  <input name="capacity" required placeholder="25 Tons" defaultValue={selectedTruck?.capacity ?? ""} className="w-full bg-slate-50 border-none rounded-xl p-3 font-bold text-primary outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Driver Name</label>
                  <input name="driver_name" required placeholder="John Doe" defaultValue={selectedTruck?.driver_name ?? ""} className="w-full bg-slate-50 border-none rounded-xl p-3 font-bold text-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Driver Phone</label>
                <input name="driver_phone" required placeholder="+1 555-0199" defaultValue={selectedTruck?.driver_phone ?? ""} className="w-full bg-slate-50 border-none rounded-xl p-3 font-bold text-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Unit Photo</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-100 border-dashed rounded-2xl hover:border-accent/20 transition-colors bg-slate-50/30 overflow-hidden min-h-[160px] items-center relative">
                  {previewUrl ? (
                    <div className="relative w-full h-full flex flex-col items-center">
                      <img src={previewUrl} alt="Preview" className="max-h-32 rounded-xl object-contain mb-2" />
                      <button 
                        type="button" 
                        onClick={() => setPreviewUrl(null)}
                        className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                      >
                        Remove Photo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <Truck className="mx-auto h-10 w-10 text-slate-300" />
                      <div className="flex text-sm text-slate-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-bold text-accent hover:text-accent/80 focus-within:outline-none">
                          <span>Upload Unit Image</span>
                          <input name="image" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        </label>
                      </div>
                      <p className="text-xs text-slate-400">PNG or JPG</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-4 flex space-x-4">
                {selectedTruck && (
                  <button type="button" onClick={() => {
                    setTruckToDelete(selectedTruck);
                    setIsDeleteConfirmOpen(true);
                  }} className="px-8 py-4 rounded-2xl font-black text-red-500 hover:bg-red-50 transition-all">
                    Remove
                  </button>
                )}
                <button type="button" onClick={() => setIsAddTruckOpen(false)} className="flex-1 px-8 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-accent text-white px-8 py-4 rounded-2xl font-black hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 disabled:opacity-50">
                  {isSubmitting ? "Deploying..." : (selectedTruck ? "Save Changes" : "Add to Fleet")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/60 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-white/20">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-red-500">
                <LogOut className="h-10 w-10 font-black" />
              </div>
              <h3 className="text-3xl font-heading font-black text-primary mb-3">Leave System?</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Are you sure you want to end your session? You will need to re-authenticate to access the command center.
              </p>
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-4 rounded-2xl font-black hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  Yes, Sign Out
                </button>
                <button 
                  onClick={() => setIsLogoutConfirmOpen(false)}
                  className="w-full py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all"
                >
                  Stay Connected
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && truckToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-primary/50 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-heading font-black text-primary mb-2">Remove Fleet Unit?</h3>
              <p className="text-slate-500 font-medium mb-2">You are about to permanently delete:</p>
              <p className="text-lg font-black text-accent mb-1">{truckToDelete.truck_number}</p>
              <p className="text-sm text-slate-400 font-medium mb-8">{truckToDelete.truck_type}</p>
              <p className="text-sm text-red-500 font-bold mb-8 bg-red-50 px-4 py-3 rounded-xl">This action cannot be undone. The unit will be permanently removed from your fleet database.</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => { setIsDeleteConfirmOpen(false); setTruckToDelete(null); }}
                  className="flex-1 px-6 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTruck(truckToDelete.id)}
                  disabled={isSubmitting}
                  className="flex-1 bg-red-500 text-white px-6 py-4 rounded-2xl font-black hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Removing..." : "Yes, Remove"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Order Details Modal */}
      {isDetailsOpen && viewingOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-primary/50 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-white/20">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-black text-primary">Order Manifest</h3>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{viewingOrder.order_number}</p>
                </div>
              </div>
              <button onClick={() => setIsDetailsOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
              {/* Grid 1: Customer & Cargo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-accent pl-3">Client Contact</h4>
                  <div className="space-y-1">
                    <p className="font-heading font-black text-primary text-xl">{viewingOrder.customer_name}</p>
                    <p className="text-slate-500 font-bold flex items-center"><Mail className="h-3 w-3 mr-2 text-accent" /> {viewingOrder.email}</p>
                    <p className="text-slate-500 font-bold flex items-center"><ChevronRight className="h-3 w-3 mr-2 text-accent" /> {viewingOrder.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-accent pl-3">Cargo Specifications</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                      <span className="text-xs font-bold text-slate-500">Commodity</span>
                      <span className="text-xs font-black text-primary uppercase">{viewingOrder.goods_type}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                      <span className="text-xs font-bold text-slate-500">Weight Est.</span>
                      <span className="text-xs font-black text-primary">{viewingOrder.cargo_weight || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                      <span className="text-xs font-bold text-slate-500">Dimensions</span>
                      <span className="text-xs font-black text-primary">{viewingOrder.cargo_size || "Standard"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 2: Logistical Route */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-accent pl-3">Logistics Route</h4>
                <div className="relative pl-10 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:border-l-2 before:border-dashed before:border-slate-200">
                  <div className="relative">
                    <div className="absolute -left-[34px] top-0 w-[22px] h-[22px] bg-white border-4 border-slate-100 rounded-full z-10" />
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Origin Point</p>
                    <p className="text-sm font-bold text-primary">{viewingOrder.pickup_location}</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[34px] top-0 w-[22px] h-[22px] bg-accent border-4 border-accent/20 rounded-full z-10" />
                    <p className="text-[10px] font-black text-accent uppercase mb-1">Terminal Destination</p>
                    <p className="text-sm font-bold text-primary">{viewingOrder.delivery_location}</p>
                  </div>
                </div>
              </div>

              {/* Grid 3: Operational Notes */}
              {viewingOrder.additional_notes && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-accent pl-3">Agent Notes</h4>
                  <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 text-sm text-amber-900 font-medium leading-relaxed italic">
                    "{viewingOrder.additional_notes}"
                  </div>
                </div>
              )}

              {/* Footer Specs */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-50 text-[10px] font-black text-slate-400 uppercase">
                <span>Created: {new Date(viewingOrder.created_at).toLocaleString()}</span>
                <span>Last Activity: {new Date(viewingOrder.updated_at).toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="p-8 bg-slate-50/50 flex space-x-4">
              <button 
                onClick={() => { setIsDetailsOpen(false); setSelectedOrder(viewingOrder); setIsEditOrderOpen(true); }}
                className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg"
              >
                Modify Status
              </button>
              <button 
                onClick={() => setIsDetailsOpen(false)}
                className="flex-1 bg-white border border-slate-200 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                Close View
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -30, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 0 }}
            className="fixed top-6 right-6 z-[100] flex items-center space-x-3 bg-primary text-white px-6 py-4 rounded-[1.5rem] shadow-2xl border border-white/10 max-w-sm"
          >
            {toast.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400" />
            )}
            <span className="font-bold text-sm">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X className="h-4 w-4 text-white/40" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

