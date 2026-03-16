import { useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function VisitCreatePage() {
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
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Visit</h1>
                </div>
                <Button className="rounded-lg px-6 py-5 font-bold shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all">Save</Button>
            </div>

            {/* Section 1: Visit Information */}
            <Card className="mt-4 border border-slate-200 rounded-3xl">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-800">Visit Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Title</label>
                            <Input className="py-5 flex-1" placeholder="Enter visit title" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Location</label>
                            <Input className="py-5 flex-1" placeholder="Enter location" />
                        </div>
                        
                        {/* From Date & Time */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">From</label>
                            <div className="flex flex-1 gap-2">
                                <Input type="date" className="py-5 flex-1" />
                                <Input type="time" className="py-5 w-32" />
                            </div>
                        </div>

                        {/* To Date & Time */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">To</label>
                            <div className="flex flex-1 gap-2">
                                <Input type="date" className="py-5 flex-1" />
                                <Input type="time" className="py-5 w-32" />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Host</label>
                            <Input className="py-5 flex-1" placeholder="Enter host name" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Participant</label>
                            <Input className="py-5 flex-1" placeholder="Enter participants" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Related to</label>
                            <Input className="py-5 flex-1" placeholder="Lead, Contact, or Account" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Description Information */}
            <Card className="mt-6 border border-slate-200 rounded-3xl">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-800">Description Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-600">Description</label>
                        <Textarea className="min-h-[120px] rounded-xl" placeholder="Enter visit details..." />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
