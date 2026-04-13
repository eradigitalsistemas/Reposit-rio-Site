import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type DISCQuestion = {
  id: string
  text: string
  options: { value: string; label: string }[]
}

export function AnswerButton({
  option,
  selected,
  onClick,
}: {
  option: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 text-left',
        selected
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-muted hover:border-primary/50 hover:bg-muted/50',
      )}
      aria-pressed={selected}
    >
      <div
        className={cn(
          'w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 transition-colors',
          selected ? 'border-primary' : 'border-muted-foreground',
        )}
      >
        {selected && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
      </div>
      <span className="text-sm md:text-base font-medium">{option}</span>
    </button>
  )
}

export function QuestionCard({
  question,
  options,
  selectedOption,
  onSelect,
}: {
  question: string
  options: { value: string; label: string }[]
  selectedOption?: string
  onSelect: (val: string) => void
}) {
  return (
    <div className="w-full">
      <h4 className="text-xl font-medium mb-6 min-h-[56px] flex items-center">{question}</h4>
      <div className="space-y-3">
        {options.map((opt) => (
          <AnswerButton
            key={opt.value}
            option={opt.label}
            selected={selectedOption === opt.value}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </div>
  )
}

export function ProgressIndicator({ current, total }: { current: number; total: number }) {
  const progress = (current / total) * 100
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-2">
        <span>
          Pergunta {current} de {total}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2 transition-all duration-500" />
    </div>
  )
}

export function QuestionTransition({
  children,
  direction,
  animationKey,
}: {
  children: React.ReactNode
  direction: 'next' | 'prev'
  animationKey: string | number
}) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 50)
    return () => clearTimeout(timer)
  }, [animationKey])

  return (
    <div
      className={cn(
        'transition-all duration-300 transform',
        animate
          ? direction === 'next'
            ? 'opacity-0 translate-x-4'
            : 'opacity-0 -translate-x-4'
          : 'opacity-100 translate-x-0',
      )}
    >
      {children}
    </div>
  )
}

export function DISCQuiz({
  questions,
  onComplete,
  onChange,
  initialAnswers = {},
}: {
  questions: DISCQuestion[]
  onComplete: (answers: Record<string, string>, scores: Record<string, number>) => void
  onChange?: (answers: Record<string, string>) => void
  initialAnswers?: Record<string, string>
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (Object.keys(initialAnswers).length > 0 && !isLoaded) {
      setAnswers(initialAnswers)
      const firstUnanswered = questions.findIndex((q) => !initialAnswers[q.id])
      if (firstUnanswered !== -1) {
        setCurrentIndex(firstUnanswered)
      } else {
        setCurrentIndex(questions.length - 1)
      }
      setIsLoaded(true)
    } else if (!isLoaded) {
      const saved = localStorage.getItem('disc_quiz_progress')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.answers && Object.keys(parsed.answers).length > 0) {
            setAnswers(parsed.answers)
            if (onChange) onChange(parsed.answers)
            const firstUnanswered = questions.findIndex((q) => !parsed.answers[q.id])
            if (firstUnanswered !== -1) {
              setCurrentIndex(firstUnanswered)
            } else {
              setCurrentIndex(questions.length - 1)
            }
          }
        } catch (e) {}
      }
      setIsLoaded(true)
    }
  }, [initialAnswers, isLoaded, questions, onChange])

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [questions[currentIndex].id]: value }
    setAnswers(newAnswers)
    localStorage.setItem('disc_quiz_progress', JSON.stringify({ answers: newAnswers }))

    if (onChange) onChange(newAnswers)

    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setDirection('next')
        setCurrentIndex((prev) => prev + 1)
      }, 400)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection('prev')
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setDirection('next')
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleComplete = () => {
    const scores = { D: 0, I: 0, S: 0, C: 0 }
    Object.values(answers).forEach((val) => {
      if (val === 'D') scores.D++
      if (val === 'I') scores.I++
      if (val === 'S') scores.S++
      if (val === 'C') scores.C++
    })

    localStorage.removeItem('disc_quiz_progress')
    onComplete(answers, scores)
  }

  if (!questions || questions.length === 0) return null

  const currentQ = questions[currentIndex]
  const isAnswered = !!answers[currentQ.id]
  const isFinished = questions.every((q) => answers[q.id])

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <ProgressIndicator current={currentIndex + 1} total={questions.length} />

      <div className="bg-card border shadow-sm rounded-xl p-6 md:p-8 overflow-hidden">
        <QuestionTransition direction={direction} animationKey={currentQ.id}>
          <QuestionCard
            question={currentQ.text}
            options={currentQ.options}
            selectedOption={answers[currentQ.id]}
            onSelect={handleSelect}
          />
        </QuestionTransition>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button type="button" variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
          <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
        </Button>

        {currentIndex < questions.length - 1 ? (
          <Button type="button" onClick={handleNext} disabled={!isAnswered}>
            Próxima <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleComplete}
            disabled={!isFinished}
            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]"
          >
            Concluir <CheckCircle2 className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
