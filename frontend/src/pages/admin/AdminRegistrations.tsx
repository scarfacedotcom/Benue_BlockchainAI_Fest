import { useState, useEffect, useCallback } from 'react'
import { FaTrash, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Matches the User model fields: firstName, lastName, corporateEmail, phone, industry, city, country
interface Registration {
    id: number
    firstName: string
    lastName: string
    corporateEmail: string
    phone: string
    industry: string | null
    city: string | null
    country: string | null
    createdAt: string
    updatedAt: string
}

interface Pagination {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

const PAGE_SIZE = 50

export default function AdminRegistrations() {
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [filtered, setFiltered] = useState<Registration[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
    const [search, setSearch] = useState('')

    const fetchRegistrations = useCallback(async (page = 1) => {
        setLoading(true)
        setError(null)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setError('Not authenticated')
                setLoading(false)
                return
            }

            const response = await fetch(
                `${API_URL}/api/admin/users?page=${page}&limit=${PAGE_SIZE}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token')
                    window.location.href = '/admin/login'
                    return
                }
                throw new Error(`Server error: ${response.status}`)
            }

            const data = await response.json()
            if (data.success) {
                const rows: Registration[] = data.data.users
                setRegistrations(rows)
                setFiltered(rows)
                setPagination(data.data.pagination)
                setCurrentPage(page)
            } else {
                setError(data.message || 'Failed to fetch registrations')
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to connect to the server'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchRegistrations(1)
    }, [fetchRegistrations])

    // Client-side search filter
    useEffect(() => {
        if (!search.trim()) {
            setFiltered(registrations)
            return
        }
        const q = search.toLowerCase()
        setFiltered(
            registrations.filter(r =>
                r.firstName?.toLowerCase().includes(q) ||
                r.lastName?.toLowerCase().includes(q) ||
                r.corporateEmail?.toLowerCase().includes(q) ||
                r.phone?.toLowerCase().includes(q) ||
                r.industry?.toLowerCase().includes(q) ||
                r.city?.toLowerCase().includes(q) ||
                r.country?.toLowerCase().includes(q)
            )
        )
    }, [search, registrations])

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
            return
        }

        setDeleteLoading(id)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setError('Not authenticated')
                return
            }

            const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token')
                    window.location.href = '/admin/login'
                    return
                }
                throw new Error('Failed to delete registration')
            }

            const data = await response.json()
            if (data.success) {
                setRegistrations(prev => prev.filter(r => r.id !== id))
                setFiltered(prev => prev.filter(r => r.id !== id))
                if (pagination) {
                    setPagination({ ...pagination, total: pagination.total - 1 })
                }
            } else {
                setError(data.message || 'Failed to delete registration')
            }
        } catch (_err) {
            setError('Failed to delete registration')
        } finally {
            setDeleteLoading(null)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const exportToCSV = () => {
        const source = search.trim() ? filtered : registrations
        if (source.length === 0) return

        const headers = ['ID', 'First Name', 'Last Name', 'Corporate Email', 'Phone', 'Industry', 'City', 'Country', 'Registration Date']
        const rows = source.map(r => [
            r.id,
            r.firstName ?? '',
            r.lastName ?? '',
            r.corporateEmail ?? '',
            r.phone ?? '',
            r.industry ?? '',
            r.city ?? '',
            r.country ?? '',
            formatDate(r.createdAt),
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const header = (
        <div className="mb-10 flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrations</h1>
                <p className="text-gray-500">All general event attendees registered in the database.</p>
                {pagination && (
                    <p className="text-sm text-gray-400 mt-1">
                        {search.trim()
                            ? `Showing ${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${search}" (out of ${pagination.total} total)`
                            : `${pagination.total.toLocaleString()} total registration${pagination.total !== 1 ? 's' : ''} · Page ${currentPage} of ${pagination.totalPages}`
                        }
                    </p>
                )}
            </div>
            <button
                onClick={exportToCSV}
                disabled={(search.trim() ? filtered : registrations).length === 0}
                className="bg-primary hover:bg-green text-secondary hover:text-white font-bold py-2 px-6 rounded-lg transition-all shadow-md w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Export CSV
            </button>
        </div>
    )

    if (loading) {
        return (
            <div>
                {header}
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div>
                {header}
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                    <span>⚠️</span>
                    <span>{error}</span>
                    <button
                        onClick={() => fetchRegistrations(currentPage)}
                        className="ml-auto text-sm underline hover:no-underline"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div>
            {header}

            {/* Search bar */}
            <div className="mb-4 relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name, email, phone, industry, city, or country…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm font-medium">
                                <th className="px-6 py-4">#</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Corporate Email</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Industry</th>
                                <th className="px-6 py-4">City</th>
                                <th className="px-6 py-4">Country</th>
                                <th className="px-6 py-4">Registered</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {filtered.map((r, idx) => (
                                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-400">
                                        {(currentPage - 1) * PAGE_SIZE + idx + 1}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {r.firstName} {r.lastName}
                                    </td>
                                    <td className="px-6 py-4 text-sm">{r.corporateEmail || '—'}</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">{r.phone || '—'}</td>
                                    <td className="px-6 py-4 text-sm">{r.industry || '—'}</td>
                                    <td className="px-6 py-4 text-sm">{r.city || '—'}</td>
                                    <td className="px-6 py-4 text-sm">{r.country || '—'}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                                        {formatDate(r.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            disabled={deleteLoading === r.id}
                                            className="text-red-500 hover:text-red-600 transition-colors font-medium text-sm disabled:opacity-50"
                                            title="Delete registration"
                                        >
                                            {deleteLoading === r.id ? (
                                                <span className="animate-spin inline-block">⟳</span>
                                            ) : (
                                                <FaTrash />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        {search.trim()
                            ? `No registrations match "${search}".`
                            : 'No registrations found in the database.'
                        }
                    </div>
                )}
            </div>

            {/* Pagination controls */}
            {pagination && pagination.totalPages > 1 && !search.trim() && (
                <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 text-center md:text-left">
                        Page {currentPage} of {pagination.totalPages}
                        <br className="md:hidden" />
                        <span className="hidden md:inline">&nbsp;·&nbsp;</span>
                        {pagination.total.toLocaleString()} total records
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                            onClick={() => fetchRegistrations(currentPage - 1)}
                            disabled={!pagination.hasPrevPage}
                            className="flex items-center gap-1 px-3 md:px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <FaChevronLeft className="text-xs" /> <span className="hidden sm:inline">Previous</span>
                        </button>

                        {/* Page number pills */}
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                            .filter(p => Math.abs(p - currentPage) <= 1 || p === 1 || p === pagination.totalPages)
                            .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...')
                                acc.push(p)
                                return acc
                            }, [])
                            .map((p, i) =>
                                p === '...' ? (
                                    <span key={`ellipsis-${i}`} className="px-1 md:px-2 text-gray-400">…</span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => fetchRegistrations(p as number)}
                                        className={`w-8 h-8 md:w-9 md:h-9 rounded-lg text-sm font-medium transition-colors ${
                                            currentPage === p
                                                ? 'bg-primary text-white'
                                                : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )
                        }

                        <button
                            onClick={() => fetchRegistrations(currentPage + 1)}
                            disabled={!pagination.hasNextPage}
                            className="flex items-center gap-1 px-3 md:px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="hidden sm:inline">Next</span> <FaChevronRight className="text-xs" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
