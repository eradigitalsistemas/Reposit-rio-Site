import { useState, useEffect } from 'react'
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
import { Loader2, FileText, Printer } from 'lucide-react'
import { getPsychoRisk, PSYCHO_DIMENSIONS } from '@/lib/psycho-eval'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function AvaliacoesNR1Tab() {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEval, setSelectedEval] = useState<any | null>(null)

  const loadData = async () => {
    try {
      const records = await pb.collection('avaliacoes_psicossociais').getList(1, 50, {
        sort: '-created',
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
  }, [])

  useRealtime('avaliacoes_psicossociais', () => {
    loadData()
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-container, #print-container * { visibility: visible; }
          #print-container { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            background: white !important; 
            color: black !important;
            padding: 20px;
          }
          .page-break { page-break-before: always; }
        }
      `}</style>

      <div className="space-y-4 no-print">
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
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
                      <Button variant="outline" size="sm" onClick={() => setSelectedEval(item)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Relatório
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Nenhuma avaliação NR-1 registrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!selectedEval} onOpenChange={(open) => !open && setSelectedEval(null)}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 no-print">
          <DialogHeader className="p-6 pb-4 border-b shrink-0 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Relatório de Avaliação NR-1</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gerenciamento de Riscos Ocupacionais
              </p>
            </div>
            <Button onClick={() => window.print()} className="shrink-0 mr-6">
              <Printer className="w-4 h-4 mr-2" /> Imprimir / PDF
            </Button>
          </DialogHeader>
          <ScrollArea className="flex-1 p-6">
            {selectedEval && (
              <div className="space-y-8">
                {/* Identificação */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg border">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{selectedEval.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Empresa</p>
                    <p className="font-medium">{selectedEval.empresa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Departamento</p>
                    <p className="font-medium">{selectedEval.departamento}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cargo</p>
                    <p className="font-medium">{selectedEval.cargo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo Empresa</p>
                    <p className="font-medium">{selectedEval.tempo_empresa} meses</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">
                      {format(new Date(selectedEval.created), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                </div>

                {/* Score Summary */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div
                    className={`flex-1 p-6 rounded-xl border flex flex-col items-center justify-center text-center ${getPsychoRisk(selectedEval.pontuacao_geral).bg} ${getPsychoRisk(selectedEval.pontuacao_geral).color}`}
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
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    {PSYCHO_DIMENSIONS.map((dim) => {
                      const score = selectedEval.respostas?.dimensionScores?.[dim.id] || 0
                      const dRisk = getPsychoRisk(score)
                      return (
                        <div
                          key={dim.id}
                          className={`p-3 rounded-lg border flex flex-col ${dRisk.bg} ${dRisk.color} bg-opacity-30`}
                        >
                          <span className="text-xs font-bold truncate" title={dim.title}>
                            {dim.id} - {dim.title}
                          </span>
                          <div className="flex justify-between items-end mt-2">
                            <span className="text-2xl font-bold">{Number(score).toFixed(2)}</span>
                            <span className="text-xs font-semibold">{dRisk.label}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

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
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Hidden Printable Container */}
      {selectedEval && (
        <div id="print-container" className="hidden">
          <div className="mb-8 border-b-2 border-black pb-4">
            <h1 className="text-2xl font-bold uppercase">
              Relatório de Avaliação Psicossocial (NR-1)
            </h1>
            <p className="text-gray-600">Documento do Sistema de Gestão de Riscos Ocupacionais</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <strong>Nome:</strong> {selectedEval.nome}
            </div>
            <div>
              <strong>Data:</strong> {format(new Date(selectedEval.created), 'dd/MM/yyyy')}
            </div>
            <div>
              <strong>Empresa:</strong> {selectedEval.empresa}
            </div>
            <div>
              <strong>Departamento:</strong> {selectedEval.departamento}
            </div>
            <div>
              <strong>Cargo:</strong> {selectedEval.cargo}
            </div>
            <div>
              <strong>Tempo na Empresa:</strong> {selectedEval.tempo_empresa} meses
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold border-b border-black mb-4">Resultado Geral</h2>
            <div className="flex gap-8 items-center">
              <div className="text-6xl font-black">
                {Number(selectedEval.pontuacao_geral).toFixed(2)}
              </div>
              <div className="text-2xl font-bold uppercase">
                {getPsychoRisk(selectedEval.pontuacao_geral).label}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold border-b border-black mb-4">Médias por Dimensão</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Dimensão</th>
                  <th className="py-2">Média</th>
                  <th className="py-2">Classificação</th>
                </tr>
              </thead>
              <tbody>
                {PSYCHO_DIMENSIONS.map((dim) => {
                  const score = selectedEval.respostas?.dimensionScores?.[dim.id] || 0
                  return (
                    <tr key={dim.id} className="border-b">
                      <td className="py-2">
                        {dim.id} - {dim.title}
                      </td>
                      <td className="py-2 font-bold">{Number(score).toFixed(2)}</td>
                      <td className="py-2">{getPsychoRisk(score).label}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="page-break mb-8">
            <h2 className="text-xl font-bold border-b border-black mb-4">
              Escala de Interpretação (NR-1)
            </h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <strong>1,00 a 1,80 (Baixo Risco):</strong> Fator positivo. Manter e monitorar.
              </li>
              <li>
                <strong>1,81 a 2,60 (Risco Moderado):</strong> Exige atenção. Indícios de
                desconforto. Incluir no PGR.
              </li>
              <li>
                <strong>2,61 a 3,40 (Risco Alto):</strong> Fator crítico. Necessita de intervenção
                prioritária em até 90 dias.
              </li>
              <li>
                <strong>3,41 a 5,00 (Risco Crítico):</strong> Situação grave. Exige ação corretiva
                imediata.
              </li>
            </ul>
            <p className="text-sm italic">
              Nota: Este documento é confidencial. A interpretação considera a inversão de pontuação
              para questões de formulação positiva na perspectiva de risco (maior nota = maior
              risco).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold border-b border-black mb-4">Respostas Detalhadas</h2>
            {selectedEval.respostas?.completas?.map((ans: any, i: number) => (
              <div key={i} className="mb-2 text-sm">
                <span className="font-bold mr-2">[{ans.answer || '-'}]</span> {ans.text}
              </div>
            ))}
          </div>

          {(selectedEval.respostas?.qualitativas?.q46 ||
            selectedEval.respostas?.qualitativas?.q47) && (
            <div className="mt-8">
              <h2 className="text-xl font-bold border-b border-black mb-4">
                Informações Complementares
              </h2>
              {selectedEval.respostas?.qualitativas?.q46 && (
                <div className="mb-4">
                  <strong>46. Fatores não abordados:</strong>
                  <br />
                  {selectedEval.respostas.qualitativas.q46}
                </div>
              )}
              {selectedEval.respostas?.qualitativas?.q47 && (
                <div>
                  <strong>47. Sugestões de melhoria:</strong>
                  <br />
                  {selectedEval.respostas.qualitativas.q47}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}
