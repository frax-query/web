import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DiscordLogoIcon,
    GitHubLogoIcon,
    TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { RiSearchLine } from "@remixicon/react";

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
                            <TabsTrigger value="account">
                                Dashboards
                            </TabsTrigger>
                            <TabsTrigger value="password">Queries</TabsTrigger>
                        </TabsList>
                        <div className="relative ml-auto">
                            <RiSearchLine className="lucide lucide-search absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-[250px] px-8"
                            />
                        </div>
                    </div>
                    <TabsContent value="account">
                        <TableDashboard />
                    </TabsContent>
                    <TabsContent value="password">
                        Change your password here.
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

const TableDashboard = () => {
    return (
        <>
            <Table className="mt-4">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" disabled>
                    <ChevronLeftIcon />
                    <div>Prev</div>
                </Button>
                <Button variant="outline" size="sm">
                    <div>Next</div>
                    <ChevronRightIcon />
                </Button>
            </div>
        </>
    );
};