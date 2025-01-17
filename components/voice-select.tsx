import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface VoiceSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

export function VoiceSelector({ value, onValueChange }: VoiceSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-2 mb-8">
        <Avatar className="h-32 w-32">
          <AvatarImage src="/avatars/jacqueline-avatar.png" alt="Jacqueline Kovalenko" />
        </Avatar>
        <div className="text-center">
          <h3 className="font-semibold">Jacqueline Kovalenko</h3>
          <p className="text-sm text-muted-foreground">Security Expert</p>
        </div>
      </div>
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
