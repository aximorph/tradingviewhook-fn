import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Filter, 
  Download, 
  Search,
  Calendar,
  ArrowUpDown,
  MoreHorizontal,
  Wifi,
  WifiOff
} from 'lucide-react';

interface SignalLog {
  id: string;
  timestamp: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  price: number;
  ip: string;
  status: 'sent' | 'failed' | 'pending';
}

const mockSignals: SignalLog[] = [
  {
    id: '1',
    timestamp: '2024-01-15T14:30:25Z',
    symbol: 'EURUSD',
    type: 'BUY',
    volume: 0.1,
    price: 1.0842,
    ip: '192.168.1.100',
    status: 'sent'
  },
  {
    id: '2',
    timestamp: '2024-01-15T14:28:15Z',
    symbol: 'GBPUSD',
    type: 'SELL',
    volume: 0.05,
    price: 1.2634,
    ip: '192.168.1.101',
    status: 'sent'
  },
  {
    id: '3',
    timestamp: '2024-01-15T14:25:42Z',
    symbol: 'USDJPY',
    type: 'BUY',
    volume: 0.2,
    price: 148.75,
    ip: '192.168.1.102',
    status: 'failed'
  },
  {
    id: '4',
    timestamp: '2024-01-15T14:22:18Z',
    symbol: 'AUDUSD',
    type: 'SELL',
    volume: 0.15,
    price: 0.7823,
    ip: '192.168.1.103',
    status: 'sent'
  },
  {
    id: '5',
    timestamp: '2024-01-15T14:20:05Z',
    symbol: 'EURUSD',
    type: 'BUY',
    volume: 0.08,
    price: 1.0838,
    ip: '192.168.1.104',
    status: 'pending'
  }
];

export const SignalMonitor: React.FC = () => {
  const [signals, setSignals] = useState<SignalLog[]>(mockSignals);
  const [filteredSignals, setFilteredSignals] = useState<SignalLog[]>(mockSignals);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof SignalLog>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isConnected, setIsConnected] = useState(true);
  const itemsPerPage = 10;

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new signal
        const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD'];
        const types: ('BUY' | 'SELL')[] = ['BUY', 'SELL'];
        const statuses: ('sent' | 'failed' | 'pending')[] = ['sent', 'failed', 'pending'];
        
        const newSignal: SignalLog = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          type: types[Math.floor(Math.random() * types.length)],
          volume: Math.round((Math.random() * 0.5 + 0.01) * 100) / 100,
          price: Math.round((Math.random() * 2 + 0.5) * 10000) / 10000,
          ip: `192.168.1.${Math.floor(Math.random() * 200) + 100}`,
          status: statuses[Math.floor(Math.random() * statuses.length)]
        };
        
        setSignals(prev => [newSignal, ...prev.slice(0, 19)]); // Keep only 20 most recent
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filter and sort signals
  useEffect(() => {
    let filtered = [...signals];
    
    if (searchTerm) {
      filtered = filtered.filter(signal =>
        signal.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signal.ip.includes(searchTerm) ||
        signal.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(signal => signal.status === statusFilter);
    }
    
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    setFilteredSignals(filtered);
    setCurrentPage(1);
  }, [signals, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field: keyof SignalLog) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Symbol', 'Type', 'Volume', 'Price', 'IP', 'Status'],
      ...filteredSignals.map(signal => [
        new Date(signal.timestamp).toLocaleString(),
        signal.symbol,
        signal.type,
        signal.volume.toString(),
        signal.price.toString(),
        signal.ip,
        signal.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signal-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      sent: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      failed: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        type === 'BUY'
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
      }`}>
        {type}
      </span>
    );
  };

  const paginatedSignals = filteredSignals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSignals.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Signal Monitor
          </h2>
          <div className="flex items-center space-x-2 mt-1">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Connected - Real-time monitoring active
                </span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600 dark:text-red-400">
                  Disconnected
                </span>
              </>
            )}
          </div>
        </div>
        
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by symbol, IP, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {[
                  { key: 'timestamp', label: 'Timestamp' },
                  { key: 'symbol', label: 'Symbol' },
                  { key: 'type', label: 'Type' },
                  { key: 'volume', label: 'Volume' },
                  { key: 'price', label: 'Price' },
                  { key: 'ip', label: 'IP Address' },
                  { key: 'status', label: 'Status' }
                ].map(column => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleSort(column.key as keyof SignalLog)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedSignals.map((signal) => (
                <tr key={signal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(signal.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {signal.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(signal.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {signal.volume}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {signal.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {signal.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(signal.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing{' '}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredSignals.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{filteredSignals.length}</span>{' '}
                  results
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredSignals.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Signals Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No signals match your current search criteria.
          </p>
        </div>
      )}
    </div>
  );
};