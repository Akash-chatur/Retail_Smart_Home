import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Order {
  id: number;
  userId: number;
  confirmation: string;
  deliveryDate: string;
  status: string;
}

interface OrderContextType {
  orders: Order[];
  refreshOrders: () => void; 
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: number) => void;
  cancelOrder: (id: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    if (user?.id) {
      try {
        console.log("Fetching orders for userId:", user.id);
        const response = await fetch(`http://localhost:8082/MyServletProject/OrderServlet?userId=${user.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("fetched orders = ", data);
          setOrders(data.orders); // Set orders from backend response
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const refreshOrders = () => {
    fetchOrders(); // Call fetchOrders to refresh order data
  };

  const addOrder = (order: Order) => {
    const updatedOrders = [...orders, order];
    setOrders(updatedOrders);
    //localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const updateOrder = (updatedOrder: Order) => {
    const updatedOrders = orders.map(order => order.id === updatedOrder.id ? updatedOrder : order);
    setOrders(updatedOrders);
    //localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const deleteOrder = (id: number) => {
    const updatedOrders = orders.filter(order => order.id !== id);
    setOrders(updatedOrders);
    //localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const cancelOrder = (id: number) => {
    const updatedOrders = orders.map(order =>
      order.id === id ? { ...order, status: 'Canceled' } : order
    );
    setOrders(updatedOrders);
    //localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  return (
    <OrderContext.Provider value={{ orders, refreshOrders, addOrder, updateOrder, deleteOrder, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};