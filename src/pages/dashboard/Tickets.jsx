import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { TicketCheck, MessageSquare, X, Send, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const priorityColors = { low: 'badge-neutral', medium: 'badge-info', high: 'badge-warning', urgent: 'badge-danger' };
const statusColors = { open: 'badge-warning', 'in-progress': 'badge-info', resolved: 'badge-success', closed: 'badge-neutral' };

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');

  const fetchTickets = async () => {
    try {
      const res = await api.get(`/tickets?status=${filter}`);
      setTickets(res.data.data.tickets);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchTickets(); }, [filter]);

  const handleReply = async () => {
    if (!reply.trim()) return;
    try {
      await api.post(`/tickets/${selected._id}/message`, { content: reply });
      toast.success('Reply sent');
      setReply('');
      fetchTickets();
      // Refresh selected ticket
      const res = await api.get(`/tickets/${selected._id}`);
      setSelected(res.data.data.ticket);
    } catch { toast.error('Failed to send'); }
  };

  const updateTicketStatus = async (id, status) => {
    try {
      await api.put(`/tickets/${id}`, { status });
      toast.success(`Ticket ${status}`);
      fetchTickets();
      setSelected(null);
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Support Tickets</h1>
        <p className="text-surface-500 mt-1">Manage customer support requests</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'open', 'in-progress', 'resolved', 'closed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'}`}>
            {f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-1 space-y-3">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-surface-200 dark:bg-surface-800 animate-pulse" />)
          ) : tickets.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <TicketCheck className="w-12 h-12 mx-auto text-surface-300 mb-3" />
              <p className="font-medium text-surface-500">No tickets</p>
            </div>
          ) : tickets.map(ticket => (
            <button key={ticket._id} onClick={() => setSelected(ticket)}
              className={`w-full text-left glass-card p-4 hover:shadow-lg transition-all ${selected?._id === ticket._id ? 'ring-2 ring-primary-500' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{ticket.subject}</p>
                  <p className="text-xs text-surface-500 mt-1">{ticket.customerName || 'Anonymous'}</p>
                </div>
                <span className={priorityColors[ticket.priority]}>{ticket.priority}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={statusColors[ticket.status]}>{ticket.status}</span>
                <span className="text-xs text-surface-400 ml-auto">{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="glass-card flex flex-col h-[600px]">
              <div className="p-6 border-b border-surface-200 dark:border-surface-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{selected.subject}</h3>
                    <p className="text-sm text-surface-500 mt-1">#{selected.ticketNumber} • {selected.customerName}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateTicketStatus(selected._id, 'resolved')} className="btn-ghost text-xs text-emerald-500"><CheckCircle className="w-4 h-4" /></button>
                    <button onClick={() => setSelected(null)} className="btn-ghost"><X className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selected.messages?.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                      msg.sender === 'admin' ? 'bg-primary-500 text-white rounded-tr-md' :
                      msg.sender === 'system' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-tl-md' :
                      'bg-surface-100 dark:bg-surface-800 rounded-tl-md'
                    }`}>
                      <p className="text-xs font-semibold mb-1 opacity-70">{msg.sender}</p>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-surface-200 dark:border-surface-700">
                <div className="flex gap-2">
                  <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..."
                    className="flex-1 input-field !py-2.5" onKeyDown={e => e.key === 'Enter' && handleReply()} />
                  <button onClick={handleReply} className="btn-primary !px-4"><Send className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center h-[600px] flex flex-col items-center justify-center">
              <MessageSquare className="w-16 h-16 text-surface-300 mb-4" />
              <p className="font-medium text-surface-500">Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tickets;
