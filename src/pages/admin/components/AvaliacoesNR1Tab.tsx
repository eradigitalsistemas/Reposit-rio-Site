import { useState, useEffect, useMemo } from 'react'
import { jsPDF } from 'jspdf'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
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
import { ptBR } from 'date-fns/locale'
import { Loader2, FileText, Search, Pencil, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import {
  getPsychoRisk,
  getRiskLevelKey,
  PSYCHO_FEEDBACK,
  PSYCHO_DIMENSIONS,
} from '@/lib/psycho-eval'
import { formatPhone, formatCNPJ } from '@/lib/utils'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AvaliacoesNR1EmpresaTab from './AvaliacoesNR1EmpresaTab'

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

export default function AvaliacoesNR1Tab() {
  const [viewMode, setViewMode] = useState<'colaborador' | 'empresa'>('colaborador')
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEval, setSelectedEval] = useState<any | null>(null)
  const [editingEval, setEditingEval] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
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
      const baseFilter = '(status ~ "concluído" || status ~ "concluido" || pontuacao_geral > 0)'
      let filter = baseFilter
      if (debouncedSearch) {
        filter = `${baseFilter} && (cnpj ~ "${debouncedSearch}" || empresa ~ "${debouncedSearch}" || nome ~ "${debouncedSearch}")`
      }
      const records = await pb.collection('avaliacoes_psicossociais').getList(1, 50, {
        sort: '-created',
        filter,
      })
      setData(records.items)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [debouncedSearch])

  useRealtime('avaliacoes_psicossociais', () => {
    loadData()
  })

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta avaliação?')) return
    try {
      setIsDeleting(id)
      await pb.collection('avaliacoes_psicossociais').delete(id)
      toast.success('Avaliação excluída com sucesso.')
    } catch (error) {
      toast.error('Erro ao excluir avaliação.')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSaveEdit = async () => {
    try {
      await pb.collection('avaliacoes_psicossociais').update(editingEval.id, {
        nome: editingEval.nome,
        empresa: editingEval.empresa,
        cnpj: editingEval.cnpj,
        departamento: editingEval.departamento,
        cargo: editingEval.cargo,
        telefone: editingEval.telefone,
        email: editingEval.email,
        tempo_empresa: editingEval.tempo_empresa,
        observacoes_admin: editingEval.observacoes_admin,
      })
      toast.success('Avaliação atualizada com sucesso.')
      setEditingEval(null)
    } catch (error) {
      toast.error('Erro ao atualizar avaliação.')
    }
  }

  const generatePDF = async () => {
    if (!selectedEval) return
    setIsGeneratingPDF(true)

    // Wait for React to re-render charts
    await new Promise((resolve) => setTimeout(resolve, 100))

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const getRiskColors = (score: number) => {
        if (score <= 1.8)
          return {
            bg: [220, 252, 231],
            text: [21, 128, 61],
            border: [187, 247, 208],
            label: 'Baixo Risco',
          }
        if (score <= 2.6)
          return {
            bg: [254, 249, 195],
            text: [133, 77, 14],
            border: [254, 240, 138],
            label: 'Risco Moderado',
          }
        if (score <= 3.4)
          return {
            bg: [255, 237, 213],
            text: [154, 52, 18],
            border: [254, 215, 170],
            label: 'Risco Alto',
          }
        return {
          bg: [254, 226, 226],
          text: [153, 27, 27],
          border: [254, 202, 202],
          label: 'Risco Crítico',
        }
      }

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
        doc.text('Relatório de Avaliação NR-1', margin, 20)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(102, 102, 102)
        doc.text('Gerenciamento de Riscos Ocupacionais', margin, 26)

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

      // --- Identificação ---
      doc.setFillColor(249, 250, 251)
      doc.setDrawColor(229, 231, 235)
      doc.roundedRect(margin, cursorY, usableWidth, 46, 3, 3, 'FD')

      const idFields = [
        { label: 'Nome', value: selectedEval.nome },
        { label: 'Empresa', value: selectedEval.empresa },
        { label: 'CNPJ', value: selectedEval.cnpj ? formatCNPJ(selectedEval.cnpj) : '-' },
        { label: 'Departamento', value: selectedEval.departamento },
        { label: 'Data', value: format(new Date(selectedEval.created), 'dd/MM/yyyy HH:mm') },
        { label: 'E-mail', value: selectedEval.email || '-' },
        {
          label: 'Telefone',
          value: selectedEval.telefone ? formatPhone(selectedEval.telefone) : '-',
        },
        { label: 'Cargo', value: selectedEval.cargo },
        { label: 'Tempo Empresa', value: `${selectedEval.tempo_empresa} meses` },
      ]

      const idColWidth = usableWidth / 4
      idFields.forEach((f, i) => {
        const row = Math.floor(i / 4)
        const col = i % 4
        const x = margin + 4 + col * idColWidth
        const y = cursorY + 6 + row * 14

        doc.setFontSize(8)
        doc.setTextColor(102, 102, 102)
        doc.setFont('helvetica', 'normal')
        doc.text(f.label, x, y)

        doc.setFontSize(9)
        doc.setTextColor(23, 23, 23)
        doc.setFont('helvetica', 'bold')
        const splitVal = doc.splitTextToSize(String(f.value), idColWidth - 6)
        doc.text(splitVal[0] || '-', x, y + 5)
      })

      cursorY += 46 + 8

      // --- Score Summary ---
      checkPageBreak(30)

      const risk = getRiskColors(Number(selectedEval.pontuacao_geral))
      doc.setFillColor(risk.bg[0], risk.bg[1], risk.bg[2])
      doc.setDrawColor(risk.border[0], risk.border[1], risk.border[2])
      doc.roundedRect(margin, cursorY, usableWidth, 24, 3, 3, 'FD')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(risk.text[0], risk.text[1], risk.text[2])
      doc.text('MÉDIA GERAL / RISCO', margin + usableWidth / 2, cursorY + 8, { align: 'center' })

      doc.setFontSize(14)
      doc.text(
        `${Number(selectedEval.pontuacao_geral).toFixed(2)} - ${risk.label}`,
        margin + usableWidth / 2,
        cursorY + 16,
        { align: 'center' },
      )

      cursorY += 34

      // Distribuição de Riscos
      checkPageBreak(50)
      doc.setFontSize(12)
      doc.setTextColor(23, 23, 23)
      doc.setFont('helvetica', 'bold')
      doc.text('Distribuição de Riscos', margin, cursorY)
      cursorY += 8

      const scoreNum = Number(selectedEval.pontuacao_geral)
      const riskCounts = { baixo: 0, moderado: 0, alto: 0, critico: 0 }
      if (scoreNum <= 1.8) riskCounts.baixo = 1
      else if (scoreNum <= 2.6) riskCounts.moderado = 1
      else if (scoreNum <= 3.4) riskCounts.alto = 1
      else riskCounts.critico = 1

      const chartConfigPDF = [
        { label: 'Baixo Risco', value: riskCounts.baixo, color: [22, 163, 74] },
        { label: 'Risco Moderado', value: riskCounts.moderado, color: [202, 138, 4] },
        { label: 'Risco Alto', value: riskCounts.alto, color: [234, 88, 12] },
        { label: 'Risco Crítico', value: riskCounts.critico, color: [220, 38, 38] },
      ]

      const maxDistWidth = usableWidth - 70

      chartConfigPDF.forEach((item) => {
        const percentage = item.value * 100
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

      // Pontuação por Dimensão
      checkPageBreak(90)
      doc.setFontSize(12)
      doc.setTextColor(23, 23, 23)
      doc.setFont('helvetica', 'bold')
      doc.text('Pontuação por Dimensão', margin, cursorY)
      cursorY += 8

      const maxDimWidth = usableWidth - 90
      PSYCHO_DIMENSIONS.forEach((dim) => {
        const score = Number(selectedEval.respostas?.dimensionScores?.[dim.id] || 0)
        const dRisk = getRiskColors(score)

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
          doc.setFillColor(dRisk.text[0], dRisk.text[1], dRisk.text[2])
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

      // --- Diagnóstico e Medidas de Mitigação ---
      checkPageBreak(25)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(23, 23, 23)
      doc.text('Diagnóstico e Medidas de Mitigação', margin, cursorY)
      cursorY += 8

      PSYCHO_DIMENSIONS.forEach((dim) => {
        const score = Number(selectedEval.respostas?.dimensionScores?.[dim.id] || 0)
        const riskKey = getRiskLevelKey(score)
        const feedback = PSYCHO_FEEDBACK[dim.id]?.[riskKey]
        if (!feedback) return

        const dRisk = getRiskColors(score)

        checkPageBreak(30)

        doc.setFillColor(249, 250, 251)
        doc.setDrawColor(229, 231, 235)

        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(dRisk.text[0], dRisk.text[1], dRisk.text[2])
        doc.text(`${dim.id} - ${dim.title} (${dRisk.label} - ${score.toFixed(2)})`, margin, cursorY)
        cursorY += 6

        doc.setFontSize(9)
        doc.setTextColor(23, 23, 23)
        doc.setFont('helvetica', 'bold')
        doc.text('Diagnóstico:', margin, cursorY)

        doc.setFont('helvetica', 'normal')
        const diagLines = doc.splitTextToSize(feedback.diagnostico, usableWidth - 25)
        doc.text(diagLines, margin + 22, cursorY)
        cursorY += diagLines.length * 4 + 2

        doc.setFont('helvetica', 'bold')
        doc.text('Mitigação:', margin, cursorY)
        cursorY += 4

        doc.setFont('helvetica', 'normal')
        feedback.mitigacao.forEach((m) => {
          const mLines = doc.splitTextToSize(`• ${m}`, usableWidth - 5)
          doc.text(mLines, margin + 5, cursorY)
          cursorY += mLines.length * 4 + 1
        })

        cursorY += 4
      })

      // --- Escala de Respostas ---
      checkPageBreak(38)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(23, 23, 23)
      doc.text('Escala de Respostas', margin, cursorY)
      cursorY += 6

      const escalas = [
        '1 = Discordo totalmente',
        '2 = Discordo parcialmente',
        '3 = Nem concordo nem discordo',
        '4 = Concordo parcialmente',
        '5 = Concordo totalmente',
      ]

      const escColWidth = (usableWidth - 10) / 3
      escalas.forEach((esc, i) => {
        const row = Math.floor(i / 3)
        const col = i % 3
        const x = margin + col * (escColWidth + 5)
        const y = cursorY + row * 12

        doc.setFillColor(249, 250, 251)
        doc.setDrawColor(229, 231, 235)
        doc.roundedRect(x, y, escColWidth, 10, 2, 2, 'FD')

        const num = esc.charAt(0)
        const text = esc.substring(1)

        doc.setFontSize(8)
        doc.setTextColor(23, 23, 23)
        doc.setFont('helvetica', 'bold')
        doc.text(num, x + 3, y + 6.5)

        doc.setFont('helvetica', 'normal')
        doc.text(text, x + 3 + doc.getTextWidth(num), y + 6.5)
      })
      cursorY += 24 + 10

      // --- Observações Admin ---
      if (selectedEval.observacoes_admin) {
        const textLines = doc.splitTextToSize(selectedEval.observacoes_admin, usableWidth - 8)
        const boxHeight = textLines.length * 4 + 10
        checkPageBreak(boxHeight + 8)

        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(23, 23, 23)
        doc.text('Observações Internas (Admin)', margin, cursorY)
        cursorY += 6

        doc.setFillColor(249, 250, 251)
        doc.setDrawColor(229, 231, 235)
        doc.roundedRect(margin, cursorY, usableWidth, boxHeight, 2, 2, 'FD')

        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text(textLines, margin + 4, cursorY + 6)
        cursorY += boxHeight + 4
      }

      // --- Informações Complementares ---
      const q46 = selectedEval.respostas?.qualitativas?.q46
      const q47 = selectedEval.respostas?.qualitativas?.q47

      if (q46 || q47) {
        checkPageBreak(15)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(23, 23, 23)
        doc.text('Informações Complementares', margin, cursorY)
        cursorY += 6

        if (q46) {
          const textLines = doc.splitTextToSize(q46, usableWidth - 8)
          const boxHeight = textLines.length * 4 + 10
          checkPageBreak(boxHeight + 4)

          doc.setFillColor(249, 250, 251)
          doc.setDrawColor(229, 231, 235)
          doc.roundedRect(margin, cursorY, usableWidth, boxHeight, 2, 2, 'FD')

          doc.setFontSize(9)
          doc.setFont('helvetica', 'bold')
          doc.text('Fatores de risco não abordados:', margin + 4, cursorY + 6)

          doc.setFont('helvetica', 'normal')
          doc.text(textLines, margin + 4, cursorY + 11)

          cursorY += boxHeight + 4
        }

        if (q47) {
          const textLines = doc.splitTextToSize(q47, usableWidth - 8)
          const boxHeight = textLines.length * 4 + 10
          checkPageBreak(boxHeight + 4)

          doc.setFillColor(249, 250, 251)
          doc.setDrawColor(229, 231, 235)
          doc.roundedRect(margin, cursorY, usableWidth, boxHeight, 2, 2, 'FD')

          doc.setFontSize(9)
          doc.setFont('helvetica', 'bold')
          doc.text('Sugestões de melhoria:', margin + 4, cursorY + 6)

          doc.setFont('helvetica', 'normal')
          doc.text(textLines, margin + 4, cursorY + 11)

          cursorY += boxHeight + 4
        }

        cursorY += 4
      }

      // --- Respostas Detalhadas ---
      if (!isExecutiveMode && selectedEval.respostas?.completas?.length) {
        checkPageBreak(15)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(23, 23, 23)
        doc.text('Respostas Detalhadas', margin, cursorY)
        cursorY += 6

        selectedEval.respostas.completas.forEach((ans: any) => {
          const prefix = `[${ans.answer || '-'}]`
          const text = ans.text
          const splitText = doc.splitTextToSize(text, usableWidth - 18)
          const boxHeight = Math.max(splitText.length * 4 + 6, 10)

          checkPageBreak(boxHeight + 4)

          doc.setFillColor(249, 250, 251)
          doc.setDrawColor(229, 231, 235)
          doc.roundedRect(margin, cursorY, usableWidth, boxHeight, 2, 2, 'FD')

          doc.setFontSize(8)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(23, 23, 23)
          doc.text(prefix, margin + 3, cursorY + 6.5)

          doc.setFont('helvetica', 'normal')
          doc.text(splitText, margin + 12, cursorY + 6.5)

          cursorY += boxHeight + 3
        })

        cursorY += 4
      }

      // --- Aviso Legal ---
      checkPageBreak(25)
      cursorY += 4
      const avisoLegalText =
        'Esse diagnóstico não substitui o tratamento dos riscos por um profissional da área e não possui validade jurídica. Procure um especialista para eventuais e possíveis tratamentos.'

      doc.setFillColor(249, 250, 251)
      doc.setDrawColor(229, 231, 235)
      doc.roundedRect(margin, cursorY, usableWidth, 18, 3, 3, 'FD')

      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(23, 23, 23)
      doc.text('AVISO LEGAL', margin + usableWidth / 2, cursorY + 6, { align: 'center' })

      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(102, 102, 102)
      const tl = doc.splitTextToSize(avisoLegalText, usableWidth - 10)
      doc.text(tl, margin + usableWidth / 2, cursorY + 11, { align: 'center' })

      // Render fixed footers
      drawFooter(doc.internal.getNumberOfPages())

      doc.save(`Avaliacao_NR1_${selectedEval.nome.replace(/\s+/g, '_')}.pdf`)
      toast.success('Relatório gerado com sucesso!')
    } catch (error) {
      console.error(error)
      toast.error('Erro ao gerar o PDF. Tente novamente.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const chartData = useMemo(() => {
    if (!selectedEval?.respostas?.dimensionScores) return []
    const riskCounts = { baixo: 0, moderado: 0, alto: 0, critico: 0 }
    let totalDims = 0
    Object.values(selectedEval.respostas.dimensionScores).forEach((score: any) => {
      const num = Number(score)
      if (num <= 1.8) riskCounts.baixo++
      else if (num <= 2.6) riskCounts.moderado++
      else if (num <= 3.4) riskCounts.alto++
      else riskCounts.critico++
      totalDims++
    })
    return [
      {
        name: 'Baixo Risco',
        value: riskCounts.baixo,
        percentage: totalDims ? ((riskCounts.baixo / totalDims) * 100).toFixed(1) : 0,
        fill: '#16a34a',
      },
      {
        name: 'Risco Moderado',
        value: riskCounts.moderado,
        percentage: totalDims ? ((riskCounts.moderado / totalDims) * 100).toFixed(1) : 0,
        fill: '#ca8a04',
      },
      {
        name: 'Risco Alto',
        value: riskCounts.alto,
        percentage: totalDims ? ((riskCounts.alto / totalDims) * 100).toFixed(1) : 0,
        fill: '#ea580c',
      },
      {
        name: 'Risco Crítico',
        value: riskCounts.critico,
        percentage: totalDims ? ((riskCounts.critico / totalDims) * 100).toFixed(1) : 0,
        fill: '#dc2626',
      },
    ].filter((d) => d.value > 0)
  }, [selectedEval])

  const barChartData = useMemo(() => {
    if (!selectedEval?.respostas?.dimensionScores) return []
    const getRiskColorHex = (score: number) => {
      if (score <= 1.8) return '#16a34a'
      if (score <= 2.6) return '#ca8a04'
      if (score <= 3.4) return '#ea580c'
      return '#dc2626'
    }
    return PSYCHO_DIMENSIONS.map((dim) => {
      const score = Number(selectedEval.respostas.dimensionScores[dim.id] || 0)
      return {
        name: dim.id,
        title: dim.title,
        score,
        fill: getRiskColorHex(score),
      }
    })
  }, [selectedEval])

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (viewMode === 'empresa') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <TabsList>
              <TabsTrigger value="colaborador">Por Colaborador</TabsTrigger>
              <TabsTrigger value="empresa">Visão Corporativa</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <AvaliacoesNR1EmpresaTab />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <TabsList>
              <TabsTrigger value="colaborador">Por Colaborador</TabsTrigger>
              <TabsTrigger value="empresa">Visão Corporativa</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex justify-between items-center">
          <div className="relative w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por CNPJ, Empresa ou Nome..."
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
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-center">Média Geral</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => {
                const risk = getPsychoRisk(item.pontuacao_geral)
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell>{item.empresa}</TableCell>
                    <TableCell>{item.cnpj ? formatCNPJ(item.cnpj) : '-'}</TableCell>
                    <TableCell>
                      {format(new Date(item.created), "dd 'de' MMM, yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-center font-bold">
                      {Number(item.pontuacao_geral).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${risk.bg} ${risk.color}`}
                      >
                        {risk.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEval(item)}
                          title="Relatório"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingEval(item)}
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          disabled={isDeleting === item.id}
                          title="Excluir"
                        >
                          {isDeleting === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhuma avaliação NR-1 encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={!!editingEval} onOpenChange={(open) => !open && setEditingEval(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Avaliação NR-1</DialogTitle>
          </DialogHeader>
          {editingEval && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={editingEval.nome || ''}
                  onChange={(e) => setEditingEval({ ...editingEval, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Empresa</Label>
                <Input
                  value={editingEval.empresa || ''}
                  onChange={(e) => setEditingEval({ ...editingEval, empresa: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <Input
                  value={editingEval.cnpj || ''}
                  onChange={(e) =>
                    setEditingEval({ ...editingEval, cnpj: formatCNPJ(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Departamento</Label>
                <Input
                  value={editingEval.departamento || ''}
                  onChange={(e) => setEditingEval({ ...editingEval, departamento: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input
                  value={editingEval.cargo || ''}
                  onChange={(e) => setEditingEval({ ...editingEval, cargo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={editingEval.telefone || ''}
                  onChange={(e) =>
                    setEditingEval({ ...editingEval, telefone: formatPhone(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  value={editingEval.email || ''}
                  onChange={(e) => setEditingEval({ ...editingEval, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tempo Empresa (meses)</Label>
                <Input
                  type="number"
                  value={editingEval.tempo_empresa || 0}
                  onChange={(e) =>
                    setEditingEval({ ...editingEval, tempo_empresa: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2 mt-2">
                <Label>Observações Internas (Admin)</Label>
                <Textarea
                  value={editingEval.observacoes_admin || ''}
                  onChange={(e) =>
                    setEditingEval({ ...editingEval, observacoes_admin: e.target.value })
                  }
                  placeholder="Anotações visíveis apenas para a equipe administrativa..."
                  rows={4}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingEval(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!selectedEval} onOpenChange={(open) => !open && setSelectedEval(null)}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-6 pb-4 border-b shrink-0 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Relatório de Avaliação NR-1</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gerenciamento de Riscos Ocupacionais
              </p>
            </div>
            <div className="flex items-center gap-6 mr-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="executive-mode"
                  checked={isExecutiveMode}
                  onCheckedChange={setIsExecutiveMode}
                />
                <Label htmlFor="executive-mode" className="text-sm font-medium">
                  Versão Executiva
                </Label>
              </div>
              <Button
                onClick={generatePDF}
                variant="default"
                className="shrink-0"
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                {isGeneratingPDF ? 'Gerando...' : 'Baixar Relatório (PDF)'}
              </Button>
            </div>
          </DialogHeader>
          <ScrollArea className="flex-1 p-6">
            {selectedEval && (
              <div className="space-y-8">
                {/* Identificação */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg border">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium truncate" title={selectedEval.nome}>
                      {selectedEval.nome}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Empresa</p>
                    <p className="font-medium truncate" title={selectedEval.empresa}>
                      {selectedEval.empresa}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CNPJ</p>
                    <p className="font-medium truncate" title={selectedEval.cnpj}>
                      {selectedEval.cnpj ? formatCNPJ(selectedEval.cnpj) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Departamento</p>
                    <p className="font-medium truncate" title={selectedEval.departamento}>
                      {selectedEval.departamento}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">
                      {format(new Date(selectedEval.created), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="font-medium truncate" title={selectedEval.email}>
                      {selectedEval.email || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">
                      {selectedEval.telefone ? formatPhone(selectedEval.telefone) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cargo</p>
                    <p className="font-medium truncate" title={selectedEval.cargo}>
                      {selectedEval.cargo}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo Empresa</p>
                    <p className="font-medium">{selectedEval.tempo_empresa} meses</p>
                  </div>
                </div>

                {/* Score Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-6">
                    <div
                      className={`p-6 rounded-xl border flex flex-col items-center justify-center text-center ${getPsychoRisk(selectedEval.pontuacao_geral).bg} ${getPsychoRisk(selectedEval.pontuacao_geral).color}`}
                    >
                      <p className="text-sm uppercase tracking-wider font-bold opacity-80 mb-2">
                        Média Geral / Risco
                      </p>
                      <p className="text-5xl font-black mb-2">
                        {Number(selectedEval.pontuacao_geral).toFixed(2)}
                      </p>
                      <p className="text-xl font-bold">
                        {getPsychoRisk(selectedEval.pontuacao_geral).label}
                      </p>
                    </div>

                    <div className="p-6 rounded-xl border flex flex-col items-center justify-center h-full">
                      <h3 className="text-sm font-bold uppercase opacity-80 mb-4 text-muted-foreground">
                        Distribuição de Riscos
                      </h3>
                      {chartData.length > 0 ? (
                        <ChartContainer
                          id="pdf-pie-chart"
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
                              isAnimationActive={false}
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
                      Pontuação por Dimensão
                    </h3>
                    <ChartContainer id="pdf-bar-chart" config={{}} className="w-full min-h-[220px]">
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
                        <Bar dataKey="score" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                          {barChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-fit">
                    {PSYCHO_DIMENSIONS.map((dim) => {
                      const score = selectedEval.respostas?.dimensionScores?.[dim.id] || 0
                      const dRisk = getPsychoRisk(score)
                      return (
                        <div
                          key={dim.id}
                          className={`p-4 rounded-lg border flex flex-col justify-between ${dRisk.bg} ${dRisk.color} bg-opacity-30`}
                        >
                          <span className="text-xs font-bold block w-full mb-3" title={dim.title}>
                            {dim.id} - {dim.title}
                          </span>
                          <div className="flex justify-between items-end">
                            <span className="text-3xl font-bold">{Number(score).toFixed(2)}</span>
                            <span className="text-[10px] uppercase font-bold tracking-tight text-right w-16 leading-tight">
                              {dRisk.label}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Diagnóstico e Mitigação */}
                <div className="space-y-4 mt-8">
                  <h3 className="text-lg font-bold border-b pb-2">
                    Diagnóstico e Medidas de Mitigação
                  </h3>
                  <div className="grid gap-4">
                    {PSYCHO_DIMENSIONS.map((dim) => {
                      const score = selectedEval.respostas?.dimensionScores?.[dim.id] || 0
                      const riskKey = getRiskLevelKey(score)
                      const feedback = PSYCHO_FEEDBACK[dim.id]?.[riskKey]
                      if (!feedback) return null

                      const dRisk = getPsychoRisk(score)

                      return (
                        <div key={dim.id} className="p-4 rounded-lg border bg-card">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold">
                              {dim.id} - {dim.title}
                            </h4>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${dRisk.bg} ${dRisk.color}`}
                            >
                              {dRisk.label} ({score.toFixed(2)})
                            </span>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div>
                              <span className="font-semibold text-foreground">Diagnóstico:</span>{' '}
                              <span className="text-muted-foreground">{feedback.diagnostico}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-foreground">
                                Ações de Mitigação / Melhoria:
                              </span>
                              <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
                                {feedback.mitigacao.map((m, i) => (
                                  <li key={i}>{m}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Escala de Respostas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold border-b pb-2">Escala de Respostas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div className="p-3 border rounded-lg bg-muted/10">
                      <strong>1</strong> = Discordo totalmente
                    </div>
                    <div className="p-3 border rounded-lg bg-muted/10">
                      <strong>2</strong> = Discordo parcialmente
                    </div>
                    <div className="p-3 border rounded-lg bg-muted/10">
                      <strong>3</strong> = Nem concordo nem discordo
                    </div>
                    <div className="p-3 border rounded-lg bg-muted/10">
                      <strong>4</strong> = Concordo parcialmente
                    </div>
                    <div className="p-3 border rounded-lg bg-muted/10">
                      <strong>5</strong> = Concordo totalmente
                    </div>
                  </div>
                </div>

                {/* Observações Admin */}
                {selectedEval.observacoes_admin && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b pb-2">
                      Observações Internas (Admin)
                    </h3>
                    <div className="bg-muted/20 p-4 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedEval.observacoes_admin}
                      </p>
                    </div>
                  </div>
                )}

                {/* Qualitativas */}
                {(selectedEval.respostas?.qualitativas?.q46 ||
                  selectedEval.respostas?.qualitativas?.q47) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b pb-2">Informações Complementares</h3>
                    {selectedEval.respostas?.qualitativas?.q46 && (
                      <div className="bg-muted/20 p-4 rounded-lg">
                        <p className="text-sm font-semibold mb-2">
                          Fatores de risco não abordados:
                        </p>
                        <p className="text-sm">{selectedEval.respostas.qualitativas.q46}</p>
                      </div>
                    )}
                    {selectedEval.respostas?.qualitativas?.q47 && (
                      <div className="bg-muted/20 p-4 rounded-lg">
                        <p className="text-sm font-semibold mb-2">Sugestões de melhoria:</p>
                        <p className="text-sm">{selectedEval.respostas.qualitativas.q47}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Respostas Detalhadas */}
                {!isExecutiveMode && selectedEval.respostas?.completas?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b pb-2">Respostas Detalhadas</h3>
                    <div className="grid gap-2">
                      {selectedEval.respostas.completas.map((ans: any, i: number) => (
                        <div key={i} className="text-sm p-3 border rounded-md bg-muted/10">
                          <span className="font-bold mr-2">[{ans.answer || '-'}]</span> {ans.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 p-6 bg-muted/50 border rounded-xl text-center text-sm text-muted-foreground font-medium flex flex-col items-center gap-2">
                  <p>
                    <strong className="text-foreground uppercase tracking-wider text-xs block mb-2">
                      Aviso Legal
                    </strong>
                    Esse diagnóstico não substitui o tratamento dos riscos por um profissional da
                    área e não possui validade jurídica. Procure um especialista para eventuais e
                    possíveis tratamentos.
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
