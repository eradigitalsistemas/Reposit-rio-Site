import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { Loader2, Activity, Mail, RefreshCcw, Smartphone, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function IntegrationsDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    whatsappClicks: 0,
    emailsSent: 0,
    emailsFailed: 0,
    syncSuccess: 0,
    syncFailed: 0,
  })
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [
        { count: waClicks },
        { count: emailSentCount },
        { count: emailFailedCount },
        { count: syncSuccessCount },
        { count: syncFailedCount },
        { data: recentLogs },
      ] = await Promise.all([
        supabase.from('whatsapp_clicks').select('*', { count: 'exact', head: true }),
        supabase
          .from('emails_sent')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'sent'),
        supabase
          .from('emails_sent')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'failed'),
        supabase
          .from('sync_logs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'success'),
        supabase
          .from('sync_logs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'failed'),
        supabase.from('sync_logs').select('*').order('created_at', { ascending: false }).limit(10),
      ])

      setStats({
        whatsappClicks: waClicks || 0,
        emailsSent: emailSentCount || 0,
        emailsFailed: emailFailedCount || 0,
        syncSuccess: syncSuccessCount || 0,
        syncFailed: syncFailedCount || 0,
      })
      setLogs(recentLogs || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const syncTotal = stats.syncSuccess + stats.syncFailed
  const syncFailRate = syncTotal > 0 ? (stats.syncFailed / syncTotal) * 100 : 0
  const emailTotal = stats.emailsSent + stats.emailsFailed
  const emailFailRate = emailTotal > 0 ? (stats.emailsFailed / emailTotal) * 100 : 0

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Monitoramento de Integrações</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral do status das integrações e sincronizações do sistema.
        </p>
      </div>

      {(syncFailRate > 5 || emailFailRate > 5) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenção!</AlertTitle>
          <AlertDescription>
            A taxa de falha de {syncFailRate > 5 ? 'sincronização com ERP' : 'envio de e-mails'}{' '}
            está acima de 5%. Verifique os logs detalhados.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cliques WhatsApp</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.whatsappClicks}</div>
            <p className="text-xs text-muted-foreground mt-1">Leads redirecionados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">E-mails Entregues</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.emailsSent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Falhas:{' '}
              <span className={stats.emailsFailed > 0 ? 'text-red-500 font-medium' : ''}>
                {stats.emailsFailed}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sincronizações ERP</CardTitle>
            <RefreshCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.syncSuccess}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Falhas:{' '}
              <span className={stats.syncFailed > 0 ? 'text-red-500 font-medium' : ''}>
                {stats.syncFailed}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Saúde</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.max(0, 100 - syncFailRate).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Sincronizações bem sucedidas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logs Recentes</CardTitle>
          <CardDescription>Últimas operações de integração registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum log registrado ainda.
              </p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          log.status === 'success'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.status.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium">{log.entity_type}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ID: {log.entity_id.substring(0, 8)}...
                      </span>
                    </div>
                    {log.error_message && (
                      <p className="text-sm text-red-600">{log.error_message}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Tentativas: {log.attempts}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
