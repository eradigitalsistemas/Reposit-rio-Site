import type { jsPDF } from 'jspdf'

export function getRiskRgb(score: number): [number, number, number] {
  if (score <= 1.8) return [22, 163, 74]
  if (score <= 2.6) return [202, 138, 4]
  if (score <= 3.4) return [234, 88, 12]
  return [220, 38, 38]
}

export function getRiskLabelPdf(score: number): string {
  if (score <= 1.8) return 'Baixo Risco'
  if (score <= 2.6) return 'Risco Moderado'
  if (score <= 3.4) return 'Risco Alto'
  return 'Risco Crítico'
}

export function drawRiskDistributionPdf(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  riskCounts: { baixo: number; moderado: number; alto: number; critico: number },
  total: number,
): number {
  const items = [
    {
      label: 'Baixo Risco',
      value: riskCounts.baixo,
      rgb: [22, 163, 74] as [number, number, number],
    },
    {
      label: 'Risco Moderado',
      value: riskCounts.moderado,
      rgb: [202, 138, 4] as [number, number, number],
    },
    { label: 'Risco Alto', value: riskCounts.alto, rgb: [234, 88, 12] as [number, number, number] },
    {
      label: 'Risco Crítico',
      value: riskCounts.critico,
      rgb: [220, 38, 38] as [number, number, number],
    },
  ]

  const labelWidth = 35
  const valueWidth = 40
  const chartWidth = width - labelWidth - valueWidth
  const barHeight = 7
  const barSpacing = 11
  let cursorY = y

  items.forEach((item) => {
    const pct = total > 0 ? (item.value / total) * 100 : 0
    const barWidth = (pct / 100) * chartWidth

    doc.setFontSize(9)
    doc.setTextColor(102, 102, 102)
    doc.setFont('helvetica', 'normal')
    doc.text(item.label, x, cursorY + 5)

    doc.setFillColor(238, 238, 238)
    doc.roundedRect(x + labelWidth, cursorY, chartWidth, barHeight, 1.5, 1.5, 'F')

    if (barWidth > 1) {
      doc.setFillColor(item.rgb[0], item.rgb[1], item.rgb[2])
      doc.roundedRect(x + labelWidth, cursorY, Math.max(barWidth, 3), barHeight, 1.5, 1.5, 'F')
    }

    doc.setTextColor(23, 23, 23)
    doc.setFont('helvetica', 'bold')
    doc.text(`${item.value} (${pct.toFixed(1)}%)`, x + labelWidth + chartWidth + 4, cursorY + 5)

    cursorY += barSpacing
  })

  return cursorY + 2
}

export function drawThermometerScorecardPdf(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  dimId: string,
  dimTitle: string,
  score: number,
): number {
  const rgb = getRiskRgb(score)
  const label = getRiskLabelPdf(score)
  const barHeight = 9
  const badgeWidth = 10
  const titleWidth = 48
  const valueWidth = 38
  const trackStart = x + badgeWidth + titleWidth + 6
  const trackWidth = width - badgeWidth - titleWidth - valueWidth - 12
  const bulbRadius = 3.5

  doc.setFillColor(rgb[0], rgb[1], rgb[2])
  doc.roundedRect(x, y, badgeWidth, barHeight, 2, 2, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text(dimId, x + badgeWidth / 2, y + 6, { align: 'center' })

  doc.setFontSize(8)
  doc.setTextColor(23, 23, 23)
  doc.setFont('helvetica', 'normal')
  const titleShort = dimTitle.length > 28 ? dimTitle.substring(0, 28) + '...' : dimTitle
  doc.text(titleShort, x + badgeWidth + 3, y + 6)

  doc.setFillColor(238, 238, 238)
  doc.roundedRect(trackStart, y + 1, trackWidth, barHeight - 2, 3, 3, 'F')

  doc.setFillColor(rgb[0], rgb[1], rgb[2])
  doc.circle(trackStart + bulbRadius, y + barHeight / 2, bulbRadius, 'F')

  const fillRatio = Math.max(0, Math.min(1, (score - 1) / 4))
  const fillWidth = fillRatio * (trackWidth - bulbRadius)
  if (fillWidth > 0) {
    doc.setFillColor(rgb[0], rgb[1], rgb[2])
    doc.roundedRect(trackStart + bulbRadius, y + 1, fillWidth, barHeight - 2, 1.5, 1.5, 'F')
  }

  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.2)
  for (let i = 1; i <= 5; i++) {
    const markX = trackStart + bulbRadius + ((i - 1) / 4) * (trackWidth - bulbRadius)
    if (i < 5) {
      doc.line(markX, y + barHeight - 1, markX, y + barHeight)
    }
  }

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(rgb[0], rgb[1], rgb[2])
  doc.text(score.toFixed(2), trackStart + trackWidth + 3, y + 5)

  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120, 120, 120)
  doc.text(label, trackStart + trackWidth + 3, y + barHeight + 0.5)

  return y + barHeight + 5
}
