import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DiscordLogoIcon,
    GitHubLogoIcon,
    TwitterLogoIcon,
} from "@radix-ui/react-icons";

export default function Profile() {
    return (
        <div className="mx-auto max-w-[800px] space-y-4 p-4">
            <div className="flex flex-col items-center justify-center gap-2">
                <Avatar className="h-24 w-24">
                    <AvatarImage></AvatarImage>
                    <AvatarFallback className="text-4xl">AI</AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <div className="tracking-light text-xl font-semibold">
                        Akbar Idria
                    </div>
                    <div className="text-muted-foreground">@akbaridria</div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-7 w-7">
                        <TwitterLogoIcon />
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7">
                        <GitHubLogoIcon />
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7">
                        <DiscordLogoIcon />
                    </Button>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <Badge variant="outline">140 Likes</Badge>
                    <Badge variant="outline">50 Page views</Badge>
                    <Badge variant="outline">10 Queries</Badge>
                    <Badge variant="outline">5 Dashboards</Badge>
                </div>
            </div>
            <Separator />
            <div>
                <Tabs defaultValue="account">
                    <div className="space-between flex items-center">
                        <TabsList>
                            <TabsTrigger value="account">Dashboards</TabsTrigger>
                            <TabsTrigger value="password">Queries</TabsTrigger>
                        </TabsList>
                        <div className="ml-auto">oke gan disini</div>
                    </div>
                    <TabsContent value="account">
                        Make changes to your account here.
                    </TabsContent>
                    <TabsContent value="password">
                        Change your password here.
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
