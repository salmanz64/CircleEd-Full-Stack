"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TokenBadge } from "@/components/TokenBadge"
import { usersAPI, transactionsAPI, Transaction } from "@/lib/api"
import { ArrowUpCircle, ArrowDownCircle, Trophy, Award, RefreshCw } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

export default function WalletPage() {
  const [userData, setUserData] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [user, txns] = await Promise.all([
        usersAPI.getCurrentUser(),
        transactionsAPI?.getAll?.() || Promise.resolve([]),
      ])
      setUserData(user)
      setTransactions(txns)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load wallet data")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true)
      const [user, txns] = await Promise.all([
        usersAPI.getCurrentUser(),
        transactionsAPI?.getAll?.() || Promise.resolve([]),
      ])
      setUserData(user)
      setTransactions(txns)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh wallet data")
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    
    // Refresh wallet every 30 seconds to catch any token balance changes
    const interval = setInterval(handleRefresh, 30000)
    
    // Listen for token updates from bookings page
    const handleTokensUpdated = () => {
      handleRefresh()
    }
    window.addEventListener('tokensUpdated', handleTokensUpdated)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('tokensUpdated', handleTokensUpdated)
    }
  }, [fetchData, handleRefresh])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading wallet...</p>
        </div>
      </div>
    )
  }

  const tokenBalance = userData?.token_balance || 0
  const totalEarned = transactions
    .filter((t) => t.type === "earn")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalSpent = Math.abs(
    transactions
      .filter((t) => t.type === "spend")
      .reduce((sum, t) => sum + t.amount, 0)
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tokens</h1>
          <p className="text-gray-600">Manage your token balance and transaction history</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-white/90">Current Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <TokenBadge amount={tokenBalance} variant="large" className="bg-white/20 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Total Earned</p>
              <p className="text-2xl font-bold">{totalEarned}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalEarned}</div>
            <p className="text-xs text-muted-foreground mt-2">
              From teaching sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalSpent}</div>
            <p className="text-xs text-muted-foreground mt-2">
              On learning sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {transaction.type === "earn" ? (
                      <ArrowUpCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <ArrowDownCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${
                      transaction.type === "earn" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.type === "earn" ? "+" : "-"}
                    {Math.abs(transaction.amount)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No transactions yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

