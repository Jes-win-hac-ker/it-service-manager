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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Customer Name *</label>
              <input name="customer_name" value={formData.customer_name} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" placeholder="Link to a customer" required />
            </div>
            <div>
              <label className="text-sm font-medium">Product Name</label>
              <input name="product_name" value={formData.product_name} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" required />
            </div>
            <div>
              <label className="text-sm font-medium">Invoice #</label>
              <input name="invoice_number" value={formData.invoice_number} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" required />
            </div>
            <div>
              <label className="text-sm font-medium">Product Serial #</label>
              <input name="product_serial_number" value={formData.product_serial_number} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Shop Name</label>
              <input name="shop_name" value={formData.shop_name} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" required />
            </div>
            <div>
              <label className="text-sm font-medium">Purchase Date</label>
              <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" required />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Add Record
            </button>
          </form>
        </div>
      </div>

      {/* List Section */}
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Purchase History</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search by customer name..."
                value={historySearchTerm}
                onChange={(e) => setHistorySearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border rounded-lg"
              />
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {isLoading ? <p>Loading...</p> : filteredPurchases.map(p => (
                    <div key={p.id} className="border p-4 rounded-lg">
                        <p className="font-bold flex items-center"><Package className="h-4 w-4 mr-2" />{p.product_name} <span className="ml-auto text-sm font-normal text-gray-500">{p.customer_name}</span></p>
                        <div className="text-sm text-gray-600 grid grid-cols-2 gap-2 mt-2">
                            <p className="flex items-center"><Hash className="h-4 w-4 mr-2" />{p.invoice_number}</p>
                            <p className="flex items-center"><Store className="h-4 w-4 mr-2" />{p.shop_name}</p>
                            <p className="flex items-center"><Calendar className="h-4 w-4 mr-2" />{formatDate(p.purchase_date)}</p>
                            <p className="flex items-center"><Hash className="h-4 w-4 mr-2" />S/N: {p.product_serial_number}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseManager;
