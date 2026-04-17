const rawUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
const API_BASE_URL = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`;

export const api = {
  // Orders
  createOrder: async (orderData: any) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error("Failed to create order");
    return response.json();
  },

  trackOrder: async (orderNumber: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/track/${orderNumber}`);
    if (!response.ok) throw new Error("Order not found");
    return response.json();
  },

  // Trucks
  getTrucks: async (status?: string) => {
    const url = status ? `${API_BASE_URL}/trucks?status=${status}` : `${API_BASE_URL}/trucks`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch trucks");
    return response.json();
  },

  // Reviews
  getReviews: async () => {
    const response = await fetch(`${API_BASE_URL}/reviews`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return response.json();
  },

  submitReview: async (reviewData: any) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) throw new Error("Failed to submit review");
    return response.json();
  },

  // Contact
  submitContact: async (contactData: any) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    });
    if (!response.ok) throw new Error("Failed to send message");
    return response.json();
  },

  // Admin (Basic auth wrapper)
  adminLogin: async (credentials: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }
    return response.json();
  },

  getDashboardStats: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Unauthorized");
    return response.json();
  },

  getAdminOrders: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch admin orders");
    return response.json();
  },

  getAdminTrucks: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/trucks`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch trucks");
    return response.json();
  },

  getAdminMessages: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/messages`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch messages");
    return response.json();
  },

  getAdminCustomers: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/customers`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch customers");
    return response.json();
  },

  updateOrderStatus: async (token: string, orderId: number, status: string, truckId?: number) => {
    const params = new URLSearchParams({ new_status: status });
    if (truckId) params.append("assigned_truck_id", truckId.toString());

    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status?${params.toString()}`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to update order status");
    return response.json();
  },

  updateTruck: async (truckId: number, truckData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/trucks/${truckId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(truckData),
    });
    if (!response.ok) throw new Error("Failed to update truck");
    return response.json();
  },

  addTruck: async (token: string, truckData: any) => {
    const response = await fetch(`${API_BASE_URL}/trucks`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(truckData),
    });
    if (!response.ok) throw new Error("Failed to add truck");
    return response.json();
  },

  uploadImage: async (token: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/uploads/image`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to upload image");
    return response.json();
  },

  deleteTruck: async (token: string, truckId: number) => {
    const response = await fetch(`${API_BASE_URL}/trucks/${truckId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to delete truck");
    return response.json();
  },

  searchOrders: async (token: string, query: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/search/${encodeURIComponent(query)}`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Search failed");
    return response.json();
  }
};
