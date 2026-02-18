import { useMemo, useState } from 'react'
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  set,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type FocusTarget = 'start' | 'end'
type PickerMode = 'date' | 'month' | 'year'

type RangeValue = {
  start: Date | null
  end: Date | null
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES_SECONDS = Array.from({ length: 60 }, (_, i) => i)

function normalizeOrder(a: Date, b: Date) {
  return isAfter(a, b) ? [b, a] : [a, b]
}

function DayCell({
  day,
  month,
  start,
  end,
  active,
  onClick,
}: {
  day: Date
  month: Date
  start: Date
  end: Date
  active: FocusTarget
  onClick: (day: Date) => void
}) {
  const [orderedStart, orderedEnd] = normalizeOrder(start, end)
  const inRange = isAfter(day, orderedStart) && isBefore(day, orderedEnd)
  const isStart = isSameDay(day, start)
  const isEnd = isSameDay(day, end)

  return (
    <button
      onClick={() => onClick(day)}
      className={cn(
        'relative h-9 rounded-md text-sm transition-colors',
        !isSameMonth(day, month) && 'text-zinc-400',
        inRange && 'bg-blue-100 text-blue-900',
        (isStart || isEnd) && 'bg-blue-600 text-white hover:bg-blue-600',
        !(isStart || isEnd) && 'hover:bg-blue-50',
      )}
      title={active === 'start' ? '设置开始时间' : '设置结束时间'}
    >
      {format(day, 'd')}
    </button>
  )
}

function MonthPanel({
  month,
  left,
  start,
  end,
  active,
  mode,
  onModeChange,
  onNavigate,
  onDatePick,
  onMonthPick,
  onYearPick,
}: {
  month: Date
  left: boolean
  start: Date
  end: Date
  active: FocusTarget
  mode: PickerMode
  onModeChange: (mode: PickerMode) => void
  onNavigate: (dir: -1 | 1) => void
  onDatePick: (d: Date) => void
  onMonthPick: (month: number) => void
  onYearPick: (year: number) => void
}) {
  const days = useMemo(() => {
    const first = startOfMonth(month)
    const gridStart = addDays(first, -((first.getDay() + 6) % 7))
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
  }, [month])

  const years = useMemo(() => {
    const y = month.getFullYear()
    return Array.from({ length: 12 }, (_, i) => y - 6 + i)
  }, [month])

  return (
    <div className="rounded-xl border border-zinc-200 p-3">
      <div className="mb-3 flex items-center justify-between">
        <Button variant="ghost" className="h-8 w-8 px-0" onClick={() => onNavigate(left ? -1 : 1)}>
          {left ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
        </Button>
        <div className="flex gap-2 text-sm font-medium">
          <button className="rounded px-2 py-1 hover:bg-zinc-100" onClick={() => onModeChange('year')}>
            {format(month, 'yyyy')}年
          </button>
          <button className="rounded px-2 py-1 hover:bg-zinc-100" onClick={() => onModeChange('month')}>
            {format(month, 'M')}月
          </button>
        </div>
      </div>

      {mode === 'date' && (
        <>
          <div className="mb-2 grid grid-cols-7 text-center text-xs text-zinc-500">
            {['一', '二', '三', '四', '五', '六', '日'].map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d) => (
              <DayCell key={d.toISOString()} day={d} month={month} start={start} end={end} active={active} onClick={onDatePick} />
            ))}
          </div>
        </>
      )}

      {mode === 'month' && (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 12 }, (_, i) => i).map((m) => (
            <button
              key={m}
              onClick={() => onMonthPick(m)}
              className={cn(
                'rounded-md border px-2 py-2 text-sm hover:border-blue-500',
                month.getMonth() === m && 'border-blue-500 bg-blue-50 text-blue-700',
              )}
            >
              {m + 1}月
            </button>
          ))}
        </div>
      )}

      {mode === 'year' && (
        <div className="grid grid-cols-3 gap-2">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => onYearPick(y)}
              className={cn(
                'rounded-md border px-2 py-2 text-sm hover:border-blue-500',
                month.getFullYear() === y && 'border-blue-500 bg-blue-50 text-blue-700',
              )}
            >
              {y}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function TimeColumn({ value, options, onChange, label }: { value: number; options: number[]; onChange: (n: number) => void; label: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-zinc-500">{label}</p>
      <div className="h-36 overflow-y-auto rounded-md border border-zinc-200 p-1">
        {options.map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={cn('mb-1 block w-full rounded px-2 py-1 text-sm hover:bg-zinc-100', value === n && 'bg-blue-600 text-white hover:bg-blue-600')}
          >
            {String(n).padStart(2, '0')}
          </button>
        ))}
      </div>
    </div>
  )
}

