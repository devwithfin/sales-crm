import { useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

/* 
  Wait, I remember 'select' might be missing in some parts. 
  Let's check if select component exists in components/ui
*/

export default function UserCreatePage() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col pb-10">
            {/* Header */}
            <div className="sticky -top-6 z-10 -mx-4 md:-mx-8 bg-slate-50 py-3 border-b border-slate-200 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(-1)}
                        className="rounded-lg"
                    >
                        <ChevronLeft className="size-5" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create User</h1>
                </div>
                <Button className="rounded-lg px-6 py-5 font-bold shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all">Save User</Button>
            </div>

            {/* Section 1: User Information */}
            <Card className="mt-4 border border-slate-200 rounded-3xl">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-800">User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Full Name</label>
                            <Input className="py-5 flex-1" placeholder="Enter full name" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Email</label>
                            <Input type="email" className="py-5 flex-1" placeholder="enter@email.com" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Role</label>
                            <Input className="py-5 flex-1" placeholder="Select role" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Department</label>
                            <Input className="py-5 flex-1" placeholder="e.g. Sales, IT" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Status</label>
                            <Input className="py-5 flex-1" defaultValue="Active" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Security */}
            <Card className="mt-6 border border-slate-200 rounded-3xl">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-800">Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Password</label>
                            <Input type="password" className="py-5 flex-1" placeholder="••••••••" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Confirm</label>
                            <Input type="password" className="py-5 flex-1" placeholder="••••••••" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
