import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface VoiceSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

export function VoiceSelector({ value, onValueChange }: VoiceSelectorProps) {
  return (
    <div className="form-group space-y-2">
      <Label htmlFor="voiceSelect" className="text-sm font-medium">Select Voice</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ash">Ash (Balanced)</SelectItem>
          <SelectItem value="ballad">Ballad (Melodic)</SelectItem>
          <SelectItem value="coral">Coral (Warm)</SelectItem>
          <SelectItem value="sage">Sage (Wise)</SelectItem>
          <SelectItem value="verse">Verse (Poetic)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
