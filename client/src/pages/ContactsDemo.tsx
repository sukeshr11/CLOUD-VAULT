import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, Pencil, Plus, RefreshCw, Search, Trash2, Users, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
};

type ContactForm = Pick<Contact, 'name' | 'email' | 'phone'>;
type ApiHealth = { database: string };

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const body: { error?: string; message?: string } = await response.json().catch(() => ({}));
    throw new Error(body.error || body.message || `Request failed (${response.status}).`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

const emptyForm: ContactForm = { name: '', email: '', phone: '' };

export default function ContactsDemo() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [form, setForm] = useState<ContactForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [databaseConnected, setDatabaseConnected] = useState(false);
  const [error, setError] = useState('');

  const loadContacts = useCallback(async () => {
    try {
      setContacts(await request<Contact[]>('/contacts'));
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load contacts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void request<ApiHealth>('/health')
      .then((health) => {
        if (active) setDatabaseConnected(health.database === 'connected');
      })
      .catch(() => {
        if (active) setDatabaseConnected(false);
      });

    void request<Contact[]>('/contacts')
      .then((items) => {
        if (active) setContacts(items);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load contacts.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setLoading(true);
    try {
      await request<Contact>(editingId ? `/contacts/${editingId}` : '/contacts', {
        method: editingId ? 'PATCH' : 'POST',
        body: JSON.stringify(form),
      });
      resetForm();
      await loadContacts();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save contact.');
    } finally {
      setSaving(false);
    }
  };

  const editContact = (contact: Contact) => {
    setForm({ name: contact.name, email: contact.email, phone: contact.phone });
    setEditingId(contact._id);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeContact = async (contact: Contact) => {
    if (!window.confirm(`Delete ${contact.name}?`)) return;
    setError('');
    try {
      await request<void>(`/contacts/${contact._id}`, { method: 'DELETE' });
      setContacts((current) => current.filter((item) => item._id !== contact._id));
      if (editingId === contact._id) resetForm();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete contact.');
    }
  };

  const visibleContacts = contacts.filter((contact) =>
    `${contact.name} ${contact.email} ${contact.phone}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-screen px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">MongoDB starter app</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contacts</h1>
            <p className="mt-2 text-slate-600">A simple React + Express app backed by MongoDB.</p>
          </div>
          <div className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${databaseConnected ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
            <span className={`h-2 w-2 rounded-full ${databaseConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {databaseConnected ? 'MongoDB connected' : 'MongoDB not connected'}
          </div>
        </header>

        {error && (
          <div role="alert" className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span>{error}</span>
            <button type="button" onClick={() => { setLoading(true); void loadContacts(); }} className="shrink-0 font-semibold underline">Retry</button>
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-700"><Plus size={20} /></div>
            <div>
              <h2 className="text-lg font-semibold">{editingId ? 'Edit contact' : 'Add a contact'}</h2>
              <p className="text-sm text-slate-500">Save a contact to your MongoDB database.</p>
            </div>
          </div>
          <form onSubmit={submitContact} className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Name
              <input required maxLength={80} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Jane Smith" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Email
              <input required type="email" maxLength={254} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="jane@example.com" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            </label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Phone <span className="font-normal text-slate-400">(optional)</span>
              <input maxLength={30} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+1 555 0100" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            </label>
            <div className="flex gap-3 pt-1 sm:col-span-2">
              <button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                <Plus size={16} />{saving ? 'Saving...' : editingId ? 'Save changes' : 'Add contact'}
              </button>
              {editingId && <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><X size={16} />Cancel</button>}
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700"><Users size={20} /></div>
              <div>
                <h2 className="text-lg font-semibold">Your contacts</h2>
                <p className="text-sm text-slate-500">{contacts.length} saved {contacts.length === 1 ? 'contact' : 'contacts'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <label className="relative block flex-1 sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search contacts" aria-label="Search contacts" className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              </label>
              <button type="button" onClick={() => { setLoading(true); void loadContacts(); }} aria-label="Refresh contacts" className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"><RefreshCw size={18} /></button>
            </div>
          </div>

          {loading ? (
            <p className="p-10 text-center text-sm text-slate-500">Loading contacts...</p>
          ) : visibleContacts.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <Users size={28} className="mx-auto mb-3 text-slate-300" />
              <p className="font-medium text-slate-700">{search ? 'No matching contacts' : 'No contacts yet'}</p>
              <p className="mt-1 text-sm text-slate-500">{search ? 'Try another search.' : 'Add your first contact using the form above.'}</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {visibleContacts.map((contact) => (
                <li key={contact._id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{contact.name}</p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-600"><Mail size={14} className="shrink-0 text-slate-400" />{contact.email}</p>
                    {contact.phone && <p className="mt-1 text-sm text-slate-500">{contact.phone}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => editContact(contact)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"><Pencil size={14} />Edit</button>
                    <button type="button" onClick={() => void removeContact(contact)} aria-label={`Delete ${contact.name}`} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"><Trash2 size={14} />Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <p className="mt-5 text-center text-xs text-slate-400">Contact records are stored by the backend and visible in MongoDB Compass.</p>
      </div>
    </main>
  );
}
