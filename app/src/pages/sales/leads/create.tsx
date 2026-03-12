import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function LeadCreatePage() {
    return (
        <div className="flex flex-col pb-10">
            <div className="sticky -top-6 z-10 -mx-4 md:-mx-8 bg-slate-50 py-3 border-b border-slate-200 px-4 md:px-8 flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Lead</h1>
                <Button className="rounded-lg px-6 py-5 font-bold shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all">Save</Button>
            </div>
            <Card className="mt-4 border border-slate-200 rounded-3xl">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-800">Lead Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Lead Owner</label>
                            <Input className="py-5 flex-1" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Company</label>
                            <Input className="py-5 flex-1" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">First Name</label>
                            <Input className="py-5 flex-1" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Last Name</label>
                            <Input className="py-5 flex-1" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Phone</label>
                            <Input className="py-5 flex-1" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Mobile</label>
                            <Input className="py-5 flex-1" />
                        </div>
                    </div>

                    <div className="space-y-3 pt-6">
                        <p className="text-base font-semibold text-slate-800">Address Information</p>
                        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32">Street</label>
                                <Input className="py-5 flex-1" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32">District</label>
                                <Input className="py-5 flex-1" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32">Sub District</label>
                                <Input className="py-5 flex-1" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32">City</label>
                                <Input className="py-5 flex-1" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32">Country</label>
                                <Input className="py-5 flex-1" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32">Zip Code</label>
                                <Input className="py-5 flex-1" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-6">
                        <p className="text-base font-semibold text-slate-800">Additional Information</p>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-600">Description</label>
                            <Textarea className="min-h-[120px]" />
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
