import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, PlusCircle, Calendar, Hash, Store, Package, Search } from 'lucide-react';
import { supabaseApiService } from '../services/supabaseApi';
import toast from 'react-hot-toast';
import { format, isValid } from 'date-fns';

interface Purchase {
  id: string;
  created_at: string;
  invoice_number: string;
  product_name: string;
  product_serial_number: string;
  shop_name: string;
  purchase_date: string;
  customer_name: string; 
}

type PurchaseFormData = Omit<Purchase, 'id' | 'created_at'>;

const PurchaseManager: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [formData, setFormData] = useState<PurchaseFormData>({
    invoice_number: '',
    product_name: '',
    product_serial_number: '',
    shop_name: '',
    purchase_date: format(new Date(), 'yyyy-MM-dd'),
    customer_name: '',
  });

  const fetchPurchases = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await supabaseApiService.getPurchases(); 
      setPurchases(data);
    } catch (error) {
      toast.error('Could not fetch purchase records.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name) {
      toast.error("Please enter the customer's name for this purchase.");
      return;
    }
    try {
      await supabaseApiService.addPurchase(formData);
      toast.success('Purchase record added!');
      setFormData({
        invoice_number: '',
        product_name: '',
        product_serial_number: '',
        shop_name: '',
        purchase_date: format(new Date(), 'yyyy-MM-dd'),
        customer_name: '',
      });
      fetchPurchases();
    } catch (error) {
      toast.error('Failed to add purchase record.');
      console.error(error);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return isValid(d) ? format(d, 'PPP') : 'Invalid Date';
  };

  const filteredPurchases = purchases.filter(p => 
    p.customer_name.toLowerCase().includes(historySearchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <PlusCircle className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Add Purchase</h2>
          </div>
          <form onSubmit={handleSubmit
