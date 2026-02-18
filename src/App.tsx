import { RangeDateTimePicker } from '@/components/range-datetime-picker'

export default function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center p-6">
      <div className="mb-6 w-full text-left">
        <h1 className="text-2xl font-semibold">Antd 风格双日历 RangePicker（React + TS + Tailwind）</h1>
        <p className="mt-2 text-sm text-zinc-600">双面板联动、开始/结束分步确认、自动纠正时间先后、支持时分秒与年月快速切换。</p>
      </div>
      <RangeDateTimePicker />
    </main>
  )
}
