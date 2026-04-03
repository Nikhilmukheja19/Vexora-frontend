import { useState, useEffect } from 'react';
import api from '../../services/api';
import { MessageSquare } from 'lucide-react';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/chat/business');
        setChats(res.data.data.chats);
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Chat History</h1>
        <p className="text-surface-500 mt-1">View customer chat conversations</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {chats.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto text-surface-300 mb-3" />
              <p className="text-surface-500">No chats yet</p>
            </div>
          ) : chats.map(c => (
            <button key={c._id} onClick={() => setSelected(c)}
              className={`w-full text-left glass-card p-4 hover:shadow-lg transition-all ${selected?._id === c._id ? 'ring-2 ring-primary-500' : ''}`}>
              <p className="font-semibold text-sm">{c.customerName || 'Visitor'}</p>
              <p className="text-xs text-surface-500 mt-1 truncate">{c.messages?.[c.messages.length-1]?.content}</p>
            </button>
          ))}
        </div>
        <div className="lg:col-span-2">
          {selected ? (
            <div className="glass-card flex flex-col h-[600px]">
              <div className="p-6 border-b border-surface-200 dark:border-surface-700">
                <h3 className="font-bold">{selected.customerName}</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {selected.messages?.map((m,i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : ''}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary-500 text-white' : 'bg-surface-100 dark:bg-surface-800'}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center h-[600px] flex items-center justify-center">
              <p className="text-surface-500">Select a chat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
