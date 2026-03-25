import { useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function RoleCreatePage() {
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
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Role</h1>
                </div>
                <Button className="rounded-lg px-6 py-5 font-bold shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all">Save Role</Button>
            </div>

            {/* Section 1: Role Information */}
            <Card className="mt-4 border border-slate-200 rounded-3xl">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-800">Role Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Role Name</label>
                            <Input className="py-5 flex-1" placeholder="e.g. Sales Manager" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-600">Description</label>
                        <Textarea 
                            className="min-h-[120px] rounded-2xl border-slate-200 focus:border-primary/30 focus:ring-primary/10" 
                            placeholder="Enter role description..." 
                        />
                    </div>
                </CardContent>
            </Card>


        </div>
    )
}
