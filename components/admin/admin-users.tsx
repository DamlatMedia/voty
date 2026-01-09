"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Trash2, Edit2, Check, X, Plus } from "lucide-react"

interface User {
  id: string
  full_name: string
  email: string
  phone_number?: string
  subscription_status: string
  created_at: string
  pic?: string
}

interface AdminUsersProps {
  adminId: string
}

export default function AdminUsers({ adminId }: AdminUsersProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, any>>({})
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/users")
      const data = await response.json()
      if (data.success) {
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const startEdit = (user: User) => {
    setEditingId(user.id)
    setEditData({
      full_name: user.full_name,
      phone_number: user.phone_number || "",
      subscription_status: user.subscription_status,
    })
  }

  const handleSaveEdit = async (userId: string) => {
    setActionLoading(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      })

      const data = await response.json()
      if (data.success) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, ...editData } : u)))
        setEditingId(null)
        setEditData({})
      }
    } catch (error) {
      console.error("Error updating user:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return

    setActionLoading(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        setUsers(users.filter((u) => u.id !== userId))
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-2">Manage Users</h2>
        <p className="text-muted-foreground">View and manage all platform users</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-4 top-3 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-card border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </motion.div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full"
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card border border-primary/20 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black/50 border-b border-primary/20">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-primary/10 hover:bg-black/30 transition"
                    >
                      {editingId === user.id ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editData.full_name}
                              onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                              className="w-full px-2 py-1 bg-background border border-primary/20 rounded text-white text-sm"
                            />
                          </td>
                          <td className="px-6 py-4 text-muted-foreground text-sm">{user.email}</td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editData.phone_number}
                              onChange={(e) => setEditData({ ...editData, phone_number: e.target.value })}
                              className="w-full px-2 py-1 bg-background border border-primary/20 rounded text-white text-sm"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={editData.subscription_status}
                              onChange={(e) => setEditData({ ...editData, subscription_status: e.target.value })}
                              className="px-2 py-1 bg-background border border-primary/20 rounded text-white text-sm"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="suspended">Suspended</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            <motion.button
                              onClick={() => handleSaveEdit(user.id)}
                              disabled={actionLoading === user.id}
                              className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition disabled:opacity-50"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="Save"
                            >
                              <Check size={16} />
                            </motion.button>
                            <motion.button
                              onClick={cancelEdit}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="Cancel"
                            >
                              <X size={16} />
                            </motion.button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 text-white">{user.full_name}</td>
                          <td className="px-6 py-4 text-muted-foreground text-sm">{user.email}</td>
                          <td className="px-6 py-4 text-muted-foreground text-sm">{user.phone_number || "N/A"}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                user.subscription_status === "active"
                                  ? "bg-green-500/20 text-green-400"
                                  : user.subscription_status === "suspended"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-gray-500/20 text-gray-400"
                              }`}
                            >
                              {user.subscription_status || "inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            <motion.button
                              onClick={() => startEdit(user)}
                              className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={actionLoading === user.id}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </td>
                        </>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
