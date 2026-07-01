import { useState, useEffect, useCallback } from 'react'
import { FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaLinkedin, FaChevronDown, FaChevronUp } from 'react-icons/fa'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Matches SpeakerApplication model: firstName, lastName, email, linkedinLink, expertiseDescription
interface SpeakerApplication {
    id: number
    firstName: string
    lastName: string
    email: string
    linkedinLink: string | null
    expertiseDescription: string
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

export default function AdminSpeaker() {
    const [applications, setApplications] = useState<SpeakerApplication[]>([])
    const [filtered, setFiltered] = useState<SpeakerApplication[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
    const [search, setSearch] = useState('')
    const [expandedId, setExpandedId] = useState<number | null>(null)

    const fetchApplications = useCallback(async (page = 1) => {
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
                `${API_URL}/api/speaker-application/applications?page=${page}&limit=${PAGE_SIZE}`,
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
                const rows: SpeakerApplication[] = data.data.applications
                setApplications(rows)
                setFiltered(rows)
                setPagination(data.data.pagination)
                setCurrentPage(page)
            } else {
                setError(data.message || 'Failed to fetch applications')
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to connect to the server'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchApplications(1)
    }, [fetchApplications])

    // Client-side search filter
    useEffect(() => {
        if (!search.trim()) {
            setFiltered(applications)
            return
        }
        const q = search.toLowerCase()
        setFiltered(
            applications.filter(a =>
                a.firstName?.toLowerCase().includes(q) ||
                a.lastName?.toLowerCase().includes(q) ||
                a.email?.toLowerCase().includes(q) ||
                a.expertiseDescription?.toLowerCase().includes(q) ||
                a.linkedinLink?.toLowerCase().includes(q)
            )
        )
    }, [search, applications])

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this speaker application? This action cannot be undone.')) {
            return
        }

        setDeleteLoading(id)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setError('Not authenticated')
                return
            }

            const response = await fetch(`${API_URL}/api/speaker-application/applications/${id}`, {
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
                throw new Error('Failed to delete application')
            }

            const data = await response.json()
            if (data.success) {
                setApplications(prev => prev.filter(a => a.id !== id))
                setFiltered(prev => prev.filter(a => a.id !== id))
                if (pagination) {
                    setPagination({ ...pagination, total: pagination.total - 1 })
                }
            } else {
                setError(data.message || 'Failed to delete application')
            }
        } catch (_err) {
            setError('Failed to delete application')
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
        const source = search.trim() ? filtered : applications
        if (source.length === 0) return

        const headers = ['ID', 'First Name', 'Last Name', 'Email', 'LinkedIn', 'Expertise Description', 'Application Date']
        const rows = source.map(a => [
            a.id,
            a.firstName ?? '',
            a.lastName ?? '',
            a.email ?? '',
            a.linkedinLink ?? '',
            a.expertiseDescription ?? '',
            formatDate(a.createdAt),
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `speaker-applications-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const header = (
        <div className="mb-10 flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Speaker Applications</h1>
                <p className="text-gray-500">Review industry experts and thought leaders looking to speak at the summit.</p>
                {pagination && (
                    <p className="text-sm text-gray-400 mt-1">
                        {search.trim()
                            ? `Showing ${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${search}" (out of ${pagination.total} total)`
                            : `${pagination.total.toLocaleString()} total application${pagination.total !== 1 ? 's' : ''} · Page ${currentPage} of ${pagination.totalPages}`
                        }
                    </p>
                )}
            </div>
            <button
                onClick={exportToCSV}
                disabled={(search.trim() ? filtered : applications).length === 0}
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
                        onClick={() => fetchApplications(currentPage)}
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
                    placeholder="Search by name, email, or expertise…"
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
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">LinkedIn</th>
                                <th className="px-6 py-4">Expertise / Bio</th>
                                <th className="px-6 py-4">Applied</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {filtered.map((app, idx) => (
                                <>
                                    <tr
                                        key={app.id}
                                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                                        onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                                    >
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400">
                                            {(currentPage - 1) * PAGE_SIZE + idx + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="font-medium text-gray-900">{app.firstName} {app.lastName}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{app.email}</td>
                                        <td className="px-6 py-4">
                                            {app.linkedinLink ? (
                                                <a
                                                    href={app.linkedinLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={e => e.stopPropagation()}
                                                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:underline text-sm"
                                                    title={app.linkedinLink}
                                                >
                                                    <FaLinkedin className="flex-shrink-0" />
                                                    <span className="truncate max-w-[140px]">View Profile</span>
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <p className="text-sm text-gray-600 line-clamp-2" title={app.expertiseDescription}>
                                                {app.expertiseDescription}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                                            {formatDate(app.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <span className="text-gray-300 text-sm">
                                                    {expandedId === app.id ? <FaChevronUp /> : <FaChevronDown />}
                                                </span>
                                                <button
                                                    onClick={e => { e.stopPropagation(); handleDelete(app.id) }}
                                                    disabled={deleteLoading === app.id}
                                                    className="text-red-500 hover:text-red-600 transition-colors font-medium text-sm disabled:opacity-50"
                                                    title="Delete application"
                                                >
                                                    {deleteLoading === app.id ? (
                                                        <span className="animate-spin inline-block">⟳</span>
                                                    ) : (
                                                        <FaTrash />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded detail row — shows full expertise description */}
                                    {expandedId === app.id && (
                                        <tr key={`${app.id}-expanded`} className="bg-blue-50/30">
                                            <td colSpan={7} className="px-6 py-5">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                                                        <p className="text-gray-800">{app.firstName} {app.lastName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                                                        <p className="text-gray-800">{app.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">LinkedIn Profile</p>
                                                        {app.linkedinLink ? (
                                                            <a
                                                                href={app.linkedinLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline break-all"
                                                            >
                                                                {app.linkedinLink}
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-400">Not provided</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Application Date</p>
                                                        <p className="text-gray-800">{formatDate(app.createdAt)}</p>
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Expertise / Proposed Talk Description</p>
                                                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap bg-white rounded-lg p-3 border border-gray-100">
                                                            {app.expertiseDescription}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        {search.trim()
                            ? `No applications match "${search}".`
                            : 'No speaker applications found in the database.'
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
                            onClick={() => fetchApplications(currentPage - 1)}
                            disabled={!pagination.hasPrevPage}
                            className="flex items-center gap-1 px-3 md:px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <FaChevronLeft className="text-xs" /> <span className="hidden sm:inline">Previous</span>
                        </button>

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
                                        onClick={() => fetchApplications(p as number)}
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
                            onClick={() => fetchApplications(currentPage + 1)}
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
