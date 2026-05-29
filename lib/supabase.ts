import { createClient } from '@supabase/supabase-js';

// Support both VITE_ prefixed (for Vite) and non-prefixed (for v0/Vercel) env vars
// In Vite production builds, only VITE_ prefixed vars are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL || 
  'https://hbfxddisskfpautitqpm.supabase.co';

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY;

// Debug logging for production issues
console.log('[v0] Supabase URL configured:', supabaseUrl ? 'Yes' : 'No');
console.log('[v0] Supabase Anon Key configured:', supabaseAnonKey ? 'Yes (length: ' + supabaseAnonKey?.length + ')' : 'No');

if (!supabaseAnonKey) {
  console.warn('[v0] Supabase anon key not set. Database operations will fail.');
  console.warn('[v0] Available env vars:', Object.keys(import.meta.env).filter(k => k.includes('SUPABASE') || k.includes('PUBLIC')));
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Database types for TypeScript
export interface Client {
  id: string;
  client_code: string;
  company_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  zip_code: string | null;
  gst: string | null;
  pan: string | null;
  industry_type: string | null;
  business_type: string;
  contract_type: string;
  pricing_tier: string;
  payment_terms: string;
  status: string;
  contract_start: string | null;
  contract_end: string | null;
  total_orders: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  vendor_code: string;
  company_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  zip_code: string | null;
  gst: string | null;
  pan: string | null;
  category: string | null;
  rating: number;
  status: string;
  payment_terms: string;
  bank_name: string | null;
  bank_account: string | null;
  ifsc_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  product_code: string;
  name: string;
  description: string | null;
  category: string | null;
  sub_category: string | null;
  unit: string;
  hsn_code: string | null;
  base_price: number;
  tax_rate: number;
  vendor_id: string | null;
  status: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  client_id: string | null;
  vendor_id: string | null;
  order_date: string;
  expected_delivery: string | null;
  actual_delivery: string | null;
  status: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  payment_status: string;
  shipping_address: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  tax_amount: number;
  total_price: number;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  department: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// API helper functions
export const clientsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Client[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Client;
  },

  async create(client: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    if (error) throw error;
    return data as Client;
  },

  async update(id: string, updates: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Client;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

export const vendorsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Vendor[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Vendor;
  },

  async create(vendor: Partial<Vendor>) {
    const { data, error } = await supabase
      .from('vendors')
      .insert(vendor)
      .select()
      .single();
    if (error) throw error;
    return data as Vendor;
  },

  async update(id: string, updates: Partial<Vendor>) {
    const { data, error } = await supabase
      .from('vendors')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Vendor;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

export const productsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Product[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Product;
  },

  async create(product: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  },

  async update(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

export const ordersApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, clients(company_name), vendors(company_name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, clients(company_name), vendors(company_name), order_items(*, products(name))')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(order: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    if (error) throw error;
    return data as Order;
  },

  async update(id: string, updates: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Order;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};
