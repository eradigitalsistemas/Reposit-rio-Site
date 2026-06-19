import { useState, useEffect, useMemo } from 'react'
import { jsPDF } from 'jspdf'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Loader2, FileText, Search, Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  getPsychoRisk,
  getRiskLevelKey,
  PSYCHO_FEEDBACK,
  PSYCHO_DIMENSIONS,
} from '@/lib/psycho-eval'
import { formatCNPJ } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Pie,
  PieChart,
  Cell,
  Legend as RechartsLegend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
  baixo: { label: 'Baixo Risco', color: '#16a34a' },
  moderado: { label: 'Risco Moderado', color: '#ca8a04' },
  alto: { label: 'Risco Alto', color: '#ea580c' },
  critico: { label: 'Risco Crítico', color: '#dc2626' },
}

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background border rounded-lg shadow-sm p-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.fill }} />
          <span className="font-medium text-foreground">{data.name}:</span>
          <span className="text-muted-foreground">
            {data.value} ({data.percentage}%)
          </span>
        </div>
      </div>
    )
  }
  return null
}

export default function AvaliacoesNR1EmpresaTab() {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isExecutiveMode, setIsExecutiveMode] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const loadData = async () => {
    try {
      const records = await pb
        .collection('avaliacoes_psicossociais')
        .getFullList({ sort: '-created' })
      const groups: Record<string, any> = {}

      records.forEach((r) => {
        const isCompleted =
          r.status?.toLowerCase() === 'concluído' ||
          r.status?.toLowerCase() === 'concluido' ||
          r.pontuacao_geral > 0
        if (!isCompleted) return

        const cnpj = r.cnpj?.replace(/\D/g, '') || ''
        if (!cnpj) return

        if (!groups[cnpj]) {
          groups[cnpj] = {
            cnpj,
            nome: r.empresa || 'Empresa Desconhecida',
            total: 0,
            soma_pontuacao: 0,
            avaliacoes: [],
            dimensionScoresSum: {},
            riskCounts: { baixo: 0, moderado: 0, alto: 0, critico: 0 },
            qualitativas: [],
          }
        }

        const g = groups[cnpj]
        g.total++
        const score = Number(r.pontuacao_geral || 0)
        g.soma_pontuacao += score
        g.avaliacoes.push(r)

        if (score <= 1.8) g.riskCounts.baixo++
        else if (score <= 2.6) g.riskCounts.moderado++
        else if (score <= 3.4) g.riskCounts.alto++
        else g.riskCounts.critico++

        if (r.respostas?.dimensionScores) {
          Object.entries(r.respostas.dimensionScores).forEach(([dim, s]) => {
            g.dimensionScoresSum[dim] = (g.dimensionScoresSum[dim] || 0) + Number(s)
          })
        }

        if (r.respostas?.qualitativas?.q46 || r.respostas?.qualitativas?.q47) {
          g.qualitativas.push(r.respostas.qualitativas)
        }
      })

      Object.values(groups).forEach((g) => {
        g.media_geral = g.soma_pontuacao / g.total
        g.dimensionScoresAvg = {}
        Object.entries(g.dimensionScoresSum).forEach(([dim, sum]) => {
          g.dimensionScoresAvg[dim] = (sum as number) / g.total
        })
      })

      setData(Object.values(groups))
    } catch (error) {
      toast.error('Erro ao carregar dados.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('avaliacoes_psicossociais', () => {
    loadData()
  })

  const filteredData = useMemo(() => {
    if (!debouncedSearch) return data
    const s = debouncedSearch.toLowerCase()
    return data.filter((g) => g.nome.toLowerCase().includes(s) || g.cnpj.includes(s))
  }, [data, debouncedSearch])

  const generatePDF = async () => {
    if (!selectedGroup) return
    setIsGeneratingPDF(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const margin = 15
      const pageWidth = 210
      const pageHeight = 297
      const usableWidth = pageWidth - margin * 2
      let cursorY = 35

      const drawHeader = (pageNumber: number) => {
        doc.setFillColor(255, 255, 255)
        doc.rect(0, 0, pageWidth, 35, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(16)
        doc.setTextColor(23, 23, 23)
        doc.text('Diagnóstico Psicossocial Corporativo (NR-1)', margin, 20)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(102, 102, 102)
        doc.text(
          `Empresa: ${selectedGroup.nome} | CNPJ: ${formatCNPJ(selectedGroup.cnpj)}`,
          margin,
          26,
        )
        doc.setDrawColor(229, 231, 235)
        doc.line(margin, 30, margin + usableWidth, 30)
      }

      const drawFooter = (pageCount: number) => {
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i)
          doc.setDrawColor(229, 231, 235)
          doc.line(margin, pageHeight - 20, margin + usableWidth, pageHeight - 20)
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(8)
          doc.setTextColor(102, 102, 102)
          doc.text('Era Digital LTDA', margin, pageHeight - 14)
          doc.setFont('helvetica', 'normal')
          doc.text(`Data de Emissão: ${format(new Date(), 'dd/MM/yyyy')}`, margin, pageHeight - 10)
          doc.text(`Página ${i} de ${pageCount}`, margin + usableWidth, pageHeight - 14, {
            align: 'right',
          })
        }
      }

      const checkPageBreak = (neededHeight: number) => {
        if (cursorY + neededHeight > pageHeight - 25) {
          doc.addPage()
          drawHeader(doc.internal.getCurrentPageInfo().pageNumber)
          cursorY = 35
          return true
        }
        return false
      }

      drawHeader(1)

      checkPageBreak(30)
      doc.setFillColor(249, 250, 251)
      doc.setDrawColor(229, 231, 235)
      doc.roundedRect(margin, cursorY, usableWidth, 24, 3, 3, 'FD')
      doc.setFontSize(9)
      doc.setTextColor(102, 102, 102)
      doc.text('Total de Avaliações', margin + 5, cursorY + 8)
      doc.setFontSize(14)
      doc.setTextColor(23, 23, 23)
      doc.setFont('helvetica', 'bold')
      doc.text(String(selectedGroup.total), margin + 5, cursorY + 16)

      const risk = getPsychoRisk(selectedGroup.media_geral)
      doc.setFontSize(9)
      doc.setTextColor(102, 102, 102)
      doc.setFont('helvetica', 'normal')
      doc.text('Média Geral / Risco', margin + usableWidth / 2, cursorY + 8, { align: 'center' })
      doc.setFontSize(14)

      const getRiskHex = (score: number) => {
        if (score <= 1.8) return [21, 128, 61]
        if (score <= 2.6) return [133, 77, 14]
        if (score <= 3.4) return [154, 52, 18]
        return [153, 27, 27]
      }
      const tc = getRiskHex(selectedGroup.media_geral)
      doc.setTextColor(tc[0], tc[1], tc[2])
      doc.setFont('helvetica', 'bold')
      doc.text(
        `${selectedGroup.media_geral.toFixed(2)} - ${risk.label}`,
        margin + usableWidth / 2,
        cursorY + 16,
        { align: 'center' },
      )
      cursorY += 32

      // Distribuição de Riscos
      checkPageBreak(50)
      doc.setFontSize(12)
      doc.setTextColor(23, 23, 23)
      doc.setFont('helvetica', 'bold')
      doc.text('Distribuição de Riscos', margin, cursorY)
      cursorY += 8

      const chartConfigPDF = [
        { label: 'Baixo Risco', value: selectedGroup.riskCounts.baixo, color: [22, 163, 74] },
        { label: 'Risco Moderado', value: selectedGroup.riskCounts.moderado, color: [202, 138, 4] },
        { label: 'Risco Alto', value: selectedGroup.riskCounts.alto, color: [234, 88, 12] },
        { label: 'Risco Crítico', value: selectedGroup.riskCounts.critico, color: [220, 38, 38] },
      ]

      const maxDistWidth = usableWidth - 70
      const totalCount = selectedGroup.total || 1

      chartConfigPDF.forEach((item) => {
        const percentage = (item.value / totalCount) * 100
        const barWidth = (percentage / 100) * maxDistWidth

        doc.setFontSize(9)
        doc.setTextColor(102, 102, 102)
        doc.setFont('helvetica', 'normal')
        doc.text(item.label, margin, cursorY + 4)

        doc.setFillColor(243, 244, 246)
        doc.roundedRect(margin + 30, cursorY, maxDistWidth, 6, 1, 1, 'F')

        if (barWidth > 0) {
          doc.setFillColor(item.color[0], item.color[1], item.color[2])
          doc.roundedRect(margin + 30, cursorY, barWidth, 6, 1, 1, 'F')
        }

        doc.setTextColor(23, 23, 23)
        doc.setFont('helvetica', 'bold')
        doc.text(
          `${item.value} (${percentage.toFixed(1)}%)`,
          margin + 30 + maxDistWidth + 4,
          cursorY + 4,
        )

        cursorY += 9
      })
      cursorY += 6

      // Média por Dimensão
      checkPageBreak(90)
      doc.setFontSize(12)
      doc.setTextColor(23, 23, 23)
      doc.setFont('helvetica', 'bold')
      doc.text('Média por Dimensão', margin, cursorY)
      cursorY += 8

      const maxDimWidth = usableWidth - 90
      PSYCHO_DIMENSIONS.forEach((dim) => {
        const score = selectedGroup.dimensionScoresAvg[dim.id] || 0
        const color = getRiskHex(score)

        doc.setFontSize(8)
        doc.setTextColor(23, 23, 23)
        doc.setFont('helvetica', 'bold')
        doc.text(dim.id, margin, cursorY + 4)

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(102, 102, 102)
        const titleShort = dim.title.length > 25 ? dim.title.substring(0, 25) + '...' : dim.title
        doc.text(titleShort, margin + 8, cursorY + 4)

        // Background bar
        doc.setFillColor(243, 244, 246)
        doc.roundedRect(margin + 55, cursorY, maxDimWidth, 6, 1, 1, 'F')

        const fillWidth = (score / 5) * maxDimWidth
        if (fillWidth > 0) {
          doc.setFillColor(color[0], color[1], color[2])
          doc.roundedRect(margin + 55, cursorY, fillWidth, 6, 1, 1, 'F')
        }

        doc.setTextColor(23, 23, 23)
        doc.setFont('helvetica', 'bold')
        doc.text(score.toFixed(2), margin + 55 + maxDimWidth + 4, cursorY + 4)

        // scale marks
        doc.setDrawColor(209, 213, 219)
        for (let i = 1; i <= 5; i++) {
          const markX = margin + 55 + (i / 5) * maxDimWidth
          if (i < 5) doc.line(markX, cursorY, markX, cursorY + 6)
        }

        cursorY += 9
      })
      cursorY += 6

      if (selectedGroup.qualitativas.length > 0) {
        checkPageBreak(20)
        doc.setFontSize(12)
        doc.setTextColor(23, 23, 23)
        doc.setFont('helvetica', 'bold')
        doc.text('Feedback Qualitativo e Sugestões (Consolidado)', margin, cursorY)
        cursorY += 8

        selectedGroup.qualitativas.forEach((q: any) => {
          const splitRisco = doc.splitTextToSize(q.q46 || '-', usableWidth - 10)
          const splitSugestoes = doc.splitTextToSize(q.q47 || '-', usableWidth - 10)
          const boxHeight = (splitRisco.length + splitSugestoes.length) * 4 + 16

          checkPageBreak(boxHeight + 4)

          doc.setFillColor(249, 250, 251)
          doc.setDrawColor(229, 231, 235)
          doc.roundedRect(margin, cursorY, usableWidth, boxHeight, 2, 2, 'FD')

          doc.setFontSize(9)
          doc.setTextColor(23, 23, 23)
          doc.setFont('helvetica', 'bold')
          doc.text('Fatores de Risco:', margin + 5, cursorY + 6)

          doc.setFont('helvetica', 'normal')
          doc.setTextColor(102, 102, 102)
          doc.text(splitRisco, margin + 5, cursorY + 10)

          const sugY = cursorY + 10 + splitRisco.length * 4 + 2

          doc.setFont('helvetica', 'bold')
          doc.setTextColor(23, 23, 23)
          doc.text('Sugestões:', margin + 5, sugY)

          doc.setFont('helvetica', 'normal')
          doc.setTextColor(102, 102, 102)
          doc.text(splitSugestoes, margin + 5, sugY + 4)

          cursorY += boxHeight + 4
        })
      }

      // Detailed Individual Annex
      doc.addPage()
      drawHeader(doc.internal.getCurrentPageInfo().pageNumber)
      cursorY = 35

      doc.setFontSize(14)
      doc.setTextColor(23, 23, 23)
      doc.setFont('helvetica', 'bold')
      doc.text('Detalhamento por Colaborador', margin, cursorY)
      cursorY += 10

      selectedGroup.avaliacoes.forEach((av: any, index: number) => {
        // Calculate total height for this employee to keep header and main sections together
        const boxHeight = 26
        let totalNeeded = boxHeight + 8

        let combinedQuali = ''
        let splitQuali: string[] = []
        let qualiHeight = 0
        if (av.respostas?.qualitativas?.q46 || av.respostas?.qualitativas?.q47) {
          const q46 = av.respostas.qualitativas.q46
            ? `Fatores não abordados: ${av.respostas.qualitativas.q46}`
            : ''
          const q47 = av.respostas.qualitativas.q47
            ? `Sugestões: ${av.respostas.qualitativas.q47}`
            : ''
          combinedQuali = [q46, q47].filter(Boolean).join('\n')
          if (combinedQuali) {
            splitQuali = doc.splitTextToSize(combinedQuali, usableWidth - 16)
            qualiHeight = splitQuali.length * 4 + 6
            totalNeeded += qualiHeight + 4
          }
        }

        if (checkPageBreak(Math.min(totalNeeded, 150))) {
          cursorY += 4
        }

        doc.setFillColor(249, 250, 251)
        doc.setDrawColor(229, 231, 235)
        doc.roundedRect(margin, cursorY, usableWidth, boxHeight, 2, 2, 'FD')

        doc.setFontSize(10)
        doc.setTextColor(23, 23, 23)
        doc.setFont('helvetica', 'bold')
        doc.text(av.nome || 'Anônimo', margin + 4, cursorY + 7)

        doc.setFontSize(8)
        doc.setTextColor(102, 102, 102)
        doc.setFont('helvetica', 'normal')
        doc.text(
          `Cargo: ${av.cargo || '-'}  |  Departamento: ${av.departamento || '-'}`,
          margin + 4,
          cursorY + 13,
        )

        const risk = getPsychoRisk(av.pontuacao_geral)
        const getRiskHex = (score: number) => {
          if (score <= 1.8) return [21, 128, 61]
          if (score <= 2.6) return [133, 77, 14]
          if (score <= 3.4) return [154, 52, 18]
          return [153, 27, 27]
        }
        const riskColor = getRiskHex(av.pontuacao_geral)
        doc.setTextColor(riskColor[0], riskColor[1], riskColor[2])
        doc.setFont('helvetica', 'bold')
        doc.text(
          `Risco: ${risk.label} (${Number(av.pontuacao_geral).toFixed(2)})`,
          margin + 4,
          cursorY + 19,
        )

        cursorY += boxHeight + 4

        if (combinedQuali && splitQuali.length > 0) {
          doc.setFillColor(255, 255, 255)
          doc.setDrawColor(229, 231, 235)
          doc.roundedRect(margin + 4, cursorY, usableWidth - 8, qualiHeight, 2, 2, 'FD')
          doc.setFontSize(8)
          doc.setTextColor(102, 102, 102)
          doc.setFont('helvetica', 'normal')
          doc.text(splitQuali, margin + 6, cursorY + 5)
          cursorY += qualiHeight + 4
        }

        if (av.respostas?.dimensionScores) {
          checkPageBreak(15)
          doc.setFontSize(9)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(23, 23, 23)
          doc.text('Diagnóstico e Mitigação por Dimensão:', margin + 4, cursorY + 4)
          cursorY += 8

          PSYCHO_DIMENSIONS.forEach((dim) => {
            const score = Number(av.respostas.dimensionScores[dim.id] || 0)
            const riskKey = getRiskLevelKey(score)
            const feedback = PSYCHO_FEEDBACK[dim.id]?.[riskKey]
            if (!feedback) return

            const dRisk = getRiskHex(score)

            checkPageBreak(25)

            doc.setFontSize(8)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(dRisk[0], dRisk[1], dRisk[2])

            // Re-fetch the label text locally to be safe
            let labelText = 'Crítico'
            if (score <= 1.8) labelText = 'Baixo Risco'
            else if (score <= 2.6) labelText = 'Moderado'
            else if (score <= 3.4) labelText = 'Alto'

            doc.text(`${dim.id} - ${dim.title} (${labelText})`, margin + 6, cursorY + 3)
            cursorY += 5

            doc.setFontSize(7)
            doc.setTextColor(23, 23, 23)
            doc.setFont('helvetica', 'bold')
            doc.text('Diagnóstico:', margin + 6, cursorY + 3)
            doc.setFont('helvetica', 'normal')
            const diagLines = doc.splitTextToSize(feedback.diagnostico, usableWidth - 26)
            doc.text(diagLines, margin + 22, cursorY + 3)
            cursorY += diagLines.length * 3 + 2

            doc.setFont('helvetica', 'bold')
            doc.text('Mitigação:', margin + 6, cursorY + 3)
            cursorY += 4

            doc.setFont('helvetica', 'normal')
            feedback.mitigacao.forEach((m) => {
              const mLines = doc.splitTextToSize(`• ${m}`, usableWidth - 12)
              doc.text(mLines, margin + 10, cursorY + 3)
              cursorY += mLines.length * 3 + 1
            })
            cursorY += 2
          })
        }

        if (av.observacoes_admin) {
          const splitObs = doc.splitTextToSize(
            `Observações Internas (Admin): ${av.observacoes_admin}`,
            usableWidth - 16,
          )
          const obsHeight = splitObs.length * 4 + 6
          checkPageBreak(obsHeight + 4)
          doc.setFillColor(255, 255, 255)
          doc.setDrawColor(229, 231, 235)
          doc.roundedRect(margin + 4, cursorY, usableWidth - 8, obsHeight, 2, 2, 'FD')
          doc.setFontSize(8)
          doc.setTextColor(102, 102, 102)
          doc.setFont('helvetica', 'normal')
          doc.text(splitObs, margin + 6, cursorY + 5)
          cursorY += obsHeight + 4
        }

        if (!isExecutiveMode && av.respostas?.completas?.length) {
          checkPageBreak(15)
          doc.setFontSize(9)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(23, 23, 23)
          doc.text('Respostas Detalhadas:', margin + 4, cursorY + 4)
          cursorY += 8

          av.respostas.completas.forEach((ans: any) => {
            const prefix = `[${ans.answer || '-'}] `
            const text = ans.text
            const splitText = doc.splitTextToSize(prefix + text, usableWidth - 16)
            const ansHeight = splitText.length * 4 + 2

            checkPageBreak(ansHeight + 2)
            doc.setFontSize(7)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(102, 102, 102)
            doc.text(splitText, margin + 6, cursorY + 3)
            cursorY += ansHeight + 1
          })
          cursorY += 4
        }

        cursorY += 6 // space before next employee
      })

      drawFooter(doc.internal.getNumberOfPages())
      doc.save(`Diagnostico_Corporativo_${selectedGroup.cnpj}.pdf`)
      toast.success('Relatório gerado com sucesso!')
    } catch (error) {
      toast.error('Erro ao gerar o PDF.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const chartData = useMemo(() => {
    if (!selectedGroup) return []
    const total = selectedGroup.total
    return [
      {
        name: 'Baixo Risco',
        value: selectedGroup.riskCounts.baixo,
        percentage: total ? ((selectedGroup.riskCounts.baixo / total) * 100).toFixed(1) : 0,
        fill: '#16a34a',
      },
      {
        name: 'Risco Moderado',
        value: selectedGroup.riskCounts.moderado,
        percentage: total ? ((selectedGroup.riskCounts.moderado / total) * 100).toFixed(1) : 0,
        fill: '#ca8a04',
      },
      {
        name: 'Risco Alto',
        value: selectedGroup.riskCounts.alto,
        percentage: total ? ((selectedGroup.riskCounts.alto / total) * 100).toFixed(1) : 0,
        fill: '#ea580c',
      },
      {
        name: 'Risco Crítico',
        value: selectedGroup.riskCounts.critico,
        percentage: total ? ((selectedGroup.riskCounts.critico / total) * 100).toFixed(1) : 0,
        fill: '#dc2626',
      },
    ].filter((d) => d.value > 0)
  }, [selectedGroup])

  const barChartData = useMemo(() => {
    if (!selectedGroup) return []
    const getFill = (score: number) => {
      if (score <= 1.8) return '#16a34a'
      if (score <= 2.6) return '#ca8a04'
      if (score <= 3.4) return '#ea580c'
      return '#dc2626'
    }
    return PSYCHO_DIMENSIONS.map((dim: any) => {
      const score = selectedGroup.dimensionScoresAvg[dim.id] || 0
      return { name: dim.id, title: dim.title, score, fill: getFill(score) }
    })
  }, [selectedGroup])

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por CNPJ ou Empresa..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead className="text-center">Total Colaboradores</TableHead>
                <TableHead className="text-center">Média Geral</TableHead>
                <TableHead>Risco Global</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => {
                const risk = getPsychoRisk(item.media_geral)
                return (
                  <TableRow key={item.cnpj}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      {item.nome}
                    </TableCell>
                    <TableCell>{formatCNPJ(item.cnpj)}</TableCell>
                    <TableCell className="text-center">{item.total}</TableCell>
                    <TableCell className="text-center font-bold">
                      {item.media_geral.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${risk.bg} ${risk.color}`}
                      >
                        {risk.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedGroup(item)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhuma empresa encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={!!selectedGroup} onOpenChange={(open) => !open && setSelectedGroup(null)}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-6 pb-4 border-b shrink-0 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Diagnóstico Corporativo</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedGroup?.nome} - CNPJ:{' '}
                {selectedGroup?.cnpj && formatCNPJ(selectedGroup.cnpj)}
              </p>
            </div>
            <div className="flex items-center gap-6 mr-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="executive-mode-empresa"
                  checked={isExecutiveMode}
                  onCheckedChange={setIsExecutiveMode}
                />
                <Label htmlFor="executive-mode-empresa" className="text-sm font-medium">
                  Versão Executiva
                </Label>
              </div>
              <Button onClick={generatePDF} disabled={isGeneratingPDF}>
                {isGeneratingPDF ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                {isGeneratingPDF ? 'Gerando...' : 'Exportar PDF'}
              </Button>
            </div>
          </DialogHeader>
          <ScrollArea className="flex-1 bg-muted/30">
            <div className="mx-auto max-w-[210mm] w-full min-h-[297mm] bg-white my-8 shadow-sm border border-border/50 rounded-md overflow-hidden">
              {selectedGroup && (
                <div className="p-[15mm] space-y-10">
                  <div className="border-b pb-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">
                      Diagnóstico Psicossocial Corporativo (NR-1)
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Empresa: {selectedGroup.nome} | CNPJ: {formatCNPJ(selectedGroup.cnpj)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Total de Avaliações: {selectedGroup.total}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-6">
                      <div
                        className={`p-6 rounded-xl border flex flex-col items-center justify-center text-center ${getPsychoRisk(selectedGroup.media_geral).bg} ${getPsychoRisk(selectedGroup.media_geral).color}`}
                      >
                        <p className="text-sm uppercase tracking-wider font-bold opacity-80 mb-2">
                          Média Geral / Risco
                        </p>
                        <p className="text-5xl font-black mb-2">
                          {selectedGroup.media_geral.toFixed(2)}
                        </p>
                        <p className="text-xl font-bold">
                          {getPsychoRisk(selectedGroup.media_geral).label}
                        </p>
                      </div>
                      <div className="p-6 rounded-xl border flex flex-col items-center justify-center h-full">
                        <h3 className="text-sm font-bold uppercase opacity-80 mb-4 text-muted-foreground">
                          Distribuição de Riscos
                        </h3>
                        {chartData.length > 0 ? (
                          <ChartContainer
                            id="corp-pie-chart"
                            config={chartConfig}
                            className="w-full min-h-[220px]"
                          >
                            <PieChart>
                              <ChartTooltip cursor={false} content={<PieTooltip />} />
                              <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={50}
                                outerRadius={80}
                                strokeWidth={2}
                                isAnimationActive={!isGeneratingPDF}
                              >
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                              <RechartsLegend verticalAlign="bottom" height={36} />
                            </PieChart>
                          </ChartContainer>
                        ) : (
                          <p className="text-sm text-muted-foreground">Sem dados suficientes.</p>
                        )}
                      </div>
                    </div>
                    <div className="p-6 rounded-xl border flex flex-col items-center justify-center">
                      <h3 className="text-sm font-bold uppercase opacity-80 mb-4 text-muted-foreground">
                        Média por Dimensão
                      </h3>
                      <ChartContainer
                        id="corp-bar-chart"
                        config={{}}
                        className="w-full min-h-[220px]"
                      >
                        <BarChart
                          data={barChartData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid vertical={false} strokeDasharray="3 3" />
                          <XAxis dataKey="name" tickLine={false} axisLine={false} />
                          <YAxis domain={[0, 5]} tickLine={false} axisLine={false} />
                          <RechartsTooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', color: '#000' }}
                          />
                          <Bar
                            dataKey="score"
                            radius={[4, 4, 0, 0]}
                            isAnimationActive={!isGeneratingPDF}
                          >
                            {barChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ChartContainer>
                    </div>
                  </div>

                  {selectedGroup.qualitativas.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold border-b pb-2 text-gray-900">
                        Feedback Qualitativo e Sugestões (Consolidado)
                      </h3>
                      <div className="grid gap-3">
                        {selectedGroup.qualitativas.map((q: any, i: number) => (
                          <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            {q.q46 && (
                              <p className="text-sm mb-2 text-gray-700">
                                <span className="font-semibold text-gray-900">
                                  Fatores de risco não abordados:
                                </span>{' '}
                                {q.q46}
                              </p>
                            )}
                            {q.q47 && (
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold text-gray-900">
                                  Sugestões de melhoria:
                                </span>{' '}
                                {q.q47}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-6 pt-10">
                    <h3 className="text-xl font-bold border-b pb-3 text-gray-900">
                      Detalhamento por Colaborador
                    </h3>

                    <div className="space-y-8">
                      {selectedGroup.avaliacoes.map((av: any, i: number) => {
                        const risk = getPsychoRisk(av.pontuacao_geral)
                        return (
                          <div
                            key={av.id || i}
                            className="border rounded-xl p-5 bg-white shadow-sm break-inside-avoid page-break-inside-avoid"
                          >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 mb-4">
                              <div>
                                <h4 className="font-bold text-lg text-gray-900">
                                  {av.nome || 'Anônimo'}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  Cargo: {av.cargo || '-'} • Depto: {av.departamento || '-'}
                                </p>
                              </div>
                              <div
                                className={`px-4 py-2 rounded-lg text-center ${risk.bg} ${risk.color} border`}
                              >
                                <p className="text-xs uppercase font-bold tracking-wider opacity-80">
                                  Risco
                                </p>
                                <p className="font-black text-xl">
                                  {risk.label}{' '}
                                  <span className="text-sm">
                                    ({Number(av.pontuacao_geral).toFixed(2)})
                                  </span>
                                </p>
                              </div>
                            </div>

                            {(av.respostas?.qualitativas?.q46 ||
                              av.respostas?.qualitativas?.q47) && (
                              <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                {av.respostas.qualitativas.q46 && (
                                  <p className="text-sm text-gray-700 mb-2">
                                    <span className="font-semibold text-gray-900">
                                      Fatores não abordados:
                                    </span>{' '}
                                    {av.respostas.qualitativas.q46}
                                  </p>
                                )}
                                {av.respostas.qualitativas.q47 && (
                                  <p className="text-sm text-gray-700">
                                    <span className="font-semibold text-gray-900">Sugestões:</span>{' '}
                                    {av.respostas.qualitativas.q47}
                                  </p>
                                )}
                              </div>
                            )}

                            {av.respostas?.dimensionScores && (
                              <div className="mt-4 mb-4">
                                <h5 className="text-sm font-bold text-gray-900 mb-3">
                                  Diagnóstico e Mitigação por Dimensão:
                                </h5>
                                <div className="space-y-3">
                                  {PSYCHO_DIMENSIONS.map((dim) => {
                                    const score = av.respostas.dimensionScores[dim.id] || 0
                                    const riskKey = getRiskLevelKey(score)
                                    const feedback = PSYCHO_FEEDBACK[dim.id]?.[riskKey]
                                    if (!feedback) return null
                                    const dRisk = getPsychoRisk(score)

                                    return (
                                      <div
                                        key={dim.id}
                                        className="text-xs p-3 bg-gray-50/50 border border-gray-100 rounded-md"
                                      >
                                        <div className="flex justify-between items-center mb-2">
                                          <span className="font-bold text-gray-900">
                                            {dim.id} - {dim.title}
                                          </span>
                                          <span
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${dRisk.color} ${dRisk.bg}`}
                                          >
                                            {dRisk.label} ({score.toFixed(2)})
                                          </span>
                                        </div>
                                        <p className="text-gray-700 mb-1">
                                          <span className="font-semibold text-gray-900">
                                            Diagnóstico:
                                          </span>{' '}
                                          {feedback.diagnostico}
                                        </p>
                                        <div>
                                          <span className="font-semibold text-gray-900">
                                            Mitigação:
                                          </span>
                                          <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-gray-700">
                                            {feedback.mitigacao.map((m: string, i: number) => (
                                              <li key={i}>{m}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {av.observacoes_admin && (
                              <div className="mt-4 bg-muted/20 p-4 rounded-lg border">
                                <h5 className="text-sm font-bold text-gray-900 mb-2">
                                  Observações Internas (Admin):
                                </h5>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {av.observacoes_admin}
                                </p>
                              </div>
                            )}

                            {!isExecutiveMode && av.respostas?.completas?.length > 0 && (
                              <div className="mt-4">
                                <h5 className="text-sm font-bold text-gray-900 mb-3">
                                  Respostas Detalhadas:
                                </h5>
                                <div className="grid gap-2">
                                  {av.respostas.completas.map((ans: any, idx: number) => (
                                    <div
                                      key={idx}
                                      className="text-xs p-2.5 bg-gray-50/50 border border-gray-100 rounded text-gray-600 flex gap-2"
                                    >
                                      <span className="font-bold text-gray-900 shrink-0">
                                        [{ans.answer || '-'}]
                                      </span>
                                      <span>{ans.text}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
