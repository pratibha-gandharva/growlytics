import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip 
} from 'recharts'
import { EvaluatedSkill } from '../../types'
import { useTheme } from '../../context/theme-context'

interface SkillRadarChartProps {
  skills: EvaluatedSkill[]
}

export function SkillRadarChart({ skills }: SkillRadarChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Format skills for Radar chart
  const data = skills.slice(0, 7).map((s) => ({
    subject: s.skillName.length > 18 ? s.skillName.slice(0, 15) + '...' : s.skillName,
    fullName: s.skillName,
    'Your Level': s.currentLevel,
    'Target Benchmark': s.targetLevel,
  }))

  return (
    <div className="w-full h-[320px] sm:h-[360px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke={isDark ? '#24352b' : '#e2e6dd'} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: isDark ? '#9db1a2' : '#616e64', fontSize: 11 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 5]} 
            tick={{ fill: isDark ? '#9db1a2' : '#616e64', fontSize: 10 }}
          />
          <Radar
            name="Your Level"
            dataKey="Your Level"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.45}
          />
          <Radar
            name="Target Benchmark"
            dataKey="Target Benchmark"
            stroke={isDark ? '#a78bfa' : '#6366f1'}
            fill={isDark ? '#a78bfa' : '#6366f1'}
            fillOpacity={0.2}
            strokeDasharray="4 4"
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload
                return (
                  <div className="rounded-xl bg-card border border-border p-3 shadow-lg text-xs space-y-1">
                    <p className="font-bold text-foreground">{item.fullName}</p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Your Demonstrated Level: {item['Your Level']} / 5
                    </p>
                    <p className="text-purple-600 dark:text-purple-400 font-semibold">
                      Role Requirement Target: {item['Target Benchmark']} / 5
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
