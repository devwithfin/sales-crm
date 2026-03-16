import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Plus, MessageSquare, Paperclip } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function DealDetailPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const dealTitle = location.state?.title || "Deal Details"

    return (
        <div className="flex flex-col pb-10 animate-in fade-in duration-700">
            {/* Sticky Header exactly like products/create */}
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
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">{dealTitle}</h1>
                </div>
                <Button className="rounded-lg px-6 py-5 font-bold shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all">Save</Button>
            </div>

            <Card className="mt-4 border border-slate-200 rounded-3xl">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-800">Deal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                        {/* Deal Owner */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Deal Owner</label>
                            <Input className="py-5 flex-1" defaultValue="Budi Santoso" />
                        </div>

                        {/* Stage */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Stage</label>
                            <Input className="py-5 flex-1" defaultValue="To Do" />
                        </div>

                        {/* Start Date */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Start Date</label>
                            <Input type="date" className="py-5 flex-1" />
                        </div>

                        {/* Closing Date */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Closing Date</label>
                            <Input type="date" className="py-5 flex-1" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6 border border-slate-200 rounded-3xl">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-800">Contact Person</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                        {/* Contact Name */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Contact Name</label>
                            <Input className="py-5 flex-1" placeholder="Enter name" />
                        </div>

                        {/* Company */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Company</label>
                            <Input className="py-5 flex-1" placeholder="Enter company" />
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Email</label>
                            <Input type="email" className="py-5 flex-1" placeholder="Enter email" />
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Phone</label>
                            <Input className="py-5 flex-1" placeholder="Enter phone number" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6 border border-slate-200 rounded-3xl">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-800">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                        {/* Account Name */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Account Name</label>
                            <Input className="py-5 flex-1" placeholder="Enter account name" />
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Phone</label>
                            <Input className="py-5 flex-1" placeholder="Enter phone" />
                        </div>

                        {/* Website */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Website</label>
                            <Input className="py-5 flex-1" placeholder="Enter website" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="mt-6 border border-slate-200 rounded-3xl">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-800">Description Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-600">Description</label>
                        <Textarea className="min-h-[120px] rounded-xl" placeholder="Enter description details..." />
                    </div>
                </CardContent>
            </Card>
            <Card className="mt-6 border border-slate-200 rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-base font-semibold text-slate-800">Notes</CardTitle>
                    <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-600 gap-2">
                        <Plus className="size-4" /> Add Note
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="size-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                            <MessageSquare className="size-5 text-slate-400" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-700 leading-relaxed">
                                Client requested a follow-up call next week to discuss the technical specifications and bulk pricing.
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium">Budi Santoso • 16 Mar 2026, 10:30 AM</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6 border border-slate-200 rounded-3xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-base font-semibold text-slate-800">Attachment</CardTitle>
                    <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-600 gap-2">
                        <Plus className="size-4" /> Upload
                    </Button>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0">
                    <div className="group flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                <Paperclip className="size-5 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-700">quotation_rev01.pdf</p>
                                <p className="text-[11px] text-slate-400 font-medium uppercase">PDF • 2.4 MB</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary font-bold">Download</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
