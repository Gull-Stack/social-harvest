import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <Header title="Settings" />
      <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=harvest" />
                  <AvatarFallback>BM</AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-primary text-white">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium">Profile Photo</p>
                <p className="text-xs text-muted-foreground">JPG, PNG. Max 2MB.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input defaultValue="Bryce Morgan" />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input defaultValue="bryce" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea defaultValue="Building communities and breaking things." rows={3} />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose what you get notified about</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "New replies to your posts", description: "Get notified when someone comments", default: true },
              { label: "Mentions", description: "When someone @mentions you", default: true },
              { label: "New posts in spaces", description: "Activity in spaces you belong to", default: false },
              { label: "Email digests", description: "Weekly summary of community activity", default: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <Switch defaultChecked={item.default} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" size="sm">Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