export function RangeDateTimePicker() {
  const [open, setOpen] = useState(false)
  const [focus, setFocus] = useState<FocusTarget>('start')
  const [value, setValue] = useState<RangeValue>({ start: null, end: null })

  const initialStart = value.start ?? new Date()
  const initialEnd = value.end ?? addDays(new Date(), 1)
  const [draftStart, setDraftStart] = useState(initialStart)
  const [draftEnd, setDraftEnd] = useState(initialEnd)

  const [baseMonth, setBaseMonth] = useState(startOfMonth(initialStart))
  const [leftMode, setLeftMode] = useState<PickerMode>('date')
  const [rightMode, setRightMode] = useState<PickerMode>('date')

  const leftMonth = baseMonth
  const rightMonth = addMonths(baseMonth, 1)
  const activeDate = focus === 'start' ? draftStart : draftEnd

  const setActiveDate = (date: Date) => {
    const merged = set(activeDate, {
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate(),
    })
    if (focus === 'start') {
      setDraftStart(merged)
    } else {
      setDraftEnd(merged)
    }
  }

  const setActiveTime = (type: 'hours' | 'minutes' | 'seconds', n: number) => {
    const next = set(activeDate, { [type]: n })
    if (focus === 'start') {
      setDraftStart(next)
    } else {
      setDraftEnd(next)
    }
  }

  const commit = () => {
    if (focus === 'start') {
      setFocus('end')
      return
    }
    const [start, end] = normalizeOrder(draftStart, draftEnd)
    setValue({ start, end })
    setDraftStart(start)
    setDraftEnd(end)
    setFocus('start')
    setOpen(false)
  }

  const reset = () => {
    const now = new Date()
    setDraftStart(now)
    setDraftEnd(addDays(now, 1))
    setValue({ start: null, end: null })
    setFocus('start')
    setBaseMonth(startOfMonth(now))
  }

  return (
    <div className="relative w-full">
      <button
        className="flex w-full items-center justify-between rounded-xl border border-zinc-300 bg-white px-4 py-3 text-left shadow-sm transition hover:border-blue-400"
        onClick={() => {
          const s = value.start ?? new Date()
          const e = value.end ?? addDays(new Date(), 1)
          setDraftStart(s)
          setDraftEnd(e)
          setBaseMonth(startOfMonth(s))
          setFocus('start')
          setOpen((v) => !v)
        }}
      >
        <div>
          <p className="text-xs text-zinc-500">RangePicker（双日历联动 + 时分秒）</p>
          <p className="text-sm font-medium text-zinc-800">
            {value.start && value.end
              ? `${format(value.start, 'yyyy-MM-dd HH:mm:ss')} ~ ${format(value.end, 'yyyy-MM-dd HH:mm:ss')}`
              : '请选择开始和结束时间'}
          </p>
        </div>
        <CalendarDays className="size-5 text-zinc-500" />
      </button>

      {open && (
        <Card className="absolute left-0 top-[calc(100%+10px)] z-30 w-full space-y-4 p-4">
          <div className="grid grid-cols-2 gap-3">
            <button className={cn('rounded-lg border p-3 text-left', focus === 'start' && 'border-blue-500')} onClick={() => setFocus('start')}>
              <p className="text-xs text-zinc-500">开始时间</p>
              <p className="text-sm font-medium">{format(draftStart, 'yyyy-MM-dd HH:mm:ss')}</p>
              <div className={cn('mt-2 h-1 rounded-full', focus === 'start' ? 'bg-blue-600' : 'bg-transparent')} />
            </button>
            <button className={cn('rounded-lg border p-3 text-left', focus === 'end' && 'border-blue-500')} onClick={() => setFocus('end')}>
              <p className="text-xs text-zinc-500">结束时间</p>
              <p className="text-sm font-medium">{format(draftEnd, 'yyyy-MM-dd HH:mm:ss')}</p>
              <div className={cn('mt-2 h-1 rounded-full', focus === 'end' ? 'bg-blue-600' : 'bg-transparent')} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MonthPanel
              month={leftMonth}
              left
              start={draftStart}
              end={draftEnd}
              active={focus}
              mode={leftMode}
              onModeChange={setLeftMode}
              onNavigate={(dir) => {
                setBaseMonth((m) => addMonths(m, dir))
                setLeftMode('date')
                setRightMode('date')
              }}
              onDatePick={setActiveDate}
              onMonthPick={(m) => {
                setBaseMonth(set(leftMonth, { month: m, date: 1 }))
                setLeftMode('date')
              }}
              onYearPick={(y) => {
                setBaseMonth(set(leftMonth, { year: y, date: 1 }))
                setLeftMode('date')
              }}
            />

            <MonthPanel
              month={rightMonth}
              left={false}
              start={draftStart}
              end={draftEnd}
              active={focus}
              mode={rightMode}
              onModeChange={setRightMode}
              onNavigate={(dir) => {
                setBaseMonth((m) => addMonths(m, dir))
                setLeftMode('date')
                setRightMode('date')
              }}
              onDatePick={setActiveDate}
              onMonthPick={(m) => {
                const targetRight = set(rightMonth, { month: m, date: 1 })
                setBaseMonth(subMonths(targetRight, 1))
                setRightMode('date')
              }}
              onYearPick={(y) => {
                const targetRight = set(rightMonth, { year: y, date: 1 })
                setBaseMonth(subMonths(targetRight, 1))
                setRightMode('date')
              }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <TimeColumn label="时" value={activeDate.getHours()} options={HOURS} onChange={(n) => setActiveTime('hours', n)} />
            <TimeColumn label="分" value={activeDate.getMinutes()} options={MINUTES_SECONDS} onChange={(n) => setActiveTime('minutes', n)} />
            <TimeColumn label="秒" value={activeDate.getSeconds()} options={MINUTES_SECONDS} onChange={(n) => setActiveTime('seconds', n)} />
          </div>

          <div className="flex items-center justify-between border-t border-zinc-200 pt-3">
            <Button variant="outline" onClick={reset}>
              重置
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button onClick={commit}>{focus === 'start' ? '确定开始时间' : '确定结束时间'}</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
