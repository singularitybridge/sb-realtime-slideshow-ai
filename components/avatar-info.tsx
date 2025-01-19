import { Avatar, AvatarImage } from "@/components/ui/avatar"

export function AvatarInfo() {
  return (
    <div className="flex flex-col items-center space-y-2 mb-8">
      <Avatar className="h-32 w-32">
        <AvatarImage src="/avatars/jacqueline-avatar.png" alt="Jacqueline Kovalenko" />
      </Avatar>
      <div className="text-center">
        <h3 className="font-semibold">Jacqueline Kovalenko</h3>
        <p className="text-sm text-muted-foreground">Security Expert</p>
      </div>
    </div>
  )
}
